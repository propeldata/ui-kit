import type { Meta, StoryObj } from '@storybook/react'
import type { LeaderboardChartProps } from './Leaderboard.types'

export const LeaderboardChartPropsComponent: React.FC<LeaderboardChartProps> = () => null

const meta = {
  title: 'API/LeaderboardChartProps',
  tags: ['hidden'],
  component: LeaderboardChartPropsComponent
} satisfies Meta<typeof LeaderboardChartPropsComponent>

LeaderboardChartPropsComponent.defaultProps = {
  labelPosition: 'axis',
  showBarValues: false
}

export default meta
export const Primary: StoryObj<typeof meta> = {}
