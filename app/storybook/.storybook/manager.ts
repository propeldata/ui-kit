import { addons } from '@storybook/manager-api'
import { defaultTheme } from './defaultTheme'

const env = process.env.NODE_ENV
const devOnly = ['']
const hidden = ['Components/Autocomplete']

addons.setConfig({
  theme: defaultTheme,
  sidebar: {
    filters: {
      patterns: (item) => {
        return !item.tags?.includes('pattern')
      },
      devOnly: (item) => {
        return (
          env !== 'production' ||
          !devOnly
            .concat(hidden)
            .map((element) => element.toLowerCase())
            .includes(item.title.toLowerCase())
        )
      }
    }
  }
})
