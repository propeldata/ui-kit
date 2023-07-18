import React from 'react'
import { Leaderboard } from '@propeldata/ui-kit'

import { useFakeData } from 'hooks/useFakeData'

const mockData1 = {
  headers: ['Instagram', 'value'],
  rows: [
    ['Likes', '9'],
    ['Follow', '1'],
    ['Test', '4'],
    ['Another', '7']
  ]
}

const mockData2 = {
  headers: ['Instagram', 'value'],
  rows: [
    ['Likes', '4'],
    ['Follow', '2'],
    ['Test', '8'],
    ['Another', '5']
  ]
}

export function LeaderboardStaticTest() {
  const [mockData, setMockData] = React.useState(mockData1)
  const [barsColor, setBarsColor] = React.useState('#ccc')
  const [chartType, setChartType] = React.useState('bar')

  const { data, isLoading, setIsLoading } = useFakeData(mockData)

  const handleReFetchMock = () => {
    setIsLoading(true)
    setTimeout(() => {
      setMockData(mockData2)
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="p-4 border-2 bg-neutral-100 border-slate-600 rounded m-3">
      <h2 className="text-2xl">Leaderboard Static</h2>
      <Leaderboard
        headers={data?.headers}
        rows={data?.rows}
        variant={chartType}
        loading={isLoading}
        styles={{
          bar: { backgroundColor: barsColor },
          table: { height: '200px', backgroundColor: '#f5f5f5', header: { backgroundColor: '#f5f5f5' } },
          canvas: { backgroundColor: '#f5f5f5' }
        }}
      />
      <div className="flex items-center gap-2 mt-1">
        <button
          className="border-2 bg-white p-1 h-9"
          onClick={() => setMockData(mockData === mockData1 ? mockData2 : mockData1)}
        >
          Switch mock data
        </button>
        <select
          className="border-2 bg-white p-1 h-9"
          value={chartType}
          onChange={(event) => setChartType(event.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="table">Table</option>
        </select>
        <input
          className="border-2 bg-white p-1 h-9"
          type="color"
          onChange={(event) => setBarsColor(event.target.value)}
        />
        <button className="border-2 bg-white p-1 h-9" onClick={handleReFetchMock}>
          Refetch Mock
        </button>
      </div>
    </div>
  )
}
