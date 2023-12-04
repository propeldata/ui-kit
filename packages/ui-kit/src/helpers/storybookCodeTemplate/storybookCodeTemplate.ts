import type { StoryContext } from '@storybook/react'

export const storybookCodeTemplate = (body: string, context: StoryContext): string => `
  import { ${context?.parameters?.imports ?? ''} } from '@propeldata/ui-kit'

  function ${context?.parameters?.componentName ?? `${context.title.split('/').pop()}Component`}() {
    return (
        ${context?.parameters?.transformBody ? context?.parameters?.transformBody(body) : body}
    )
  }
`
