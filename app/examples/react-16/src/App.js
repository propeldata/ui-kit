import React from 'react'
import { Dashboard } from 'dashboard-example'

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
  return <Dashboard fetchToken={fetchToken} reactVersion="16" envs={process.env} />
}
