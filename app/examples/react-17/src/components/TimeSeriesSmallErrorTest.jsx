import React from 'react'
import { TimeSeries } from '@propeldata/react-time-series'

export function TimeSeriesSmallErrorTest() {
  return (
    <div className="p-4 border-2 bg-neutral-100 border-slate-600 rounded m-3">
      <h2 className="text-2xl">TimeSeries Error Size</h2>
      <div className="w-36">
        <TimeSeries
          styles={{
            canvas: {
              // width: 150,
              // height: 150
            }
          }}
        />
      </div>
    </div>
  )
}
