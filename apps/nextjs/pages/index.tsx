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
  <div className="flex flex-col w-full gap-5 p-5 bg-slate-50 h-full">
    <h1 className="text-3xl font-semibold mb-5">Web Components Dashboard</h1>
    <div className="flex gap-5 w-full justify-around">
      <div className="h-52 w-full justify-center max-w-xs gap-4 p-5 shadow bg-white">
        <h1 className="text-2xl font-semibold">Budget</h1>
        <wc-counter value="1,283" prefixValue="$" styles={JSON.stringify({ position: 'center-right' })}></wc-counter>
      </div>
      <div className="h-52 w-full justify-center max-w-xs gap-4 p-5 shadow bg-white">
        <h1 className="text-2xl font-semibold text-right">Progress</h1>
        <wc-counter value="58" sufixValue="%" styles={JSON.stringify({ position: 'center-left' })}></wc-counter>
      </div>
      <div className="h-52 w-full justify-center max-w-xs gap-4 p-5 shadow bg-white">
        <h1 className="text-2xl font-semibold text-center">Records</h1>
        <wc-counter value="2000" styles={JSON.stringify({ position: 'center' })}></wc-counter>
      </div>
      <div className="h-52 w-full justify-center max-w-xs gap-4 p-5 shadow bg-white">
        <h1 className="text-2xl font-semibold">Likes</h1>
        <wc-counter value="22" prefixValue="👍" styles={JSON.stringify({ position: 'center-right' })}></wc-counter>
      </div>
    </div>
    <div className="h-[400px] w-full p-5 shadow bg-white">
      <h1 className="text-2xl font-semibold m-3">Total Sales</h1>
      <div className="h-[300px] w-full">
        <wc-time-series labels={JSON.stringify(labels)} values={JSON.stringify(values)}></wc-time-series>
      </div>
    </div>
  </div>
)

export default IndexPage
