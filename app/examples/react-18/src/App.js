import React from 'react'
import { AccessTokenProvider } from '@propeldata/ui-kit'

import {
  TimeSeriesStaticTest,
  TimeSeriesConnectedTest,
  LeaderboardStaticTest,
  LeaderboardConnectedTest,
  CounterStaticTest,
  CounterConnectedTest
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

export default function App() {
  return (
    <main>
      <h1 className="m-3 text-3xl">React 18 Testing App</h1>
      <hr />
      <div className="grid grid-cols-2 gap-2">
        <AccessTokenProvider fetchToken={fetchToken}>
          <TimeSeriesStaticTest />
          <TimeSeriesConnectedTest />
          <LeaderboardStaticTest />
          <LeaderboardConnectedTest />
          <CounterStaticTest />
          <CounterConnectedTest />
        </AccessTokenProvider>
      </div>
    </main>
  )
}
