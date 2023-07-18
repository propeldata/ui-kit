import { mockServer } from './../../../helpers/testing'
import { leaderboard } from './mockData'
import { mockLeaderboardQuery } from './mockHandlers'

export const handlers = [
  mockLeaderboardQuery((req, res, ctx) => {
    const { metricName } = req.variables.leaderboardInput

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
        leaderboard
      })
    )
  })
]

export const setupHandlers = () => {
  mockServer.use(...handlers)
}
