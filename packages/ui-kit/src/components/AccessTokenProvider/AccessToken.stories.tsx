import React from 'react'
import type { Meta, StoryObj } from '@storybook/react'

import { fetchStorybookAccessToken, RelativeTimeRange, storybookCodeTemplate } from '../../helpers'
import axiosInstance from '../../../../../app/storybook/src/axios'
import { AccessTokenProvider } from './AccessTokenProvider'
import { TimeSeries, Counter } from '..'

const meta: Meta = {
  title: 'PROVIDERS/AccessTokenProvider',
  tags: ['pattern'],
  parameters: {
    imports: 'TimeSeries, Counter, AccessTokenProvider',
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof meta>

async function fetchAccessToken() {
  const accessToken = await fetchStorybookAccessToken(axiosInstance)

  return accessToken ?? ''
}

export const AccessTokenProviderStory: Story = {
  args: {
    fetchToken: fetchAccessToken
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  render: (_) => {

    const fetchToken = async () => {
      const accessToken = await fetchAccessToken()

      return accessToken
    }

    return (
      <AccessTokenProvider fetchToken={fetchToken}>
        <TimeSeries query={{ metric: 'Revenue', timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 } }} />
        <Counter query={{ metric: 'Revenue', timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 } }} />
      </AccessTokenProvider>
    )
  }
}
