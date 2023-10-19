import { setupServer } from 'msw/node'
import { RequestHandler } from 'msw'

export const mockServer = setupServer()
export const setupTestHandlers = (handlers: RequestHandler[]) => {
  mockServer.use(...handlers)
}
