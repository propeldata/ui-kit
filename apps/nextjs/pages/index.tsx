import '@propeldata/wc-time-series'
import '@propeldata/wc-counter'

const labels = [
  '2022-10-25T00:00:00.000Z',
  '2022-10-26T00:00:00.000Z',
  '2022-10-27T00:00:00.000Z',
  '2022-10-28T00:00:00.000Z',
  '2022-10-29T00:00:00.000Z',
  '2022-10-30T00:00:00.000Z',
  '2022-10-31T00:00:00.000Z'
]

const values = [0, 100, 200, 300, 400, 500, 700]

const IndexPage = () => (
  <div className="grid grid-cols-1 grid-rows-2 w-full gap-5 p-5">
    <div className="h-[300px] w-full">
      <wc-time-series labels={JSON.stringify(labels)} values={JSON.stringify(values)}></wc-time-series>
    </div>
    <div className="h-52 justify-center max-w-xs gap-4 p-5 shadow-2xl">
      <h1 className="text-2xl font-semibold">Counter</h1>
      <wc-counter
        metric="queryCount"
        styles={JSON.stringify({ position: 'center-right' })}
        sufixValue="%"
        accessToken={process.env.NEXT_PUBLIC_ACCESS_TOKEN}
        relativeTimeRange="LAST_90_DAYS"
      ></wc-counter>
    </div>
  </div>
)

export default IndexPage
