import { setupServer } from 'msw/node'
import { GraphQLHandler, GraphQLRequest, GraphQLVariables } from 'msw'

export const mockServer = setupServer()
export const setupTestHandlers = (handlers: GraphQLHandler<GraphQLRequest<GraphQLVariables>>[]) => {
  console.log('----setupTestHandlers mockServer', mockServer)
  console.log('----setupTestHandlers handlers', handlers)
  mockServer.use(...handlers)
}
