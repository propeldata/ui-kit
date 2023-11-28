import { Source, useOf, Story } from '@storybook/blocks'
import React from 'react'
import { getStringAttributes, prettier } from '../../src/utils'

type ParseStorySourceCodeProps = {
  context: any
  formatted?: boolean
}

/**
 * A custom parser to get the source code of a story from the context.
 */

export const parseStorySourceCode = ({ context, formatted = false }: ParseStorySourceCodeProps) => {
  let source: string | undefined = undefined

  try {
    const docSource = context.parameters.docs.source.originalSource

    // Parse render from the source string
    const lines = docSource.split('\n')
    const renderRegex = /render:.*=>/
    const renderStartIndex = lines.findIndex((line) => renderRegex.test(line))

    const renderEndIndex = lines.findIndex(
      (line, index) =>
        index > renderStartIndex && (line === '}' || (line.substr(0, 2) === '  ' && line.charAt(2) !== ' '))
    )

    source = lines
      .splice(renderStartIndex, renderEndIndex - renderStartIndex)
      .join('\n')
      .replace(renderRegex, '')
      .replace('{...args}', getStringAttributes(context.initialArgs))
      // Trim the leading and trailing commas
      .replace(/,\s*$/, '')
      .trim('')

    if (formatted) {
      source = prettier(context.parameters.codeTemplate(source, context))
    }
  } catch (e) {
    console.warn(e)
  }

  return source
}

export type SourceCodeProps = {
  of?: Record<string, any> | 'story' | 'meta'
  transform?: (code: string, context: any) => string
  shown?: boolean
  hideStory?: boolean
}

/**
 * A custom block to parse and show the source code of a story.
 */

export const SourceCode = ({ of, transform, shown = false, hideStory = false }) => {
  const resolvedOf = useOf(of || 'story', ['story', 'meta'])
  const [showSource, setShowSource] = React.useState(shown)

  switch (resolvedOf.type) {
    case 'story': {
      const context = resolvedOf.story
      const source = transform
        ? transform(parseStorySourceCode({ context }), context)
        : parseStorySourceCode({ context, formatted: true })

      return (
        <div className="propelSourceCodeBlock">
          {!hideStory && (
            <div
              style={{
                padding: 20,
                border: '1px solid hsla(203, 50%, 30%, 0.15)',
                borderRadius: 4,
                boxShadow: 'rgba(0, 0, 0, 0.10) 0 1px 3px 0'
              }}
            >
              <Story of={context.moduleExport} />
            </div>
          )}

          {!hideStory && source && (
            <a className="showCodeLink" onClick={() => setShowSource(!showSource)}>
              {showSource ? 'Hide' : 'Show'} code
            </a>
          )}
          {source && showSource && <Source dark format="dedent" language="tsx" code={source} />}
        </div>
      )
    }
  }
  return null
}
