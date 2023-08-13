import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'
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

const customTableHeaders = ['Song title', 'Artist', 'Total listens']

const customTableRows = [
  ["John's way or Highway", 'John Doe', '12863002'],
  ['How to Speak Native Animal', 'John Doe', '10865371'],
  ['Cell Lost in a Sea of Desert', 'John Doe', '9922027'],
  ['Flying nowhere special', 'John Doe', '8822027'],
  ['The Lean Product Book', 'John Doe', '7722027'],
  ["John's way or Highway", 'John Doe', '6622027'],
  ['How to Speak Native Animal', 'John Doe', '5522027'],
  ['Cell Lost in a Sea of Desert', 'John Doe', '4422027'],
  ['Flying nowhere special', 'John Doe', '3322027'],
  ['The Lean Product Book', 'John Doe', '2222027']
]

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
