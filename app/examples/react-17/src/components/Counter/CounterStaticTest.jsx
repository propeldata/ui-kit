import React from 'react'
import { Counter } from '@propeldata/react-counter'

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

  const { data, isLoading } = useFakeData(mockData)

  const handleReFetchMock = () => {
    setMockData({ value: undefined })
    setTimeout(() => {
      setMockData(mockData2)
    }, 2000)
  }

  return (
    <div className="p-4 border-2 bg-neutral-100 border-slate-600 rounded m-3">
      <h2 className="text-2xl">Counter Static</h2>
      <div className="h-60 flex justify-center items-center">
        <Counter
          value={data?.value}
          loading={isLoading || !data?.value}
          styles={{ font: { size: '3rem', color: fontColor } }}
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          className="border-2 bg-white p-1 h-9"
          onClick={() => setMockData(mockData === mockData1 ? mockData2 : mockData1)}
        >
          Switch mock data
        </button>
        <input
          className="border-2 bg-white p-1 h-9"
          type="color"
          onChange={(event) => setFontColor(event.target.value)}
        />
        <button className="border-2 bg-white p-1 h-9" onClick={handleReFetchMock}>
          Refetch Mock
        </button>
      </div>
    </div>
  )
}
