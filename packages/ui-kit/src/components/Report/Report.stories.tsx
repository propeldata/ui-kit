import React from 'react'

import { Meta, StoryObj } from '@storybook/react'
import { quotedStringRegex, storybookCodeTemplate } from '../../helpers'
import { Report } from './Report'
import { AccessTokenProvider } from '../AccessTokenProvider'

type Story = StoryObj<typeof Report>

const meta: Meta<typeof Report> = {
  title: 'Components/Report',
  component: Report,
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'PieChart, RelativeTimeRange',
    transformBody: (body: string) => body.replace(quotedStringRegex('LAST_N_DAYS'), 'RelativeTimeRange.LastNDays'),
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

export const Basic: Story = {
  args: {
    layout: [
      ['timeSeries', 'timeSeries', 'leaderboard'],
      ['counter1', 'counter2', 'leaderboard'],
      ['timeSeries2', 'timeSeries2', 'timeSeries2']
    ],
    charts: [
      {
        id: 'timeSeries',
        query: `query TimeSeriesQuery($input: TimeSeriesInput!) {
        timeSeries(input: $input) {
          labels
          values
        }
      }`,
        type: 'timeSeries',
        variables: `{
        "input": {
          "metric": {
            "count": {
              "dataPool": {
                "id": "DPO01HB9W3DCA1756WT6CJ6BV9H48"
              }
            }
          },
          "timeZone": "UTC",
          "granularity": "DAY",
          "timeRange": {
            "relative": "LAST_N_DAYS",
            "n": 30
          },
          "filters": []
        }
      }`
      },
      {
        id: `leaderboard`,
        query: ``,
        type: '',
        variables: `{}`
      },
      {
        id: 'counter1',
        query: `query CounterQuery($input: CounterInput!) {
        counter(input: $input) {
          value
        }
      }`,
        type: 'counter',
        variables: `{
        "input": {
          "metric": {
            "count": {
              "dataPool": {
                "id": "DPO01HB9W3DCA1756WT6CJ6BV9H48"
              }
            }
          },
          "timeZone": "UTC",
          "timeRange": {
            "relative": "LAST_N_DAYS",
            "n": 30
          },
          "filters": []
        }
      }`
      },
      {
        id: 'counter2',
        query: `query CounterQuery($input: CounterInput!) {
        counter(input: $input) {
          value
        }
      }`,
        type: 'counter',
        variables: `{
        "input": {
          "metric": {
            "count": {
              "dataPool": {
                "id": "DPO01HB9W3DCA1756WT6CJ6BV9H48"
              }
            }
          },
          "timeZone": "UTC",
          "timeRange": {
            "relative": "LAST_N_DAYS",
            "n": 30
          },
          "filters": [
            {
              "column": "quantity",
              "operator": "EQUALS",
              "value": "2"
            }
          ]
        }
      }`
      },
      {
        id: 'timeSeries2',
        query: `query TimeSeriesQuery($input: TimeSeriesInput!) {
        timeSeries(input: $input) {
          labels
          values
        }
      }`,
        type: 'timeSeries',
        variables: `{
        "input": {
          "metric": {
            "count": {
              "dataPool": {
                "id": "DPO01HB9W3DCA1756WT6CJ6BV9H48"
              }
            }
          },
          "timeZone": "UTC",
          "granularity": "DAY",
          "timeRange": {
            "relative": "LAST_N_DAYS",
            "n": 30
          },
          "filters": [
            {
              "column": "quantity",
              "operator": "EQUALS",
              "value": "2"
            }
          ]
        }
      }`
      }
    ]
  },
  render: (args) => (
    <AccessTokenProvider accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3RpbWUiOjE3MTI2ODQ0MzMsImNsaWVudF9pZCI6IjNhdDY2YjByaWlnazlyZ2JyYzBpcjE3OGY0IiwiZXhwIjoxNzEyNjg4MDMzLCJpYXQiOjE3MTI2ODQ0MzMsImlzcyI6Imh0dHBzOi8vYXV0aC51cy1lYXN0LTIucHJvcGVsZGF0YS5jb20iLCJqdGkiOiI4M2FlY2Y4Mi01ZmI4LTRjNzgtOTcxMi0wOTY3MzdkYjMyMjAiLCJzY29wZSI6ImFkbWluIG1ldHJpYzpxdWVyeSBtZXRyaWM6c3RhdHMiLCJzdWIiOiIzYXQ2NmIwcmlpZ2s5cmdicmMwaXIxNzhmNCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInZlcnNpb24iOjF9.G7sOqKXgrXzx7g8LlecJHdxkI4oNaFQBRiwVfWiWf5Y">
      <Report {...args} />
    </AccessTokenProvider>
  )
}

export const Test: Story = {
  args: {
    layout: [
      ['a60675eefa49741608c1610f8f8b25116', 'a60675eefa49741608c1610f8f8b25116', 'a76d31602c6224c2ca3e2e36d2afcc30e'],
      ['a19c883f0281c4fa8852d453faba28b8d', 'a877df96b498b45bf84b1a21d022a4fb5', 'a76d31602c6224c2ca3e2e36d2afcc30e'],
      ['a7315e8ad8d004c9597e211d75f9117ba', 'a7315e8ad8d004c9597e211d75f9117ba', 'a7315e8ad8d004c9597e211d75f9117ba']
    ],
    charts: [
      {
        id: 'a60675eefa49741608c1610f8f8b25116',
        type: 'counter',
        query: '{}',
        variables: '{}'
      },
      {
        id: 'a76d31602c6224c2ca3e2e36d2afcc30e',
        type: 'counter',
        query: '{}',
        variables: '{}'
      },
      {
        id: 'a19c883f0281c4fa8852d453faba28b8d',
        type: 'counter',
        query: '{}',
        variables: '{}'
      },
      {
        id: 'a877df96b498b45bf84b1a21d022a4fb5',
        type: 'counter',
        query: '{}',
        variables: '{}'
      },
      {
        id: 'a7315e8ad8d004c9597e211d75f9117ba',
        type: 'counter',
        query: '{}',
        variables: '{}'
      }
    ],
    reportCardProps: { className: 'shadow-sm' }
  },
  render: (args) => (
    <AccessTokenProvider accessToken="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3RpbWUiOjE3MTI2ODQ0MzMsImNsaWVudF9pZCI6IjNhdDY2YjByaWlnazlyZ2JyYzBpcjE3OGY0IiwiZXhwIjoxNzEyNjg4MDMzLCJpYXQiOjE3MTI2ODQ0MzMsImlzcyI6Imh0dHBzOi8vYXV0aC51cy1lYXN0LTIucHJvcGVsZGF0YS5jb20iLCJqdGkiOiI4M2FlY2Y4Mi01ZmI4LTRjNzgtOTcxMi0wOTY3MzdkYjMyMjAiLCJzY29wZSI6ImFkbWluIG1ldHJpYzpxdWVyeSBtZXRyaWM6c3RhdHMiLCJzdWIiOiIzYXQ2NmIwcmlpZ2s5cmdicmMwaXIxNzhmNCIsInRva2VuX3VzZSI6ImFjY2VzcyIsInZlcnNpb24iOjF9.G7sOqKXgrXzx7g8LlecJHdxkI4oNaFQBRiwVfWiWf5Y">
      <Report {...args} />
    </AccessTokenProvider>
  )
}