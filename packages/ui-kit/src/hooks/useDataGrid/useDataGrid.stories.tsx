import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import axiosInstance from '../../../../../app/storybook/src/axios'
import { RelativeTimeRange, Sort } from '../../graphql'
import { storybookCodeTemplate } from '../../helpers'
import { useStorybookAccessToken } from '../../helpers/useStorybookAccessToken'

import { DataGridQueryProps } from '../../components/DataGrid/DataGrid.types'
import '../css/stories.css'
import { useDataGrid } from './useDataGrid'

const args: DataGridQueryProps = {
  dataPool: {
    name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1 ?? ''
  },
  columns: [
    process.env.STORYBOOK_DIMENSION_1 ?? '',
    process.env.STORYBOOK_DIMENSION_2 ?? '',
    process.env.STORYBOOK_DIMENSION_3 ?? ''
  ],
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 30
  },
  sort: Sort.Asc,
  first: 5,
  last: 5
}

const meta: Meta = {
  title: 'Components/DataGrid',
  tags: ['hidden'],
  parameters: {
    imports: ['useDataGrid', 'useAccessToken'],
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

let id = 0

export const DataGridStory: Story = {
  args,
  render: (args) =>
    (function DataGrid() {
      const { accessToken } = useStorybookAccessToken(axiosInstance)
      const { data } = useDataGrid({ ...args, accessToken })
      const { headers, rows } = data?.dataGrid ?? {}

      return (
        <div>
          <table>
            <thead>
              <tr>
                {headers?.map((header) => (
                  <th key={id++}>{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows?.map((row) => (
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
