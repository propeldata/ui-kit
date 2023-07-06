import { graphql } from 'msw'

import { server } from '@/testing/mocks/server'

import { leaderboard } from './mockData'

export const handlers = [
  graphql.query('Leaderboard', (req, res, ctx) => {
    return res(
      ctx.data({
        leaderboard
      })
    )
  })
]

export const setupHandlers = () => {
  server.use(...handlers)
}
