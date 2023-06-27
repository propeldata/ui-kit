import React from 'react'

import { CounterConnectedTest, CounterStaticTest } from '.'

export function CounterPage() {
  return (
    <div className="grid grid-cols-2 gap-2">
      <CounterStaticTest />
      <CounterConnectedTest />
    </div>
  )
}
