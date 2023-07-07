import { graphql } from 'msw'

import { server } from '@/testing/mocks/server'

import { counter } from './mockData'

const handlers = [
  graphql.query('Counter', (req, res, ctx) => {
    const { metricName } = req.variables.counterInput

    console.log(metricName)

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
  server.use(...handlers)
}
