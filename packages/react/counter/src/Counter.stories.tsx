import React from 'react'
import { Story } from '@storybook/react'
import { css } from '@emotion/css'
import { RelativeTimeRange } from '@propeldata/ui-kit-graphql'

import { Container as Counter } from './Container'

export default {
  title: 'React/Counter'
}

const UnstyledTemplate: Story = (args) => (
  <>
    We reached <Counter {...args} /> sales last week
  </>
)
export const Unstyled = UnstyledTemplate.bind({})
Unstyled.args = {
  value: '1453'
}

const Template: Story = (args) => <Counter {...args} />
export const WithPrefix = Template.bind({})
WithPrefix.args = {
  value: '123,000',
  prefixValue: '$'
}

export const WithSufix = Template.bind({})
WithSufix.args = {
  value: '99',
  sufixValue: '%'
}

const CardTemplate: Story = (args) => (
  <div
    className={css`
      width: 300px;
      height: 150px;
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

        padding: 30px;
        border-radius: 4px;

        overflow: hidden;

        background-color: var(--color-background);
        box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.14);
      `}
    >
      <div>
        <h2
          className={css`
            margin: 0;
            font-weight: 100;
          `}
        >
          Counter
        </h2>
      </div>
      <div
        className={css`
          display: flex;
          justify-content: flex-end;
          font-size: 3rem;
          font-weight: bold;
        `}
      >
        <Counter {...args} />
      </div>
    </div>
  </div>
)

export const Smart = CardTemplate.bind({})
Smart.args = {
  query: {
    accessToken:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3RpbWUiOjE2NzQ1MDc2NjMsImNsaWVudF9pZCI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwiZXhwIjoxNjc0NTExMjYzLCJpYXQiOjE2NzQ1MDc2NjMsImlzcyI6Imh0dHBzOi8vYXV0aC51cy1lYXN0LTIuZGV2LnByb3BlbGRhdGEuY29tIiwianRpIjoiOWRjMzM3YjktMDY0OS00ZWFiLWE4ZDctY2Q0ZThlYjRmNzAwIiwicHJvcGVsL3RlbmFudCI6IkVOVjAxR0paRzIyNlk3SFlISjNGQkg1NzAwR1I5Iiwic2NvcGUiOiJtZXRyaWM6cXVlcnkgcHJvcGVsL21ldHJpYzpxdWVyeSIsInN1YiI6Ijd0dDVpbDE5MmhsYmthZGYwY2NnNGk3c3Q2IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwidmVyc2lvbiI6MX0.KLQEjKY4b7AOKLNCLx-gY1H37PjV5YGVBGK0ivDXMHI',
    metric: 'queryCount',
    timeRange: {
      relative: RelativeTimeRange.LastNDays,
      n: 30
    }
  }
}

export const Card = CardTemplate.bind({})
Card.args = {
  value: '1238'
}

export const Error = CardTemplate.bind({})
Error.args = {
  query: {
    accessToken: ''
  }
}

export const Loading = () => {
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [])

  return <Counter loading={loading} value="123" />
}
