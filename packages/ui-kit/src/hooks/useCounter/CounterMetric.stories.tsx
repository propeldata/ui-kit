import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import axiosInstance from '../../../../../app/storybook/src/axios'
import { RelativeTimeRange } from '../../graphql'
import { quotedStringRegex, storybookCodeTemplate } from '../../helpers'
import { useStorybookAccessToken } from '../../helpers/useStorybookAccessToken'
import { useCounter } from './useCounter'

const args = {
  id: {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: { id: process.env.STORYBOOK_METRIC_ID ?? '' },
    timeRange: {
      relative: RelativeTimeRange.LastNDays,
      n: 30
    }
  },
  name: {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: { name: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1 ?? '' },
    timeRange: {
      relative: RelativeTimeRange.LastNDays,
      n: 90
    }
  },
  custom: {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: {
      custom: {
        dataPool: {
          id: process.env.STORYBOOK_DATAPOOL_ID ?? ''
        },
        expression: 'SUM(taco_total_price) / SUM(quantity)'
      }
    },
    timeRange: {
      relative: RelativeTimeRange.LastNDays,
      n: 90
    }
  },
  sum: {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: {
      sum: {
        dataPool: {
          id: process.env.STORYBOOK_DATAPOOL_ID ?? ''
        },
        measure: {
          columnName: 'quantity'
        }
      }
    },
    timeRange: {
      relative: RelativeTimeRange.LastNDays,
      n: 90
    }
  }
}

const meta: Meta = {
  title: 'Components/Metric',
  tags: ['hidden'],
  parameters: {
    imports: ['useCounter', 'useAccessToken'],
    isFunction: true,
    codeTemplate: storybookCodeTemplate,
    transformBody: (body: string) =>
      body
        .replace(
          'function',
          `
      function`
        )
        .replace(`useStorybookAccessToken(axiosInstance)`, 'useAccessToken()')
        .replace(
          `{
      ...args.id,
      accessToken
    }`,
          `${JSON.stringify(args.id)}`
        )
        .replace(
          `{
      ...args.name,
      accessToken
    }`,
          `${JSON.stringify(args.name)}`
        )
        .replace(
          `{
      ...args.custom,
      accessToken
    }`,
          `${JSON.stringify(args.custom)}`
        )
        .replace(
          `{
      ...args.sum,
      accessToken
    }`,
          `${JSON.stringify(args.sum)}`
        )
        .replace(process.env.STORYBOOK_METRIC_ID ?? '', '<PROPEL_METRIC_ID>')
        .replace(process.env.STORYBOOK_DATAPOOL_ID ?? '', '<PROPEL_DATAPOOL_ID>')
        .replace(quotedStringRegex('LAST_N_DAYS'), 'RelativeTimeRange.LastNDays')
        .concat(' }')
  }
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const CounterMetricQueryById: Story = {
  args,
  render: (args) =>
    (function CounterMetricQueryById() {
      const { accessToken } = useStorybookAccessToken(axiosInstance)
      // useCounter hooks with metric query param by id
      const { data } = useCounter({ ...args.id, accessToken })
      return <p>{data?.counter?.value}</p>
    })()
}

export const CounterMetricQueryByName: Story = {
  args,
  render: (args) =>
    (function CounterMetricQueryByName() {
      const { accessToken } = useStorybookAccessToken(axiosInstance)
      // useCounter hooks with metric query param by name
      const { data } = useCounter({ ...args.name, accessToken })
      return <p>{data?.counter?.value}</p>
    })()
}

export const CounterMetricQueryBySum: Story = {
  args,
  render: (args) =>
    (function CounterMetricQueryBySum() {
      const { accessToken } = useStorybookAccessToken(axiosInstance)
      // useCounter hooks with metric query by ad hoc sum metric.
      const { data } = useCounter({ ...args.sum, accessToken })
      return <p>{data?.counter?.value}</p>
    })()
}

export const CounterMetricQueryByCustom: Story = {
  args,
  render: (args) =>
    (function CounterMetricQueryByCustom() {
      const { accessToken } = useStorybookAccessToken(axiosInstance)
      // useCounter hooks with metric query by ad hoc custom metric.
      const { data } = useCounter({ ...args.custom, accessToken })
      return <p>{data?.counter?.value}</p>
    })()
}
