import type { Meta, StoryObj } from '@storybook/react'
import type { LoaderProps } from './Loader'

export const LoaderComponent: React.FC<LoaderProps> = () => null

const meta = {
  title: 'API/LoaderProps',
  tags: ['hidden'],
  component: LoaderComponent
} satisfies Meta<typeof LoaderComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const LoaderPropsStory: StoryObj<typeof meta> = {}
