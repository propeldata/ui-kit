import { graphql } from 'msw'

import { server } from '@/testing/mocks/server'

const handlers = [
  graphql.query('Counter', (req, res, ctx) => {
    return res(
      ctx.data({
        counter: {
          value: 123,
          __typename: 'Counter'
        }
      })
    )
  })
]

export const setupHandlers = () => {
  server.use(...handlers)
}
