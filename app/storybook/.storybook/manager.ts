import { addons } from '@storybook/manager-api'
import { defaultTheme } from './defaultTheme'

const env = process.env.NODE_ENV
const devOnly = [
  'Components/PieChart',
  'Hooks/useTopValues',
  'Hooks/useDataGrid',
  'API/DataGridQueryProps',
  'API/PieChartQueryProps',
  'API/TopValuesQueryProps',
  'API/RecordsByIdQueryProps',
  'Hooks/useRecordsById'
]

addons.setConfig({
  theme: defaultTheme,
  sidebar: {
    filters: {
      patterns: (item) => {
        return !item.tags?.includes('pattern')
      },
      devOnly: (item) => {
        return (
          env !== 'production' || !devOnly.map((element) => element.toLowerCase()).includes(item.title.toLowerCase())
        )
      }
    }
  }
})
