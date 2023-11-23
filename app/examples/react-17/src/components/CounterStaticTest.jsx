import React from 'react'
import { Counter } from '@propeldata/ui-kit'

import { useFakeData } from 'hooks/useFakeData'

const mockData1 = {
  value: '3291243782'
}

const mockData2 = {
  value: '1214256124'
}

export function CounterStaticTest() {
  const [mockData, setMockData] = React.useState(mockData1)
  const [fontColor, setFontColor] = React.useState('#000')

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
      <div className="my-5">
        <Counter card value={data?.value} loading={isLoading} styles={{ font: { size: '3rem', color: fontColor } }} />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <button
          className="border-2 p-1 h-9"
          onClick={() => setMockData(mockData === mockData1 ? mockData2 : mockData1)}
        >
          Switch mock data
        </button>
        <input className="border-2 p-1 h-9" type="color" onChange={(event) => setFontColor(event.target.value)} />
        <button className="border-2 p-1 h-9" onClick={handleReFetchMock}>
          Refetch Mock
        </button>
      </div>
    </div>
  )
}
