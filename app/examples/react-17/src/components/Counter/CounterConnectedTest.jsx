import React from 'react'
import { Counter, RelativeTimeRange } from '@propeldata/react-counter'

export function CounterConnectedTest() {
  const [fontColor, setFontColor] = React.useState('#000')

  return (
    <div className="p-4 border-2 bg-neutral-100 border-slate-600 rounded m-3">
      <h2 className="text-2xl">Counter Connected</h2>
      <div className="h-60 flex justify-center items-center">
        <Counter
          query={{
            accessToken: '<PROPEL_ACCESS_TOKEN>',
            metric: '<METRIC_UNIQUE_NAME>',
            timeRange: {
              relative: RelativeTimeRange.LastNDays,
              n: 30
            }
          }}
          styles={{ font: { size: '3rem', color: fontColor } }}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          className="border-2 bg-white p-1 h-9"
          type="color"
          onChange={(event) => setFontColor(event.target.value)}
        />
      </div>
    </div>
  )
}
