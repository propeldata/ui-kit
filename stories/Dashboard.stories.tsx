import React from 'react'
import { Story } from '@storybook/react'
import { css } from '@emotion/css'
import { Counter } from '@propeldata/react-counter'
import { TimeSeries } from '@propeldata/react-time-series'

export default {
  title: 'Examples/Dashboard'
}

interface CardProps {
  children: React.ReactNode
  title?: string
}

const Card = (props: CardProps) => (
  <div
    className={css`
      width: 100%;
      height: 100%;
      font-family: 'Fira Code';
    `}
  >
    <div
      className={css`
        width: 100%;
        height: 100%;
        box-sizing: border-box;

        border: 1px solid black;
        border-radius: 10px;

        padding: 20px;

        display: flex;
        flex-direction: column;
        justify-content: space-between;
      `}
    >
      <div>
        <h2
          className={css`
            margin: 0;
            font-weight: 100;
          `}
        >
          {props.title}
        </h2>
      </div>
      <div
        className={css`
          font-weight: bold;
          width: 100%;
        `}
      >
        {props.children}
      </div>
    </div>
  </div>
)

const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const values = [0, 1000, 200, 3000, 4000, 500, 7000]

const Template: Story = () => (
  <main
    className={css`
      margin: 0 20px;
      display: flex;
      flex-direction: column;
      gap: 10px;
    `}
  >
    <div
      className={css`
        display: flex;
        gap: 10px;
        height: 150px;
      `}
    >
      <Card title="Books">
        <div
          className={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Counter isLoading={true} value="1518" />
        </div>
      </Card>
      <Card title="Board Games">
        <div
          className={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Counter isLoading={true} styles={{ font: { size: '3rem' } }} value="1718" />
        </div>
      </Card>
      <Card title="Party Decorations">
        <div
          className={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Counter isLoading={true} styles={{ font: { size: '3rem' } }} value="123" />
        </div>
      </Card>
      <Card title="Calendars and Planners">
        <div
          className={css`
            display: flex;
            justify-content: flex-end;
          `}
        >
          <Counter styles={{ font: { size: '3rem' } }} value="458" />
        </div>
      </Card>
    </div>
    <Card title="Sales">
      <TimeSeries labels={labels} values={values} />
    </Card>
  </main>
)
export const Dashboard = Template.bind({})
