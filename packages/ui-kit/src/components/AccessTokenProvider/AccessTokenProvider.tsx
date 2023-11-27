import React, { createContext, PropsWithChildren, useCallback, useEffect, useRef, useState } from 'react'
import { useLog } from '../Log'

export interface AccessTokenContextValue {
  /**
   * The returned accessToken wheter from the props or from the fetchToken function
   */
  accessToken?: string
  /**
   * If true, the access token is being fetched
   */
  isLoading?: boolean
  /**
   * Function that will be called when the access token expires.
   */
  onExpiredToken?: () => void
  /**
   * If true, the access token failed to be fetched after the maximum retries
   */
  failedRetry?: boolean
}

const ACCESS_TOKEN_REFRESH_INTERVAL = 3300000 // 55 minutes
const ACCESS_TOKEN_MAX_RETRIES = 3

export const AccessTokenContext = createContext<AccessTokenContextValue | undefined>({})

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
}

export const AccessTokenProvider: React.FC<AccessTokenProviderProps>  = ({ children, accessToken: accessTokenFromProps, fetchToken }) => {
  const [isLoading, setIsLoading] = useState(accessTokenFromProps == null)
  const [fetchedToken, setFetchedToken] = useState<string | undefined>(undefined)
  const [failedRetry, setFailedRetry] = useState(false)

  const log = useLog()

  const interval = useRef<NodeJS.Timeout>()

  const fetch = useCallback(async () => {
    try {
      const token = await fetchToken()
      log.debug('Access token fetched successfully')

      setFetchedToken(token)

      return token
    } catch (error) {
      log.error('Failed to fetch access token', error)
    } finally {
      setIsLoading(false)
    }
  // This useCallback cannot be tiggered by `fetchToken` because it is a function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (accessTokenFromProps == null) {
      log.debug('Fetching access token')

      fetch()

      interval.current = setInterval(() => {
        log.debug('Re-fetching access token after interval')
        fetch()
      }, ACCESS_TOKEN_REFRESH_INTERVAL)
    } else {
      log.debug('Access token provided by props')
      setFetchedToken(null)
      clearInterval(interval.current)
    }

    return () => {
      if (interval.current != null) {
        clearInterval(interval.current)
      }
    }
  // This useEffect cannot be tiggered by `log` because it is a function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch, accessTokenFromProps])

  const expiredTokenThrottleTimeout = useRef<NodeJS.Timeout>()

  const onExpiredToken = useCallback(async () => {
    if (expiredTokenThrottleTimeout.current == null) {
      expiredTokenThrottleTimeout.current = setTimeout(() => {
        expiredTokenThrottleTimeout.current = undefined
      }, 1000)
    } else {
      return
    }

    log.debug('Re-fetching access token')

    let retryCount = 0

    while (retryCount < ACCESS_TOKEN_MAX_RETRIES) {
      const receivedToken = await fetch()
      if (receivedToken != null) {
        return
      }
      log.warn('Failed to re-fetch access token, retrying...')
      retryCount++
    }

    setFailedRetry(true)

    log.error('Maximum access token retries reached')

  // This useCallback cannot be tiggered by `log` because it is a function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetch])

  const accessToken = accessTokenFromProps ?? fetchedToken

  return <AccessTokenContext.Provider value={{ accessToken, isLoading, onExpiredToken, failedRetry }}>{children}</AccessTokenContext.Provider>
}
