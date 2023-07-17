import { render } from '@testing-library/react'

/**
 * This is a convenience type for referring to the result of calling `render`.
 */
export type Dom = ReturnType<typeof render>
export * from './mockServer'
