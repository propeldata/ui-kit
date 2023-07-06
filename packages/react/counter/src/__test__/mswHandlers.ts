import { graphql } from 'msw'

import { server } from '@/testing/mocks/server'

import { counter } from './mockData'

const handlers = [
  graphql.query('Counter', (req, res, ctx) => {
    return res(
      ctx.data({
        counter
      })
    )
  })
]

export const setupHandlers = () => {
  server.use(...handlers)
}
