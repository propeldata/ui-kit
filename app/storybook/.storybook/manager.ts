import { addons } from '@storybook/manager-api'
import { defaultTheme } from './defaultTheme'

const env = process.env.NODE_ENV

addons.setConfig({
  theme: defaultTheme,
  sidebar: {
    filters: {
      patterns: (item) => {
        return !item.tags?.includes('hidden') && !(env === 'production' && item.tags?.includes('devOnly'))
      }
    }
  }
})
