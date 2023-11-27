import { useContext, useEffect } from "react"

import { AccessTokenContext, AccessTokenContextValue } from "./AccessTokenProvider"


interface Props {
  isAccessTokenError: boolean
}

/**
 * Access the values from the AccessTokenProvider
 * @returns {AccessTokenContextValue} accessToken, isLoading, onExpiredToken, failedRetry
 */
export const useAccessToken = ({ isAccessTokenError }: Props): AccessTokenContextValue => {
  const { accessToken, isLoading, onExpiredToken, failedRetry } = useContext(AccessTokenContext)

  useEffect(() => {
    if (isAccessTokenError) {
      onExpiredToken()
    }
  }, [isAccessTokenError, onExpiredToken])

  return { accessToken, isLoading, onExpiredToken, failedRetry }
}
