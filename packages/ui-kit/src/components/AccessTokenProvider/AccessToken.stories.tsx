import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Counter, TimeSeries } from '..'
import axiosInstance from '../../../../../app/storybook/src/axios'
import { RelativeTimeRange } from '../../graphql'
import { fetchStorybookAccessToken, storybookCodeTemplate } from '../../helpers'
import { AccessTokenProvider } from './AccessTokenProvider'

const meta: Meta = {
  title: 'PROVIDERS/AccessTokenProvider',
  tags: ['hidden'],
  parameters: {
    imports: 'TimeSeries, Counter, AccessTokenProvider',
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof meta>

async function fetchToken() {
  const accessToken = await fetchStorybookAccessToken(axiosInstance)

  return accessToken ?? ''
}

export const AccessTokenProviderStory: Story = {
  args: {
    fetchToken
  },
  argTypes: {
    fetchToken: {
      description: 'The function that fetches the access token.',
      control: { type: 'function' }
    },
    accessToken: {
      description: 'The access token that will be served to the components.',
      control: { type: 'text' }
    }
  },
  render: () => (
    <AccessTokenProvider fetchToken={fetchToken}>
      <TimeSeries query={{ metric: 'Revenue', timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 } }} />
      <Counter query={{ metric: 'Revenue', timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 } }} />
    </AccessTokenProvider>
  )
}
