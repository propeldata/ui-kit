import { graphql } from 'msw'
import { server } from '@/testing/mocks/server'

import { timeSeries } from './mockData'

const handlers = [
  graphql.query('TimeSeries', (req, res, ctx) => {
    return res(
      ctx.data({
        timeSeries
      })
    )
  })
]

export const setupHandlers = () => {
  server.use(...handlers)
}
