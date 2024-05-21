import { Counter } from '@propeldata/ui-kit'
import React from 'react'
import { ConnectedComponentProps } from '../../shared.types'

export const CounterConnected = ({ envs: { REACT_APP_METRIC_UNIQUE_NAME_1 }, timeRange }: ConnectedComponentProps) => {
  const [fontColor, setFontColor] = React.useState('#101828')
  const [refetchInterval, setRefetchInterval] = React.useState<number | undefined>(undefined)

  const handleSwitchRefetchInterval = () => {
    setRefetchInterval(refetchInterval ? undefined : 1000)
  }

  return (
    <div className="m-6">
      <h2 className="text-2xl">Counter Connected</h2>
      <div className="my-5">
        <Counter
          card
          query={{
            metric: REACT_APP_METRIC_UNIQUE_NAME_1,
            timeRange,
            refetchInterval,
            retry: false
          }}
          style={{ color: fontColor }}
        />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <input
          className="border-2 p-1 h-9"
          type="color"
          onChange={(event) => setFontColor(event.target.value)}
          value={fontColor}
        />
        <button className="border-2 p-1 h-9" onClick={handleSwitchRefetchInterval}>
          Refetch Interval: {refetchInterval ? 'On 1000ms' : 'Off'}
        </button>
      </div>
    </div>
  )
}
