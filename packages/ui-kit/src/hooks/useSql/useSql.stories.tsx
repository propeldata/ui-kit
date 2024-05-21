import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import axiosInstance from '../../../../../app/storybook/src/axios'
import { storybookCodeTemplate, useStorybookAccessToken } from '../../helpers'

import { SqlQueryProps } from './Sql.types'
import { useSql } from './useSql'
import '../css/stories.css'

const args: SqlQueryProps = {
  accessToken: '<PROPEL_ACCESS_TOKEN>',
  /* eslint-disable no-useless-escape */
  query: `SELECT quantity, taco_name, sauce_name, restaurant_name, taco_total_price FROM \"TacoSoft Demo Data\" LIMIT 5`
}

const meta: Meta = {
  title: 'Components/Sql',
  tags: ['hidden'],
  parameters: {
    imports: ['useSql', 'useAccessToken'],
    isFunction: true,
    codeTemplate: storybookCodeTemplate,
    transformBody: (body: string) =>
      body
        .replace(`useStorybookAccessToken(axiosInstance)`, 'useAccessToken()')
        .replace(
          `{
      ...args,
      accessToken
    }`,
          `${JSON.stringify(args)}`
        )
        .concat(' }')
  }
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const SqlStory: Story = {
  args,
  render: (args) =>
    (function Sql() {
      const { accessToken } = useStorybookAccessToken(axiosInstance)
      const { data } = useSql({ ...args, accessToken })
      const { columns, rows } = data?.sqlV1 ?? {}

      return (
        <div>
          <table>
            <thead>
              <tr>
                {columns?.map((col, index) => (
                  <th key={index}>{col?.columnName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows?.map((row, i) => (
                <tr key={i}>
                  {row?.map((cell, k) => (
                    <td key={k}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    })()
}
