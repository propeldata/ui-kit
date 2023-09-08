import { addons } from '@storybook/manager-api'
import { defaultTheme } from './defaultTheme'

addons.setConfig({
  theme: defaultTheme,
  sidebar: {
    filters: {
      patterns: (item) => {
        return !item.tags?.includes('pattern')
      }
    }
  }
})
