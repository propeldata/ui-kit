import type { Meta, StoryObj } from '@storybook/react'
import type { ErrorFallbackProps } from './ErrorFallback'

export const ErrorFallbackComponent: React.FC<ErrorFallbackProps> = () => null

const meta = {
  title: 'API/ErrorFallbackProps',
  tags: ['pattern'],
  component: ErrorFallbackComponent
} satisfies Meta<typeof ErrorFallbackComponent>

export default meta

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const ErrorFallbackPropsStory: StoryObj<typeof meta> = {}
