import React from 'react'
import { AccessTokenProvider, ThemeProvider, useTheme } from '@propeldata/ui-kit'

import {
  TimeSeriesStaticTest,
  TimeSeriesConnectedTest,
  LeaderboardStaticTest,
  LeaderboardConnectedTest,
  CounterStaticTest,
  CounterConnectedTest,
  PieChartStaticTest,
  PieChartConnectedTest
} from 'components'

const { REACT_APP_CLIENT_ID, REACT_APP_CLIENT_SECRET } = process.env

async function fetchToken() {
  const response = await fetch('https://auth.us-east-2.propeldata.com/oauth2/token', {
    method: 'post',
    body: `grant_type=client_credentials&client_id=${REACT_APP_CLIENT_ID}&client_secret=${REACT_APP_CLIENT_SECRET}`,
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  })
  const { access_token } = await response.json()

  return access_token
}

const GlobalStyles = () => {
  const theme = useTheme()
  if (document && theme) {
    document.body.style.setProperty('--bg-color', theme.bgSecondary)
  }
  return null
}

export default function App() {
  const [theme, setTheme] = React.useState('lightTheme')
  return (
    <AccessTokenProvider fetchToken={fetchToken}>
      <ThemeProvider baseTheme={theme}>
        <GlobalStyles />
        <main style={{ color: 'var(--propel-text-secondary)' }}>
          <h1 className="px-6 py-3 text-3xl">
            React 16.8 Testing App
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
            <PieChartStaticTest />
            <PieChartConnectedTest />
          </div>
        </main>
      </ThemeProvider>
    </AccessTokenProvider>
  )
}
