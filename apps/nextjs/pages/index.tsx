import '@propeldata/wc-time-series'
import '@propeldata/wc-counter'

const IndexPage = () => (
  <div className="grid grid-cols-1 grid-rows-2 w-full gap-5 p-5">
    <div className="w-full h-[600px] col-span-4">
      <time-series metric="queryCount" accessToken={process.env.NEXT_PUBLIC_ACCESS_TOKEN}></time-series>
    </div>
    <div className="flex flex-col h-52 justify-center max-w-xs gap-4 p-5 shadow-2xl">
      <h1 className="text-2xl font-semibold">Counter</h1>
      <counter-web
        metric="queryCount"
        styles={JSON.stringify({ position: 'right' })}
        noSeparator
        valueSufix="%"
        accessToken={process.env.NEXT_PUBLIC_ACCESS_TOKEN}
        relativeTimeRange="LAST_90_DAYS"
      ></counter-web>
    </div>
  </div>
)

export default IndexPage
