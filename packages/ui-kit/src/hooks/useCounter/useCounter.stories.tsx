import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import axiosInstance from '../../../../../app/storybook/src/axios'
import { storybookCodeTemplate, RelativeTimeRange, useStorybookAccessToken } from '../../helpers'
import { useCounter } from './useCounter'

const args = {
  numerator: {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
    timeRange: {
      relative: RelativeTimeRange.LastNDays,
      n: 30
    }
  },
  denominator: {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
    timeRange: {
      relative: RelativeTimeRange.LastNDays,
      n: 90
    }
  }
}

// This is a function that returns a React component
const fractionUnicode = (numerator: string, denominator: string) => (
  <>
    <sup>{numerator}</sup> / <sub>{denominator}</sub>
  </>
)

const Fraction: React.FC<unknown> = () => {}

const meta: Meta<typeof Fraction> = {
  title: 'Components/Fraction',
  tags: ['pattern'],
  component: Fraction,
  parameters: {
    imports: ['useCounter', 'useAccessToken'],
    isFunction: true,
    codeTemplate: storybookCodeTemplate,
    transformBody: (body: string) =>
      body
        .replace(`useStorybookAccessToken(axiosInstance)`, 'useAccessToken()')
        .replace(
          `{
      ...args.numerator,
      accessToken
    }`,
          `${JSON.stringify(args.numerator)}`
        )
        .replace(
          `{
      ...args.denominator,
      accessToken
    }`,
          `${JSON.stringify(args.denominator)}`
        )
        .concat(' }')
  }
} satisfies Meta<typeof Fraction>

export default meta

type Story = StoryObj<typeof meta>

export const FractionUnicode: Story = {
  args,
  render: (args) =>
    (function Fraction() {
      const { accessToken } = useStorybookAccessToken(axiosInstance)
      // useCounter hoooks with query params timeRange set to last 30 days
      const { data: numerator } = useCounter({ ...args.numerator, accessToken })
      // useCounter hoooks with query params timeRange set to last 90 days
      const { data: denominator } = useCounter({ ...args.denominator, accessToken })
      return <p>{fractionUnicode(numerator?.counter?.value ?? '', denominator?.counter?.value ?? '')}</p>
    })()
}
