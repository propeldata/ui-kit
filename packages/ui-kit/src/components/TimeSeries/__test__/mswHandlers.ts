import { mockServer } from './../../../helpers/testing'
import { timeSeries } from './mockData'
import { mockTimeSeriesQuery } from './mockHandlers'

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
  mockServer.use(...handlers)
}
