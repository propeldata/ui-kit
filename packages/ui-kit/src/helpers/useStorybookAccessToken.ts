import React from 'react'
import type { AxiosInstance } from 'axios'

const ACCESS_TOKEN_VALUE = process.env.STORYBOOK_PROPEL_ACCESS_TOKEN
const TOKEN_URL_VALUE = process.env.STORYBOOK_TOKEN_URL ?? ''

export const useStorybookAccessToken = (axiosInstance: AxiosInstance) => {
  const [accessToken, setAccessToken] = React.useState<string | undefined>(ACCESS_TOKEN_VALUE)

  React.useEffect(() => {
    async function fetchToken() {
      if (TOKEN_URL_VALUE === '') {
        return console.error('STORYBOOK_TOKEN_URL is not defined')
      }
      await axiosInstance.get(TOKEN_URL_VALUE).then((res) => {
        setAccessToken(res.data.access_token)
      })
    }

    if (!ACCESS_TOKEN_VALUE) {
      fetchToken()
    }
  }, [axiosInstance])

  return {
    accessToken
  }
}
