import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import axiosInstance from '../../../../../app/storybook/src/axios'
import { storybookCodeTemplate, RelativeTimeRange, useStorybookAccessToken } from '../../helpers'

import { useTopValues } from './useTopValues'
import { TopValuesQueryProps } from '../../components/TopValues/TopValues.types'

const args: TopValuesQueryProps = {
  dataPool: {
    name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1 ?? ''
  },
  columnName: process.env.STORYBOOK_COLUMN_NAME_1,
  maxValues: 5,
  timeRange: {
    relative: RelativeTimeRange.LastNDays,
    n: 30
  }
}

const meta: Meta = {
  title: 'Components/TopValues',
  tags: ['hidden'],
  parameters: {
    imports: ['useTopValues', 'useAccessToken'],
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

export const TopValuesChart: Story = {
  args,
  render: (args) =>
    (function TopValues() {
      const { accessToken } = useStorybookAccessToken(axiosInstance)
      const { data } = useTopValues({ ...args, accessToken })
      const { values } = data?.topValues ?? {}

      return (
        <select name="top-values" id="top-values">
          <option value="" disabled selected>
            Top Restaurants
          </option>
          {values?.map((value) => (
            <option key={id++} value={value}>
              {value}
            </option>
          ))}
        </select>
      )
    })()
}
