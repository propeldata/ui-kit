import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { sleep } from '../../helpers'
import { useLog } from '../Log'

export interface AccessTokenContextValue {
  /**
   * The current access token, if any.
   *
   * If the AccessTokenProvider was instantiated without a token, or the fetch token function has not completed, this property will be undefined.
   *
   * Otherwise, when re-fetching an access token, this property will remain equal to the previous access token until the fetch token function completes again.
   */
  accessToken?: string
  /**
   * If true, the AccessTokenProvider is fetching an access token.
   *
   * The AccessTokenProvider could be fetching an initial access token, or it could be re-fetching the access token.
   */
  isLoading?: boolean
  /**
   * If present, the AccessTokenProvider encountered an error fetching the access token. This will be set to `undefined` as soon as fetching the access token succeeds.
   */
  error?: Error
}

const ACCESS_TOKEN_REFRESH_INTERVAL = 3300000 // 55 minutes
const ACCESS_TOKEN_MAX_RETRIES = 3
const ACCESS_TOKEN_RETRY_INTERVAL = 1000

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

export const AccessTokenProvider: React.FC<AccessTokenProviderProps> = ({ children, accessToken, fetchToken }) => {
  const [isLoading, setIsLoading] = useState(accessToken == null)
  const [fetchedToken, setFetchedToken] = useState<string | undefined>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)

  const log = useLog()

  const interval = useRef<NodeJS.Timeout>()
  const mounted = useRef(true)

  const fetch = useCallback(async () => {
    let retries = 0

    while (mounted.current) {
      try {
        const token = await fetchToken()
        if (!mounted.current) break
        log.debug('Access token fetched successfully')

        setError(undefined)
        setIsLoading(false)
        setFetchedToken(token)

        break
      } catch (error) {
        if (!mounted.current) break
        log.warn('Failed to fetch access token', error)

        if (retries === ACCESS_TOKEN_MAX_RETRIES) {
          setIsLoading(false)
          setError(new Error('Failed to fetch access token: ' + error.message))
        }

        retries++

        await sleep(ACCESS_TOKEN_RETRY_INTERVAL)
      }
    }
    // This useCallback cannot be tiggered by `fetchToken` because it is a function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [log])

  useEffect(() => {
    async function init() {
      if (accessToken == null) {
        log.debug('Fetching access token')

        await fetch()

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
  }, [fetch, accessToken, log])

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  return (
    <AccessTokenContext.Provider value={{ accessToken: accessToken ?? fetchedToken, isLoading, error }}>
      {children}
    </AccessTokenContext.Provider>
  )
}
