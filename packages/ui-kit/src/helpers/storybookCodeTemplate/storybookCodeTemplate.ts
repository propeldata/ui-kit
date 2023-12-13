import type { StoryContext } from '@storybook/react'

/**
 * Generates a template string for a Storybook story.
 * This function constructs a dynamic import statement and a React component function
 * based on the provided StoryContext. It allows customizing the component name, imports,
 * and the body of the component depending on the story's context.
 *
 * @param {string} body - The JSX body to be rendered inside the React component.
 * @param {StoryContext} context - The context of the story, containing parameters for customization.
 * @returns {string} A template string representing the source code of the story.
 */
export const storybookCodeTemplate = (body: string, context: StoryContext): string => {
  const imports = context?.parameters?.imports ?? ''
  const componentName = context?.parameters?.componentName ?? `${context.title.split('/').pop()}Component`
  const transformedBody = context?.parameters?.transformBody ? context?.parameters?.transformBody(body) : body

  let template = `
    function ${componentName}() {
      return (
        ${transformedBody}
      )
    }
  `

  if (imports) {
    template = `
      import { ${imports} } from '@propeldata/ui-kit'

      ${template}
    `
  }

  return template
}
