import { Leaderboard, LeaderboardChartVariant } from '@propeldata/ui-kit'
import React from 'react'
import { useFakeData } from '../../hooks/useFakeData'

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

export const LeaderboardStatic = () => {
  const [mockData, setMockData] = React.useState(mockData1)
  const [barsColor, setBarsColor] = React.useState('#75BFFF')
  const [chartType, setChartType] = React.useState<LeaderboardChartVariant>('bar')
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
      <h2 className="text-2xl">Leaderboard Static</h2>
      <div className="my-5">
        <Leaderboard
          card
          headers={data?.headers}
          rows={data?.rows}
          variant={chartType}
          loading={isLoading}
          // Custom styles
          className="custom-leaderboard"
          chartConfigProps={(config) => {
            // Custom bar color
            config.data.datasets[0].backgroundColor = barsColor
            return config
          }}
        />
      </div>
      <div className="flex items-center gap-2 mt-1">
        <button
          className="border-2 p-1 h-9"
          onClick={() => setMockData(mockData === mockData1 ? mockData2 : mockData1)}
        >
          Switch mock data
        </button>
        {chartType === 'bar' && (
          <input
            className="border-2 p-1 h-9"
            type="color"
            onChange={(event) => setBarsColor(event.target.value)}
            value={barsColor}
          />
        )}
        <select
          className="border-2 p-1 h-9"
          value={chartType}
          onChange={(event) => setChartType(event.target.value as LeaderboardChartVariant)}
        >
          <option value="bar">Bar</option>
          <option value="table">Table</option>
        </select>
        <button className="border-2 p-1 h-9" onClick={handleReFetchMock}>
          Refetch Mock
        </button>
      </div>
    </div>
  )
}
