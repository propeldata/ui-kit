import { graphql } from 'msw'
import { server } from '@/testing/mocks/server'

const handlers = [
  graphql.query('TimeSeries', (req, res, ctx) => {
    return res(
      ctx.data({
        timeSeries: {
          labels: ['a', 'b', 'c'],
          values: [100, 200, 300]
        }
      })
    )
  })
]

export const setupHandlers = () => {
  server.use(...handlers)
}
