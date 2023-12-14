import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import axiosInstance from '../../../../../app/storybook/src/axios'
import { storybookCodeTemplate, RelativeTimeRange, useStorybookAccessToken } from '../../helpers'
import { useCounter } from './useCounter'

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
    imports: 'useCounter',
    codeTemplate: storybookCodeTemplate,
    transformBody: (body: string) => {
      return body
    }
  }
} satisfies Meta<typeof Fraction>

export default meta

type Story = StoryObj<typeof meta>

export const FractionUnicode: Story = {
  args: {
    numerator: {
      metric: 'Revenue',
      timeRange: {
        relative: RelativeTimeRange.LastNDays,
        n: 30
      }
    },
    denominator: {
      metric: 'Revenue',
      timeRange: {
        relative: RelativeTimeRange.LastNDays,
        n: 90
      }
    }
  },
  argTypes: {},
  render: (args) => {
    function Fraction() {
      const { accessToken } = useStorybookAccessToken(axiosInstance)
      // useCounter hoooks with query params timeRange set to last 30 days
      const numerator = useCounter({ ...args.numerator, accessToken })
      // useCounter hoooks with query params timeRange set to last 90 days
      const denominator = useCounter({ ...args.denominator, accessToken })
      return <p>{fractionUnicode(numerator?.data?.counter?.value ?? '', denominator?.data?.counter?.value ?? '')}</p>
    }
    return Fraction()
  }
}
