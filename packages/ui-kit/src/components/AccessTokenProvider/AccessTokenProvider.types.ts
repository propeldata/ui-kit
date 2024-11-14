export interface AccessTokenContextValue {
  /**
   * The current access token, if any.
   *
   * If the AccessTokenProvider was instantiated without a token, or the fetch token function has not completed, this property will be undefined.
   *
   * Otherwise, when re-fetching an access token, this property will remain equal to the previous access token until the fetch token function completes again.
   */
  accessToken?: string | null
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
}
