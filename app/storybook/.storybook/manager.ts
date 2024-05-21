import { addons } from '@storybook/manager-api'
import { defaultTheme } from './defaultTheme'

const env = process.env.NODE_ENV

addons.setConfig({
  theme: defaultTheme,
  sidebar: {
    filters: {
      /**
       * Determines the visibility of Storybook stories based on their tags:
       *
       * - `hidden`: Excludes stories with this tag from all environments.
       * - `devOnly`: Excludes stories with this tag from the production environment.
       *
       * Returns true if a story should be displayed, ensuring it does not have the 'hidden' tag,
       * and, in production, does not have the 'devOnly' tag.
       */
      patterns: (story) => {
        return !story.tags?.includes('hidden') && !(env === 'production' && story.tags?.includes('devOnly'))
      }
    }
  }
})
