import React from 'react'
import { Counter, RelativeTimeRange } from '@propeldata/react-counter'

const { REACT_APP_PROPEL_ACCESS_TOKEN, REACT_APP_METRIC_UNIQUE_NAME_1 } = process.env

export function CounterConnectedTest() {
  const [fontColor, setFontColor] = React.useState('#000')
  const [refetchInterval, setRefetchInterval] = React.useState(undefined)

  const handleSwitchRefetchInterval = () => {
    setRefetchInterval(refetchInterval ? undefined : 1000)
  }

  return (
    <div className="p-4 border-2 bg-neutral-100 border-slate-600 rounded m-3">
      <h2 className="text-2xl">Counter Connected</h2>
      <div className="h-60 flex justify-center items-center">
        <Counter
          query={{
            accessToken: REACT_APP_PROPEL_ACCESS_TOKEN,
            metric: REACT_APP_METRIC_UNIQUE_NAME_1,
            timeRange: {
              relative: RelativeTimeRange.LastNDays,
              n: 30
            },
            refetchInterval,
            retry: false
          }}
          styles={{ font: { size: '3rem', color: fontColor } }}
        />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <input
          className="border-2 bg-white p-1 h-9"
          type="color"
          onChange={(event) => setFontColor(event.target.value)}
        />
        <button className="border-2 bg-white p-1 h-9" onClick={handleSwitchRefetchInterval}>
          Refetch Interval: {refetchInterval ? 'On 1000ms' : 'Off'}
        </button>
      </div>
    </div>
  )
}
