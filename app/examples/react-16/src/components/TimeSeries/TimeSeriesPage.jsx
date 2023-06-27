import React from 'react'

import { TimeSeriesConnectedTest, TimeSeriesSmallErrorTest, TimeSeriesStaticTest } from '.'

export function TimeSeriesPage() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <TimeSeriesStaticTest />
      <TimeSeriesConnectedTest />
      <TimeSeriesSmallErrorTest />
    </div>
  )
}
