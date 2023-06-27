import React from 'react'
import { TimeSeries } from '@propeldata/react-time-series'

export function TimeSeriesSmallErrorTest() {
  const [canvasWidth, setCanvasWidth] = React.useState(149)

  return (
    <div className="p-4 border-2 bg-neutral-100 border-slate-600 rounded m-3">
      <h2 className="text-2xl">TimeSeries Error size</h2>
      <div className="flex justify-center">
        <TimeSeries
          styles={{
            canvas: {
              width: canvasWidth,
              height: 150
            }
          }}
        />
      </div>
      <div className="flex items-center gap-2">
        <button className="border-2 bg-white p-1 h-9" onClick={() => setCanvasWidth(canvasWidth === 149 ? 150 : 149)}>
          Switch canvas width
        </button>
        <span>Canvas width: {canvasWidth}</span>
      </div>
    </div>
  )
}
