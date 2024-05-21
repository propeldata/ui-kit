import type { Meta, StoryObj } from '@storybook/react'
import type { LeaderboardQueryProps } from './Leaderboard.types'

export const LeaderboardQueryPropsComponent: React.FC<LeaderboardQueryProps> = () => null

const meta = {
  title: 'API/LeaderboardQueryProps',
  tags: ['hidden'],
  component: LeaderboardQueryPropsComponent
} satisfies Meta<typeof LeaderboardQueryPropsComponent>

LeaderboardQueryPropsComponent.defaultProps = {}

export default meta
export const Primary: StoryObj<typeof meta> = {}
