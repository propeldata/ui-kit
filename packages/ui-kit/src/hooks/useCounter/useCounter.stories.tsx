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
    imports: ['useCounter', 'useAccessToken'],
    isFunction: true,
    codeTemplate: storybookCodeTemplate,
    transformBody: (body: string) => `${body.replace(`useStorybookAccessToken(axiosInstance)`, 'useAccessToken()')} }`
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
  render: (args) =>
    (function Fraction(numerator, denominator) {
      const { accessToken } = useStorybookAccessToken(axiosInstance)
      // useCounter hoooks with query params timeRange set to last 30 days
      const { data: numeratorData } = useCounter({ ...numerator, accessToken })
      // useCounter hoooks with query params timeRange set to last 90 days
      const { data: denominatorData } = useCounter({ ...denominator, accessToken })
      return <p>{fractionUnicode(numeratorData?.counter?.value ?? '', denominatorData?.counter?.value ?? '')}</p>
    })(args.numerator, args.denominator)
}
