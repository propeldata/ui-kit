import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import axiosInstance from '../../../../../app/storybook/src/axios'
import { storybookCodeTemplate, useStorybookAccessToken } from '../../helpers'

import { useRecordsById } from './useRecordsById'
import { RecordsByIdQueryProps } from '../../components/RecordsById/RecordsById.types'
import './useRecordsById.stories.css'

const args: RecordsByIdQueryProps = {
  accessToken: '<PROPEL_ACCESS_TOKEN>',
  dataPoolId: process.env.STORYBOOK_WEBHOOK_DATAPOOL_ID ?? '',
  columns: ['foo', 'bar', '_propel_received_at'],
  uniqueIds: ['1', '2', '3', '4', '5']
}

const meta: Meta = {
  title: 'Components/RecordsById',
  tags: ['pattern'],
  parameters: {
    imports: ['useRecordsById', 'useAccessToken'],
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
        .replace(process.env.STORYBOOK_WEBHOOK_DATAPOOL_ID ?? '', '<PROPEL_DATAPOOL_ID>')
        .concat(' }')
  }
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

let id = 0

export const RecordsByIdStory: Story = {
  args,
  render: (args) =>
    (function RecordsById() {
      const { accessToken } = useStorybookAccessToken(axiosInstance)
      const { data } = useRecordsById({ ...args, accessToken })
      const { columns, values } = data?.recordsByUniqueId ?? {}

      return (
        <div>
          <table>
            <thead>
              <tr>
                {columns?.map((header) => (
                  <th key={id++}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {values?.map((row) => (
                <tr key={id++}>
                  {row?.map((cell) => (
                    <td key={id++}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
    })()
}
