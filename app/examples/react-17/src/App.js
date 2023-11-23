import React from 'react'
import { ThemeProvider } from '@propeldata/ui-kit'
import {
  TimeSeriesStaticTest,
  TimeSeriesConnectedTest,
  LeaderboardStaticTest,
  LeaderboardConnectedTest,
  CounterStaticTest,
  CounterConnectedTest
} from 'components'

export default function App() {
  const [theme, setTheme] = React.useState('lightTheme')
  return (
    <ThemeProvider baseTheme={theme}>
      <main style={{ color: 'var(--propel-text-secondary)' }}>
        <h1 className="px-6 py-3 text-3xl">
          React 17 Testing App
          <button className="m-3" onClick={() => setTheme(theme === 'lightTheme' ? 'darkTheme' : 'lightTheme')}>
            {theme === 'lightTheme' ? '🌚' : '🌞'}
          </button>
        </h1>
        <hr />
        <div className="grid grid-cols-2 gap-2">
          <TimeSeriesStaticTest />
          <TimeSeriesConnectedTest />
          <LeaderboardStaticTest />
          <LeaderboardConnectedTest />
          <CounterStaticTest />
          <CounterConnectedTest />
        </div>
      </main>
    </ThemeProvider>
  )
}
