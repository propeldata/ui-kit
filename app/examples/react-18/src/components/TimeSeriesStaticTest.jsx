import React from 'react'
import { TimeSeries } from '@propeldata/ui-kit'

import { useFakeData } from 'hooks/useFakeData'

const mockData1 = {
  labels: [
    '01/02',
    '02/02',
    '03/02',
    '04/02',
    '05/02',
    '06/02',
    '07/02',
    '08/02',
    '09/02',
    '10/02',
    '11/02',
    '12/02',
    '13/02',
    '14/02',
    '15/02',
    '16/02',
    '17/02',
    '18/02',
    '19/02',
    '20/02'
  ],
  values: [809, 984, 673, 530, 522, 471, 872, 578, 825, 619, 38, 326, 128, 615, 844, 58, 576, 28, 663, 189]
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
