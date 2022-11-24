import '@propeldata/wc-time-series'
import '@propeldata/wc-counter'

const IndexPage = () => (
  <div className="grid grid-cols-1 grid-rows-2 w-full gap-5 p-5">
    <div className="w-full h-[600px] col-span-4">
      <time-series metric="queryCount" accessToken={process.env.NEXT_PUBLIC_ACCESS_TOKEN}></time-series>
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
