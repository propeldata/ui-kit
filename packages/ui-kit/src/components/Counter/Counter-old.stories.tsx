import { css } from '@emotion/css'
import { Story } from '@storybook/react'
import React from 'react'
import { RelativeTimeRange } from '../../helpers'
import { Counter } from '../Counter'

export default {
  title: 'React/Counter',
  argTypes: {
    query: {
      table: {
        disable: true
      }
    }
  }
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
          justify-content: center;
          align-items: center;
          font-size: 3rem;
          font-weight: bold;
        `}
      >
        <Counter {...args} />
      </div>
    </div>
  </div>
)

export const Connected = CardTemplate.bind({ controls: 'disabled' })
Connected.args = {
  query: {
    // accessToken: process.env.STORYBOOK_PROPEL_ACCESS_TOKEN,
    // metric: process.env.STORYBOOK_METRIC_UNIQUE_NAME_1,
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
  const [value, setValue] = React.useState<string>()

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
      setValue('123')
    }, 1000)
  }, [])

  return <Counter loading={loading} value={value} />
}
