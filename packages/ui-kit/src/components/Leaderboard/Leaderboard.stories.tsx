import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import axiosInstance from '../../../../../app/storybook/src/axios'
import { RelativeTimeRange, Sort, useStorybookAccessToken } from '../../helpers'
import { Leaderboard, LeaderboardComponent } from './Leaderboard'

const meta: Meta<typeof LeaderboardComponent> = {
  title: 'Components/Leaderboard',
  component: LeaderboardComponent,
  render: (args) => <Leaderboard {...args} />
}

export default meta

type Story = StoryObj<typeof LeaderboardComponent>

const barHeaders = ['DATA_SOURCE_TYPE', 'value']

const barRows = [
  ['Http', '7498734'],
  ['Snowflake', '6988344'],
  ['S3', '203245'],
  ['Redshift', '19594']
]

const tableHeaders = ['Book title', 'Total sold']

const tableRows = [
  ["John's way or Highway", '12863002'],
  ['How to Speak Native Animal', '7865371'],
  ['Cell Lost in a Sea of Desert', '622027'],
  ['Flying nowhere special', '462791'],
  ['The Lean Product Book', '1']
]

const ConnectedLeaderboardTemplate = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(
    axiosInstance,
    process.env.STORYBOOK_PROPEL_ACCESS_TOKEN,
    process.env.STORYBOOK_TOKEN_URL
  )

  if (accessToken === undefined) {
    return null
  }

  return (
    <Leaderboard
      {...{
        ...args,
        query: {
          ...args?.query,
          accessToken
        }
      }}
    />
  )
}

export const SingleDimensionStory: Story = {
  name: 'Single dimension',
  args: {
    headers: barHeaders,
    rows: barRows
  }
}

export const SingleDimensionTableVariantStory: Story = {
  name: 'Single dimension table variant',
  args: {
    variant: 'table',
    headers: tableHeaders,
    rows: tableRows
  }
}

export const SingleDimensionTableVariantWithValueBarStory: Story = {
  name: 'Single dimension table variant with value bar',
  args: {
    variant: 'table',
    headers: tableHeaders,
    rows: tableRows,
    styles: {
      table: {
        hasValueBar: true,
        valueColumn: {
          localize: true
        }
      }
    }
  }
}

export const ConnectedStory: Story = {
  name: 'Connected',
  args: {
    variant: 'table',
    headers: [
      process.env.STORYBOOK_DIMENSION_1,
      process.env.STORYBOOK_DIMENSION_2,
      process.env.STORYBOOK_DIMENSION_3
    ] as string[],
    query: {
      accessToken: process.env.STORYBOOK_PROPEL_ACCESS_TOKEN,
      metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
      timeRange: {
        relative: RelativeTimeRange.LastNDays,
        n: 30
      },
      rowLimit: 10,
      dimensions: [
        {
          columnName: process.env.STORYBOOK_DIMENSION_1 as string
        },
        {
          columnName: process.env.STORYBOOK_DIMENSION_2 as string
        },
        {
          columnName: process.env.STORYBOOK_DIMENSION_3 as string
        }
      ],
      sort: Sort.Asc
    },
    styles: {
      table: {
        hasValueBar: true
      },
      canvas: {
        height: 500
      }
    }
  },
  render: (args) => <ConnectedLeaderboardTemplate {...args} />
}

export const CustomStyleStory: Story = {
  name: 'Custom styles',
  tags: ['pattern'],
  args: {
    variant: 'table',
    headers: tableHeaders,
    rows: tableRows,
    styles: {
      font: {
        size: '14px'
      },
      table: {
        stickyHeader: true,
        height: '200px',
        hasValueBar: true,
        backgroundColor: '#191414',
        header: {
          align: 'center',
          backgroundColor: '#282828',
          font: {
            color: '#1DB954',
            weight: 'bold',
            size: '18px'
          }
        },
        valueBar: {
          color: '#1DB954',
          backgroundColor: '#545454'
        },
        valueColumn: {
          align: 'center',
          backgroundColor: '#191414',
          font: {
            color: '#1DB954'
          }
        },
        columns: {
          align: 'center',
          font: {
            color: '#1DB954'
          }
        }
      }
    }
  }
}

export const ConnectedBasicStory: Story = {
  name: 'Connected basic',
  args: {
    headers: [process.env.STORYBOOK_DIMENSION_1] as string[],
    query: {
      accessToken: process.env.STORYBOOK_PROPEL_ACCESS_TOKEN,
      metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
      timeRange: {
        relative: RelativeTimeRange.LastNDays,
        n: 30
      },
      rowLimit: 5,
      dimensions: [
        {
          columnName: process.env.STORYBOOK_DIMENSION_1 as string
        }
      ],
      sort: Sort.Asc
    }
  },
  render: (args) => <ConnectedLeaderboardTemplate {...args} />
}
