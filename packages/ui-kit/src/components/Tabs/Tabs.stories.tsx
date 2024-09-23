import React from 'react'
import { Meta, StoryObj } from '@storybook/react'
import { Tabs } from './Tabs'

const meta: Meta<typeof Tabs> = {
  title: 'Components/Tabs',
  tags: ['devOnly'],
  argTypes: {
    // Define any argTypes here if needed
  }
}

export default meta
type Story = StoryObj<typeof Tabs>

export const Default: Story = {
  render: () => (
    <Tabs.Root style={{ width: '100%' }}>
      <Tabs.List>
        <Tabs.Trigger value="account">Account</Tabs.Trigger>
        <Tabs.Trigger value="password">Password</Tabs.Trigger>
        <Tabs.Trigger value="team">Team</Tabs.Trigger>
      </Tabs.List>
      <Tabs.Content value="account">Make changes to your account here. Click save when you&apos;re done.</Tabs.Content>
      <Tabs.Content value="password">Change your password here. After saving, you&apos;ll be logged out.</Tabs.Content>
      <Tabs.Content value="team">Manage your team here. Add, remove, or edit team members here.</Tabs.Content>
    </Tabs.Root>
  )
}

export const Cards: Story = {
  render: () => (
    <Tabs.Root>
      <Tabs.List>
        <Tabs.Card value="account" style={{ cursor: 'pointer', width: '100%' }}>
          Account
        </Tabs.Card>
        <Tabs.Card value="password" style={{ cursor: 'pointer', width: '100%' }}>
          Password
        </Tabs.Card>
        <Tabs.Card value="team" style={{ cursor: 'pointer', width: '100%' }}>
          Team
        </Tabs.Card>
      </Tabs.List>
      <Tabs.Content value="account">Make changes to your account here. Click save when you&apos;re done.</Tabs.Content>
      <Tabs.Content value="password">Change your password here. After saving, you&apos;ll be logged out.</Tabs.Content>
      <Tabs.Content value="team">Manage your team here. Add, remove, or edit team members here.</Tabs.Content>
    </Tabs.Root>
  )
}
