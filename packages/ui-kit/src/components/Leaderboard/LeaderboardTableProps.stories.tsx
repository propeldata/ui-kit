import type { Meta, StoryObj } from '@storybook/react'
import type { LeaderboardTableProps } from './Leaderboard.types'

export const LeaderboardTablePropsComponent: React.FC<LeaderboardTableProps> = () => null

const meta = {
  title: 'API/LeaderboardTableProps',
  tags: ['pattern'],
  component: LeaderboardTablePropsComponent
} satisfies Meta<typeof LeaderboardTablePropsComponent>

LeaderboardTablePropsComponent.defaultProps = {
  stickyHeader: false,
  hasValueBar: false,
  localize: false,
  stickyValues: false
}

export default meta
export const Primary: StoryObj<typeof meta> = {}
