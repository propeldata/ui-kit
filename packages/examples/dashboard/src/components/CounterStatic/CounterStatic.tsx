import { Button, Counter } from '@propeldata/ui-kit'
import React from 'react'
import { useFakeData } from '../../hooks/useFakeData'

const mockData1 = {
  value: '3291243782'
}

const mockData2 = {
  value: '1214256124'
}

export const CounterStatic = () => {
  const [mockData, setMockData] = React.useState(mockData1)
  const { data, isLoading, setIsLoading } = useFakeData(mockData)

  const handleReFetchMock = () => {
    setIsLoading(true)
    setTimeout(() => {
      setMockData(mockData2)
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="m-6">
      <h2 className="text-2xl">Counter Static</h2>
      <div className="my-4">
        <Counter
          renderEmpty={() => <div style={{ display: 'flex', flex: 1, alignItems: 'center', height: 67 }}>No Data</div>}
          card
          value={data?.value}
          loading={isLoading}
          style={{ color: 'var(--accent-11)' }}
        />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <Button size="small" onClick={() => setMockData(mockData === mockData1 ? mockData2 : mockData1)}>
          Switch mock data
        </Button>
        <Button size="small" onClick={handleReFetchMock}>
          Refetch Mock
        </Button>
        <Button size="small" onClick={() => setMockData(mockData.value === '' ? mockData1 : { value: '' })}>
          No data: {mockData.value === '' ? 'On' : 'Off'}
        </Button>
      </div>
    </div>
  )
}
