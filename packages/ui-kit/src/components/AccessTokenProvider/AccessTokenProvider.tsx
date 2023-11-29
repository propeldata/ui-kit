import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
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

export interface AccessTokenProviderProps {
  /**
  * Function that the provider will use to fetch the access token.
  * @returns {Promise<string>} A promise that resolves to the access token
  */
  fetchToken?: () => Promise<string>
  /**
  * If passed, the provider will ignore the `fetchToken` function and pass this access token to all the children components.
  */
  accessToken?: string
  children?: React.ReactNode
}

export const AccessTokenProvider: React.FC<AccessTokenProviderProps>  = ({ children, accessToken, fetchToken }) => {
  const [isLoading, setIsLoading] = useState(accessToken == null)
  const [fetchedToken, setFetchedToken] = useState<string | undefined>(undefined)
  const [failedRetry, setFailedRetry] = useState(false)

  const log = useLog()

  const interval = useRef<NodeJS.Timeout>()

  const fetch = useCallback(async () => {
    try {
      const token = await fetchToken()
      log.debug('Access token fetched successfully')

      setFetchedToken(token)

      setIsLoading(false)

      return token
    } catch (error) {
      log.error('Failed to fetch access token', error)
    }
  // This useCallback cannot be tiggered by `fetchToken` because it is a function
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log])

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
    let receivedToken: string

    while(retryCount < ACCESS_TOKEN_MAX_RETRIES) {
      receivedToken = await fetch()

      if (receivedToken != null) {
        setIsLoading(false)
        return
      }

      log.warn('Failed to re-fetch access token, retrying...')
      retryCount++
    }

    setIsLoading(false)
    setFailedRetry(true)
    log.error('Maximum access token retries reached')

    const interval = setInterval(async () => {
      receivedToken = await fetch()
      if (receivedToken != null) {
        clearInterval(interval)
      }

      log.warn('Failed to re-fetch access token, retrying...')
    }, 2500)
  }, [fetch, log])

  useEffect(() => {
    async function init() {
      if (accessToken == null) {
        log.debug('Fetching access token')

        const accessToken = await fetch()

        if (accessToken == null) {
          onExpiredToken()
        }

        interval.current = setInterval(async () => {
          log.debug('Re-fetching access token after interval')
          await fetch()
        }, ACCESS_TOKEN_REFRESH_INTERVAL)
      } else {
        log.debug('Access token provided by props')
        setFetchedToken(null)
        clearInterval(interval.current)
      }
    }

    init()

    return () => {
      if (interval.current != null) {
        clearInterval(interval.current)
      }
    }
  }, [fetch, accessToken, log, onExpiredToken])

  return <AccessTokenContext.Provider value={{ accessToken: accessToken ?? fetchedToken, isLoading, onExpiredToken, failedRetry }}>{children}</AccessTokenContext.Provider>
}
