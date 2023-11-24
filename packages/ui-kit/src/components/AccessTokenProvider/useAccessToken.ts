import { useContext } from "react"

import { AccessTokenContext, AccessTokenContextValue } from "./AccessTokenProvider"

export const useAccessToken = (): AccessTokenContextValue => {
  const { accessToken, isLoading, onExpiredToken, failedRetry } = useContext(AccessTokenContext)

  return { accessToken, isLoading, onExpiredToken, failedRetry }
}
