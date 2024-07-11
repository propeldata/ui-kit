import { Button, Counter } from '@propeldata/ui-kit'
import React from 'react'
import { ConnectedComponentProps } from '../../shared.types'

export const CounterConnected = ({ envs: { REACT_APP_METRIC_UNIQUE_NAME_1 }, timeRange }: ConnectedComponentProps) => {
  const [refetchInterval, setRefetchInterval] = React.useState<number | undefined>(undefined)

  const handleSwitchRefetchInterval = () => {
    setRefetchInterval(refetchInterval ? undefined : 1000)
  }

  return (
    <div className="m-6">
      <h2 className="text-2xl">Counter Connected</h2>
      <div className="my-4">
        <Counter
          card
          query={{
            metric: REACT_APP_METRIC_UNIQUE_NAME_1,
            timeRange,
            refetchInterval,
            retry: false
          }}
          style={{ color: 'var(--accent-11)' }}
        />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <Button size="small" onClick={handleSwitchRefetchInterval}>
          Refetch Interval: {refetchInterval ? 'On 1000ms' : 'Off'}
        </Button>
      </div>
    </div>
  )
}
