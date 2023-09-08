import { css } from '@emotion/css'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
import { Counter, CounterComponent } from './Counter'

const meta: Meta<typeof CounterComponent> = {
  title: 'Components/Counter',
  component: CounterComponent,
  render: Counter,
  tags: ['tag']
}

export default meta

type Story = StoryObj<typeof CounterComponent>

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
  args: {
    prefixValue: '$',
    value: '49291',
    localize: true
  }
}

export const ValueInCardStory: Story = {
  name: 'Value in card',
  args: {
    prefixValue: '$',
    value: '49291',
    localize: true,
    style: {
      fontSize: '40px',
      fontWeight: 600
    }
  },
  render: (args) => (
    <div className={css([styles.container, { minWidth: 300 }])}>
      <div className={styles.card}>
        <span className={styles.cardTitle}>Sales</span>
        <Counter {...args} />
      </div>
    </div>
  )
}

export const ValueInCardWithComparisonStory: Story = {
  name: 'Value in card with comparison',
  args: {
    prefixValue: '$',
    value: '123000',
    localize: true,
    style: {
      fontSize: '32px',
      fontWeight: 600
    }
  },
  render: (args) => (
    <div className={styles.container}>
      <div className={styles.card}>
        <span className={css([styles.cardTitle, { color: '#7d89b0' }])}>Sales</span>
        <div
          className={css`
            display: flex;
            align-items: flex-end;
            color: #7d89b0;
          `}
        >
          <Counter {...args} />
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
