import type { Meta, StoryObj } from '@storybook/react'
import type { FontProps } from '../default.types'

export const FontPropsComponent: React.FC<FontProps> = () => null

const meta = {
  title: 'API/FontProps',
  tags: ['pattern'],
  component: FontPropsComponent
} satisfies Meta<typeof FontPropsComponent>

export default meta
export const FontPropsStory: StoryObj<typeof meta> = {}
