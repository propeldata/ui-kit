import { css } from '@emotion/css'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import axiosInstance from '../../../../../app/storybook/src/axios'
import { RelativeTimeRange, useStorybookAccessToken } from '../../helpers'
import { Counter, CounterComponent } from './Counter'

const meta: Meta<typeof CounterComponent> = {
  title: 'Components/Counter',
  component: CounterComponent,
  render: (args) => <ConnectedCounterTemplate {...args} />,
  tags: ['tag']
}

export default meta

type Story = StoryObj<typeof CounterComponent>

const connectedParams = {
  localize: true,
  prefixValue: '$',
  query: {
    metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
    timeRange: {
      relative: RelativeTimeRange.LastNDays,
      n: 30
    }
  }
}

const ConnectedCounterTemplate = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(
    axiosInstance,
    process.env.STORYBOOK_PROPEL_ACCESS_TOKEN,
    process.env.STORYBOOK_TOKEN_URL
  )

  if (accessToken === '' || accessToken === undefined) {
    return null
  }

  return (
    <Counter
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

const styles = {
  container: css`
    font-family: Inter;
    display: inline-flex;
  `,
  card: css`
    flex: 1 auto;
    box-sizing: border-box;
    border-radius: 3px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    overflow: hidden;
    padding: 20px;
    background-color: var(--color-background);
    box-shadow: 0px 1px 3px rgba(0, 0, 0, 0.2);
  `,
  cardTitle: css`
    margin: 0;
    font-weight: 500;
    color: #2e90fa;
  `
}

export const SingleValueStory: Story = {
  name: 'Single value',
  args: connectedParams
}

export const ValueInCardStory: Story = {
  name: 'Value in card',
  args: {
    ...connectedParams,
    style: {
      fontSize: '40px',
      fontWeight: 600
    }
  },
  render: (args) => (
    <div className={css([styles.container, { minWidth: 300 }])}>
      <div className={styles.card}>
        <span className={styles.cardTitle}>Revenue</span>
        <ConnectedCounterTemplate {...args} />
      </div>
    </div>
  )
}

export const ValueInCardWithComparisonStory: Story = {
  name: 'Value in card with comparison',
  args: {
    ...connectedParams,
    style: {
      fontSize: '32px',
      fontWeight: 600
    }
  },
  render: (args) => (
    <div className={styles.container}>
      <div className={styles.card}>
        <span className={css([styles.cardTitle, { color: '#7d89b0' }])}>Revenue</span>
        <div
          className={css`
            display: flex;
            align-items: flex-end;
            color: #7d89b0;
          `}
        >
          <ConnectedCounterTemplate {...args} />
          <span
            className={css`
              margin: 4px 8px;
            `}
          >
            from{' '}
            <Counter
              prefix="$"
              value="16856"
              localize
              style={{
                color: '#7d89b0'
              }}
            />
          </span>
        </div>
      </div>
    </div>
  )
}

export const StaticStory: Story = {
  name: 'Static',
  args: {
    prefixValue: '$',
    value: '49291',
    localize: true
  },
  render: Counter
}

export const SingleValueCustomStyleStory: Story = {
  name: 'Single value custom style',
  tags: ['pattern'],
  args: {
    ...connectedParams,
    styles: {
      font: {
        size: '2rem',
        style: 'italic',
        family: 'Arial',
        weight: 'bold'
      }
    }
  }
}
