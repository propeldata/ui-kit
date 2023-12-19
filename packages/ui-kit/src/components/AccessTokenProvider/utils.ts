/**
 * @class AccessTokenError
 * @description Produce error when no access token is provided or fetched.
 * @param {string} message - Error message
 */
export class AccessTokenError extends Error {
  constructor(message?: string) {
    super(message ?? 'No access token provided.')
    this.name = 'AccessTokenError'
  }
}
