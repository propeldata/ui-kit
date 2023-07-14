import { graphql } from 'msw'
import { mockTimeSeriesQuery } from './mockHandlers'
import { server } from '@/testing/mocks/server'

import { timeSeries } from './mockData'

const handlers = [
  mockTimeSeriesQuery((req, res, ctx) => {
    const { metricName } = req.variables.timeSeriesInput

    if (metricName === 'should-fail') {
      return res(
        ctx.errors([
          {
            message: 'Something went wrong'
          }
        ])
      )
    }

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
