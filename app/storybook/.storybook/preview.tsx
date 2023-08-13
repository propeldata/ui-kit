import { ThemeProvider } from '@emotion/react'
import { withThemeFromJSXProvider } from '@storybook/addon-styling'
import { Preview } from '@storybook/react'
import './global.css'

const preview: Preview = {
  parameters: {
    docs: {
      // Table of contents
      toc: true
    },
    options: {
      storySort: {
        order: [
          'Getting started',
          ['Overview', 'Installation', 'Usage', 'Customization', 'Migration guide'],
          'Components',
          'React'
        ],
        method: 'alphabetical'
      }
    },
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/
      }
    }
  }
}

export default preview

export const decorators = [
  withThemeFromJSXProvider({
    themes: {
      light: {
        red: '#ff0000'
      }
    },
    Provider: ThemeProvider
    // GlobalStyles,
  })
]

// export const decorators = [
//   (Story) => (
//     <div
//       className={css`
//         font-family: 'Inter';
//         font-size: 12px;
//       `}
//     >
//       <Story />
//     </div>
//   )
// ]
