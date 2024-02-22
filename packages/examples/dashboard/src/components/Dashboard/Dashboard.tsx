import {
  AccessTokenProvider,
  DefaultThemes,
  FilterProvider,
  RelativeTimeRange,
  SimpleFilter,
  ThemeProvider,
  useTheme
} from '@propeldata/ui-kit'
import React from 'react'
import { DashboardCommonProps } from '../../shared.types'
import { CounterConnected } from '../CounterConnected'
import { CounterStatic } from '../CounterStatic'
import { LeaderboardConnected } from '../LeaderboardConnected'
import { LeaderboardStatic } from '../LeaderboardStatic'
import { PieChartConnected } from '../PieChartConnected'
import { PieChartStatic } from '../PieChartStatic'
import { TimeSeriesConnected } from '../TimeSeriesConnected'
import { TimeSeriesStatic } from '../TimeSeriesStatic'

const GlobalStyles = () => {
  const theme = useTheme()
  if (document && theme) {
    document.body.style.setProperty('--bg-color', theme.bgSecondary as string)
  }
  return null
}

interface DashboardProps extends DashboardCommonProps {
  fetchToken: () => Promise<string>
  reactVersion: string
}

export const Dashboard = ({ fetchToken, reactVersion, envs }: DashboardProps) => {
  const [theme, setTheme] = React.useState<DefaultThemes>('lightTheme')
  return (
    <AccessTokenProvider fetchToken={fetchToken}>
      <FilterProvider>
        <ThemeProvider baseTheme={theme}>
          <GlobalStyles />
          <main style={{ color: 'var(--propel-text-secondary)', backgroundColor: 'var(--propel-bg-secondary)' }}>
            <h1 className="px-6 py-3 text-3xl">
              React {reactVersion} Testing App
              <button className="m-3" onClick={() => setTheme(theme === 'lightTheme' ? 'darkTheme' : 'lightTheme')}>
                {theme === 'lightTheme' ? '🌚' : '🌞'}
              </button>
            </h1>
            <hr />
            <div className="px-6 py-3 w-full flex justify-end">
              <SimpleFilter
                query={{
                  columnName: envs.REACT_APP_DIMENSION_1,
                  dataPool: { name: envs.REACT_APP_DATA_POOL_UNIQUE_NAME_1 ?? '' },
                  maxValues: 1000,
                  timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 }
                }}
                autocompleteProps={{ containerStyle: { width: '500px' }, placeholder: 'Filter by taco name' }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <TimeSeriesStatic />
              <TimeSeriesConnected envs={envs} />
              <LeaderboardStatic />
              <LeaderboardConnected envs={envs} />
              <CounterStatic />
              <CounterConnected envs={envs} />
              <PieChartStatic />
              <PieChartConnected envs={envs} />
            </div>
          </main>
        </ThemeProvider>
      </FilterProvider>
    </AccessTokenProvider>
  )
}
