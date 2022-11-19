// @ts-nocheck
import '@propeldata/wc-time-series'

const IndexPage = () => (
  <time-series metric="queryCount" accessToken={process.env.NEXT_PUBLIC_ACCESS_TOKEN}></time-series>
)

export default IndexPage
