import { useContext } from "react"

import { AccessTokenContext } from "./AccessTokenProvider"

interface UseAccessToken {
  accessToken?: string
  isLoading: boolean
  onExpiredToken: () => void
  failedRetry: boolean
}

export const useAccessToken = (): UseAccessToken => {
  const { accessToken, isLoading, onExpiredToken, failedRetry } = useContext(AccessTokenContext)

  return { accessToken, isLoading, onExpiredToken, failedRetry }
}
