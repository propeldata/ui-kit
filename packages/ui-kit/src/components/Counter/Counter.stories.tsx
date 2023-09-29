import { css } from '@emotion/css'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import axiosInstance from '../../../../../app/storybook/src/axios'
import { RelativeTimeRange, storybookCodeTemplate, useStorybookAccessToken } from '../../helpers'
import { Counter as CounterSource, CounterComponent } from './Counter'

const meta: Meta<typeof CounterComponent> = {
  title: 'Components/Counter',
  component: CounterComponent,
  tags: ['tag'],
  parameters: {
    controls: { sort: 'alpha' },
    imports: 'Counter, RelativeTimeRange',
    transformBody: (body: string) => body.replace("'LAST_N_DAYS'", 'RelativeTimeRange.LastNDays'),
    codeTemplate: storybookCodeTemplate
  }
}

export default meta

type Story = StoryObj<typeof CounterComponent>

const connectedParams = {
  localize: true,
  prefixValue: '$',
  query: {
    accessToken: '<PROPEL_ACCESS_TOKEN>',
    metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
    timeRange: {
      relative: RelativeTimeRange.LastNDays,
      n: 30
    }
  }
}

const Counter = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(
    axiosInstance,
    process.env.STORYBOOK_PROPEL_ACCESS_TOKEN,
    process.env.STORYBOOK_TOKEN_URL
  )

  if (accessToken === '' && args?.query) {
    return null
  }

  return (
    <CounterSource
      {...{
        ...args,
        query: args?.query
          ? {
              ...args?.query,
              accessToken
            }
          : undefined
      }}
    />
  )
}

const styles = {
  container: css`
    font-family: Inter;
    display: inline-flex;
    min-width: 300;
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
  `,
  cardComparisonTitle: css`
    margin: 0;
    font-weight: 500;
    color: #7d89b0;
  `,
  cardComparisonValues: css`
    display: flex;
    align-items: flex-end;
    color: #7d89b0;
  `,
  cardComparisonFrom: css`
    margin: 0 0 4px 1ch;
  `
}

export const SingleValueStory: Story = {
  name: 'Single value',
  args: connectedParams,
  render: (args) => <Counter {...args} />
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
    <div className={styles.container}>
      <div className={styles.card}>
        <span className={styles.cardTitle}>Revenue</span>
        <Counter {...args} />
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
        <span className={styles.cardComparisonTitle}>Revenue</span>
        <div className={styles.cardComparisonValues}>
          <Counter {...args} />
          <div className={styles.cardComparisonFrom}>
            <span>from </span>
            <Counter
              prefixValue="$"
              value="16856"
              localize
              style={{
                color: '#7d89b0'
              }}
            />
          </div>
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
  render: (args) => <Counter {...args} />
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
  },
  render: (args) => <Counter {...args} />
}
