import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import axiosInstance from '../../../../../app/storybook/src/axios'
import { RelativeTimeRange, Sort } from '../../graphql'
import { storybookCodeTemplate } from '../../helpers'
import { useStorybookAccessToken } from '../../helpers/useStorybookAccessToken'
import '../css/stories.css'
import { useLeaderboard } from './useLeaderboard'

const args = {
  accessToken: '<PROPEL_ACCESS_TOKEN>',
  metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
  rowLimit: 5,
  dimensions: [
    {
      columnName: process.env.STORYBOOK_DIMENSION_1 as string
    }
  ],
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 30
  },
  sort: Sort.Asc
}

const meta: Meta = {
  title: 'Components/LeaderboardTable',
  tags: ['hidden'],
  parameters: {
    imports: ['useLeaderboard', 'useAccessToken'],
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

export const LeaderboardTable: Story = {
  args,
  render: (args) =>
    (function Leaderboard() {
      const { accessToken } = useStorybookAccessToken(axiosInstance)
      const { data } = useLeaderboard({ ...args, accessToken })
      const { headers, rows } = data?.leaderboard ?? {}

      return (
        <table>
          <thead>
            <tr>
              {headers?.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows?.map((row) => (
              <tr key={row[0]}>
                <td key={row[0]}>{row[0]}</td>
                <td key={row[1]}>{row[1]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )
    })()
}
