import { useContext } from "react"

import { AccessTokenContext, AccessTokenContextValue } from "./AccessTokenProvider"

/**
 * Access the values from the AccessTokenProvider
 * @returns {AccessTokenContextValue} accessToken, isLoading, onExpiredToken, failedRetry
 */
export const useAccessToken = (): AccessTokenContextValue => {
  const { accessToken, isLoading, error } = useContext(AccessTokenContext)

  return { accessToken, isLoading, error }
}
