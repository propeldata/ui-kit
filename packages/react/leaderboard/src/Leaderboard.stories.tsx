import React from 'react'
import { Story } from '@storybook/react'
import { RelativeTimeRange, Sort } from '@propeldata/ui-kit-graphql'

import { LeaderboardProps } from './Leaderboard'
import { Container as Leaderboard } from './Container'

export default {
  title: 'React/Leaderboard'
}

const accessToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3RpbWUiOjE2NzQ3NDk5NDksImNsaWVudF9pZCI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwiZXhwIjoxNjc0NzUzNTQ5LCJpYXQiOjE2NzQ3NDk5NDksImlzcyI6Imh0dHBzOi8vYXV0aC51cy1lYXN0LTIuZGV2LnByb3BlbGRhdGEuY29tIiwianRpIjoiYmZlMzhhN2QtYTExMy00MThhLWJjYjEtZDUwMDQzMTU3NmQ1IiwicHJvcGVsL3RlbmFudCI6IkVOVjAxRlgzNjA2UjJLUUZRWVhYMzRBOTZRNlpSIiwic2NvcGUiOiJtZXRyaWM6cXVlcnkgcHJvcGVsL21ldHJpYzpxdWVyeSIsInN1YiI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwidmVyc2lvbiI6MX0.NtVVH90ZNsHToeqd8SSbjN6jCL2L5W2Uv6GbwO2menA'

const barHeaders = ['DATA_SOURCE_TYPE', 'value']

const barRows = [
  ['Http', '7498734'],
  ['Snowflake', '6988344'],
  ['S3', '203245'],
  ['Redshift', '19594']
]

const tableHeaders = ['Book title', 'Publisher', 'Total sold']

const tableRows = [
  ['The Lean Product Book', 'Random House', '354000'],
  ['How to Speak Native Animal', 'Wiley Publishing', '7865371'],
  ['Flying nowhere special', 'Creative Insight Publishing', '62791'],
  ['Cell Lost in a Sea of Desert', 'Monument Publishing', '22027'],
  ["John's way or Highway", 'Create Space Publishing', '12863002']
]

const Template: Story<LeaderboardProps> = (args) => <Leaderboard {...args} />
export const DefaultBar = Template.bind({})
DefaultBar.args = {
  headers: barHeaders,
  rows: barRows
}

export const DefaultTable = Template.bind({})
DefaultTable.args = {
  headers: tableHeaders,
  rows: tableRows
}

export const Smart = Template.bind({})
Smart.args = {
  query: {
    accessToken,
    metric: 'syncRecordsAdded',
    timeRange: {
      relative: RelativeTimeRange.LastNDays,
      n: 30
    },
    rowLimit: 2,
    dimensions: [
      {
        columnName: 'ACCOUNT_ID'
      },
      {
        columnName: 'ENVIRONMENT_ID'
      },
      {
        columnName: 'ENVIRONMENT_REGION'
      },
      {
        columnName: 'DATA_POOL_ID'
      },
      {
        columnName: 'DATA_POOL_UNIQUE_NAME'
      },
      {
        columnName: 'DATA_SOURCE_ID'
      },
      {
        columnName: 'DATA_SOURCE_TYPE'
      },
      {
        columnName: 'DATA_SOURCE_UNIQUE_NAME'
      }
    ],
    sort: Sort.Asc
  }
}

export const Error = Template.bind({})
Error.args = {
  query: {}
}

export const Loading = () => {
  const [loading, setLoading] = React.useState(true)
  const [localHeaders, setLocalHeaders] = React.useState<string[]>()
  const [localRows, setLocalRows] = React.useState<string[][]>()

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
      setLocalHeaders(barHeaders)
      setLocalRows(barRows)
    }, 1000)
  }, [])

  return <Leaderboard loading={loading} headers={localHeaders} rows={localRows} />
}
