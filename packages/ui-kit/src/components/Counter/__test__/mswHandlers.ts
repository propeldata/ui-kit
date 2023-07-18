// import { server } from '@/testing/mocks/server'
import { mockServer } from '../../../helpers/testing'

import { counter } from './mockData'
import { mockCounterQuery } from './mockHandlers'

const handlers = [
  mockCounterQuery((req, res, ctx) => {
    const { metricName } = req.variables.counterInput

    if (metricName === 'lack-of-data') {
      return res(
        ctx.data({
          counter: {
            value: null
          }
        })
      )
    }

    if (metricName === 'should-fail') {
      return res(
        ctx.errors([
          {
            message: 'something went wrong'
          }
        ])
      )
    }

    return res(
      ctx.data({
        counter
      })
    )
  })
]

export const setupHandlers = () => {
  mockServer.use(...handlers)
}
