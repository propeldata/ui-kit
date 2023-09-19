import React from 'react'

export const useStorybookAccessToken = (axiosInstance, accessTokenValue = '', tokenUrlValue = '') => {
  const [accessToken, setAccessToken] = React.useState<string | undefined>(accessTokenValue)

  React.useEffect(() => {
    async function fetchToken() {
      if (tokenUrlValue === '') {
        return console.error('STORYBOOK_TOKEN_URL is not defined')
      }
      await axiosInstance.get(tokenUrlValue).then((res) => {
        setAccessToken(res.data.access_token)
      })
    }

    if (accessTokenValue === '') {
      fetchToken()
    }
  }, [axiosInstance, accessTokenValue, tokenUrlValue])

  return {
    accessToken
  }
}
