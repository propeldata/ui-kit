import React, { createContext, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'

interface AccessTokenContextValue {
  accessToken?: string
  isLoading?: boolean
  onExpiredToken?: () => void
  failedRetry?: boolean
}

const ACCESS_TOKEN_REFRESH_INTERVAL = 3600000
const ACCESS_TOKEN_MAX_RETRIES = 3

export const AccessTokenContext = createContext<AccessTokenContextValue | undefined>({})

// export type AccessTokenProviderProps = Omit<AccessTokenContextValue, 'fetchedToken'> & PropsWithChildren
export interface AccessTokenProviderProps extends PropsWithChildren {
  /**
  * Function that the provider will use to fetch the access token.
  * @returns {Promise<string>} A promise that resolves to the access token
  */
  fetchToken?: () => Promise<string>
  /**
  * If passed, the provider will ignore the `fetchToken` function and pass this access token to all the children components.
  */
  accessToken?: string
  /**
  * Function that will be called when the access token expires.
  */
  onAccessTokenExpired?: () => void
}

export const AccessTokenProvider = (props: AccessTokenProviderProps) => {
  const { children, accessToken: accessTokenFromProps, fetchToken, onAccessTokenExpired } = props

  const [isLoading, setIsLoading] = useState(true)
  const [fetchedToken, setFetchedToken] = useState<string | undefined>(undefined)
  const [failedRetry, setFailedRetry] = useState(false)

  const shouldFetchToken = accessTokenFromProps == null

  const interval = useRef<NodeJS.Timeout>()

  const fetch = useCallback(async () => {
    try {
      const token = await fetchToken()
      setFetchedToken(token)

      return token
    } catch (error) {
      // TODO: Handle error with logger
    } finally {
      setIsLoading(false)
    }
  // This useCallback cannot be tiggered by `fetchToken` because it is a function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (shouldFetchToken) {
      // TODO: debug log fetch access token

      interval.current != null && clearInterval(interval.current)

      fetchedToken == null && fetch()

      interval.current = setInterval(fetch, ACCESS_TOKEN_REFRESH_INTERVAL)
    }
  }, [fetch, fetchedToken, shouldFetchToken])

  const onExpiredToken = useCallback(async () => {
    if (onAccessTokenExpired) {
      onAccessTokenExpired()
      return
    }

    let retryCount = 0

    while (retryCount < ACCESS_TOKEN_MAX_RETRIES) {
      const receivedToken = await fetch()
      if (receivedToken != null) {
        return
      }
      retryCount++
    }

    setFailedRetry(true)
    // TODO: Handle maximum retries with logger

  // This useCallback cannot be tiggered by `onAccessTokenExpired` because it is a function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch])

  const accessToken = accessTokenFromProps ?? fetchedToken

  return <AccessTokenContext.Provider value={{ accessToken, isLoading, onExpiredToken, failedRetry }}>{children}</AccessTokenContext.Provider>
}
