import React from 'react'
import { TimeSeries } from '@propeldata/react-time-series'

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
  values: [809, 984, 673, 500, 522, 471, 872, 578, 123, 619, 38, 326, 128, 11, 844, 58, 576, 28, 663, 189]
}

export function TimeSeriesStaticTest() {
  const [mockData, setMockData] = React.useState(mockData1)
  const [barsColor, setBarsColor] = React.useState('#ccc')
  const [chartType, setChartType] = React.useState('bar')
  const [pointStyle, setPointStyle] = React.useState('cross')

  const { data, isLoading } = useFakeData(mockData)

  const handleReFetchMock = () => {
    setMockData({ labels: undefined, values: undefined })
    setTimeout(() => {
      setMockData(mockData2)
    }, 2000)
  }

  return (
    <div className="p-4 border-2 bg-neutral-100 border-slate-600 rounded m-3">
      <h2 className="text-2xl">TimeSeries Static</h2>
      <TimeSeries
        variant={chartType}
        labels={data?.labels}
        values={data?.values}
        loading={isLoading || !data?.labels || !data.values}
        styles={{
          bar: { backgroundColor: barsColor },
          canvas: { backgroundColor: '#f5f5f5' },
          point: { style: pointStyle }
        }}
      />
      <div className="flex items-center gap-2">
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
