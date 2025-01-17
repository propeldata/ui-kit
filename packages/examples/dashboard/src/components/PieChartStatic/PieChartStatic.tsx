import { PieChart, PieChartVariant, Button, Select, Option, Typography } from '@propeldata/ui-kit'
import React from 'react'
import { useFakeData } from '../../hooks/useFakeData'

const mockData1 = {
  headers: ['Instagram', 'value'],
  rows: [
    ['Likes', '9'],
    ['Follow', '1'],
    ['Test', '4'],
    ['Other', '7']
  ]
}

const mockData2 = {
  headers: ['Instagram', 'value'],
  rows: [
    ['Likes', '43'],
    ['Follow', '21'],
    ['Test', '125'],
    ['Other', '68']
  ]
}

type chartTypeOption = {
  value: PieChartVariant
  label: string
}

const chartTypeOptions: chartTypeOption[] = [
  { value: 'pie', label: 'Pie' },
  { value: 'doughnut', label: 'Doughnut' }
]

export const PieChartStatic = () => {
  const [chartType, setChartType] = React.useState(chartTypeOptions[0])
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
      <Typography size={6}>PieChart Static</Typography>
      <div className="my-4">
        <PieChart card headers={data?.headers} rows={data?.rows} variant={chartType.value} loading={isLoading} />
      </div>
      <div className="flex items-center gap-2 mt-1 justify-between">
        <div className="flex-1 flex gap-2">
          <Button size="small" onClick={() => setMockData(mockData === mockData1 ? mockData2 : mockData1)}>
            Switch mock data
          </Button>
          <Button size="small" onClick={handleReFetchMock}>
            Refetch Mock
          </Button>
        </div>
        <div className="flex-none">
          <Select
            size="small"
            onChange={(_, val) => setChartType(val as (typeof chartTypeOptions)[0])}
            value={chartType}
          >
            {chartTypeOptions.map((option) => (
              <Option key={option.value} value={option}>
                {option.label}
              </Option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  )
}
