import React from 'react'
import { TimeSeries } from '@propeldata/ui-kit'

import { useFakeData } from 'hooks/useFakeData'

const mockData1 = {
  labels: [
    '2023-08-29T05:00:00Z',
    '2023-08-29T06:00:00Z',
    '2023-08-29T07:00:00Z',
    '2023-08-29T08:00:00Z',
    '2023-08-29T09:00:00Z',
    '2023-08-29T10:00:00Z',
    '2023-08-29T11:00:00Z',
    '2023-08-29T12:00:00Z',
    '2023-08-29T13:00:00Z',
    '2023-08-29T14:00:00Z',
    '2023-08-29T15:00:00Z',
    '2023-08-29T16:00:00Z',
    '2023-08-29T17:00:00Z',
    '2023-08-29T18:00:00Z',
    '2023-08-29T19:00:00Z',
    '2023-08-29T20:00:00Z',
    '2023-08-29T21:00:00Z',
    '2023-08-29T22:00:00Z',
    '2023-08-29T23:00:00Z',
    '2023-08-30T00:00:00Z',
    '2023-08-30T01:00:00Z',
    '2023-08-30T02:00:00Z',
    '2023-08-30T03:00:00Z',
    '2023-08-30T04:00:00Z'
  ],
  values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24]
}

const mockData2 = {
  labels: [
    '2023-05-11T00:00:00.000Z',
    '2023-05-12T00:00:00.000Z',
    '2023-05-13T00:00:00.000Z',
    '2023-05-14T00:00:00.000Z',
    '2023-05-15T00:00:00.000Z',
    '2023-05-16T00:00:00.000Z',
    '2023-05-17T00:00:00.000Z'
  ],
  values: [0, 200, 300, 400, 79187691, 248679, 131034]
}

export function TimeSeriesStaticTest() {
  const [mockData, setMockData] = React.useState(mockData1)
  const [barsColor, setBarsColor] = React.useState('#ccc')
  const [chartType, setChartType] = React.useState('bar')
  const [pointStyle, setPointStyle] = React.useState('cross')

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
      <h2 className="text-2xl">TimeSeries Static</h2>
      <TimeSeries
        variant={chartType}
        labels={data?.labels}
        values={data?.values}
        loading={isLoading}
        styles={{
          bar: { backgroundColor: barsColor },
          canvas: { backgroundColor: '#f5f5f5' },
          point: { style: pointStyle },
          yAxis: {
            beginAtZero: true,
            scale: 'logarithmic'
          }
        }}
      />
      <div className="flex items-center gap-2 mt-1">
        <button
          className="border-2 bg-white p-1 h-9"
          onClick={() => setMockData(mockData === mockData1 ? mockData2 : mockData1)}
        >
          Switch mock data
        </button>
        <input
          className="border-2 bg-white p-1 h-9 cursor-pointer"
          type="color"
          onChange={(event) => setBarsColor(event.target.value)}
        />
        <select
          className="border-2 bg-white p-1 h-9 cursor-pointer"
          value={chartType}
          onChange={(event) => setChartType(event.target.value)}
        >
          <option value="bar">Bar</option>
          <option value="line">Line</option>
        </select>
        <button
          className="border-2 bg-white p-1 h-9"
          onClick={() => setPointStyle(pointStyle === 'cross' ? 'triangle' : 'cross')}
        >
          Switch point style
        </button>
        <button className="border-2 bg-white p-1 h-9" onClick={handleReFetchMock}>
          Refetch Mock
        </button>
      </div>
    </div>
  )
}
