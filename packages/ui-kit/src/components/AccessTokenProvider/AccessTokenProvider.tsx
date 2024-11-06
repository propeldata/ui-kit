'use client'

import React, { createContext, useCallback, useEffect, useRef, useState } from 'react'
import { sleep } from '../../helpers'
import { useLog } from '../Log'
import { AccessTokenContextValue, AccessTokenProviderProps } from './AccessTokenProvider.types'
import { AccessTokenError } from './utils'

const ACCESS_TOKEN_REFRESH_INTERVAL = 3300000 // 55 minutes
const ACCESS_TOKEN_MAX_RETRIES = 3
const ACCESS_TOKEN_RETRY_INTERVAL = 1000

export const AccessTokenContext = createContext<AccessTokenContextValue>({})

export const AccessTokenProvider: React.FC<React.PropsWithChildren<AccessTokenProviderProps>> = ({
  children,
  accessToken,
  fetchToken
}) => {
  const [isLoading, setIsLoading] = useState(accessToken == null)
  const [fetchedToken, setFetchedToken] = useState<string | undefined | null>(undefined)
  const [error, setError] = useState<Error | undefined>(undefined)

  const log = useLog()

  const interval = useRef<NodeJS.Timeout>()
  const mounted = useRef(true)

  const fetch = useCallback(async () => {
    let retries = 0

    if (!fetchToken) {
      throw new Error('You must pass either `fetchToken` or `accessToken` props')
    }

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
        const clientError = error as Error

        if (!mounted.current) break
        log.warn('Failed to fetch access token', error)

        if (retries === ACCESS_TOKEN_MAX_RETRIES) {
          setIsLoading(false)
          setError(new AccessTokenError('Failed to fetch access token: ' + clientError.message))
        }

        retries++

        await sleep(ACCESS_TOKEN_RETRY_INTERVAL)
      }
    }
  }, [log, fetchToken])

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
