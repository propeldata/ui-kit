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
    document.body.style.setProperty('--bg-color', theme.backgroundSecondary as string)
  }
  return null
}

interface DashboardProps extends DashboardCommonProps {
  fetchToken: () => Promise<string>
}

export const Dashboard = ({ fetchToken, envs }: DashboardProps) => {
  const [theme, setTheme] = React.useState<DefaultThemes>('lightTheme')
  return (
    <AccessTokenProvider fetchToken={fetchToken}>
      <FilterProvider>
        <ThemeProvider
          baseTheme={theme}
          renderEmpty={() => (
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: 300 }}>
              No Data
            </div>
          )}
        >
          <GlobalStyles />
          <main
            style={{ color: 'var(--propel-text-secondary)', backgroundColor: 'var(--propel-background-secondary)' }}
          >
            <h1 className="px-6 py-3 text-3xl">
              React {React.version} Testing App
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
