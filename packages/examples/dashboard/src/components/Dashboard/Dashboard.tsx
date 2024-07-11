import {
  AccessTokenProvider,
  Button,
  ThemeAppearances,
  FilterProvider,
  RelativeTimeRange,
  SimpleFilter,
  ThemeProvider,
  TimeRangePicker,
  DateRangeOptionsProps,
  Card,
  Typography,
  Select,
  Option,
  accentColors,
  useTheme
} from '@propeldata/ui-kit'
import React from 'react'
import { DashboardCommonProps } from '../../shared.types'
import { CounterConnected } from '../CounterConnected'
import { CounterStatic } from '../CounterStatic'
import { LeaderboardConnected } from '../LeaderboardConnected'
import { LeaderboardStatic } from '../LeaderboardStatic'
import { PieChartConnected } from '../PieChartConnected'
import { PieChartStatic } from '../PieChartStatic'
import { TimeSeriesConnected } from '../TimeSeriesConnected'
import { TimeSeriesStatic } from '../TimeSeriesStatic'

const accentColorOptions = accentColors.map((color) => ({ label: color, value: color }))

const GlobalStyles = () => {
  const theme = useTheme()
  if (document && theme) {
    document.body.style.setProperty('--bg-color', theme.getVar('--accent-1') as string)
  }
  return null
}

interface DashboardProps extends DashboardCommonProps {
  fetchToken: () => Promise<string>
}

export const Dashboard = ({ fetchToken, envs }: DashboardProps) => {
  const [appearance, setAppearance] = React.useState<ThemeAppearances>('light')
  const [timeRange, setTimeRange] = React.useState<DateRangeOptionsProps | undefined>({
    value: 'last-30-days'
  })

  const [accentColor, setAccentColor] = React.useState(accentColorOptions.find((color) => color.value === 'purple'))

  return (
    <AccessTokenProvider fetchToken={fetchToken}>
      <FilterProvider>
        <ThemeProvider
          accentColor={accentColor?.value ?? 'purple'}
          appearance={appearance}
          renderEmpty={() => (
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: 300 }}>
              No Data
            </div>
          )}
        >
          <GlobalStyles />
          <main
            style={{ color: 'var(--propel-text-secondary)', backgroundColor: 'var(--propel-background-secondary)' }}
          >
            <h1 className="px-6 py-3 text-3xl">React {React.version} Testing App</h1>
            <hr />
            <div className="px-6 py-3 w-full flex justify-between">
              <SimpleFilter
                query={{
                  columnName: envs.REACT_APP_DIMENSION_1,
                  dataPool: { name: envs.REACT_APP_DATA_POOL_UNIQUE_NAME_1 ?? '' },
                  maxValues: 1000,
                  timeRange: { relative: RelativeTimeRange.LastNDays, n: 30 }
                }}
                autocompleteProps={{ containerStyle: { width: '500px' }, placeholder: 'Filter by taco name' }}
              />
              <TimeRangePicker value={timeRange} onChange={setTimeRange} />
            </div>
            <div className="flex">
              <div className="flex-1">
                <div className="grid grid-cols-2 gap-2">
                  {timeRange?.value && (
                    <>
                      <TimeSeriesStatic />
                      <TimeSeriesConnected envs={envs} timeRange={timeRange?.params} />
                      <LeaderboardStatic />
                      <LeaderboardConnected envs={envs} timeRange={timeRange?.params} />
                      <CounterStatic />
                      <CounterConnected envs={envs} timeRange={timeRange?.params} />
                      <PieChartStatic />
                      <PieChartConnected envs={envs} timeRange={timeRange?.params} />
                    </>
                  )}
                </div>
              </div>
              <div className="flex-none w-96 pr-6">
                <Card style={{ boxShadow: 'var(--shadow-4)' }}>
                  <Typography size={6} className="mb-4 block">
                    Theme
                  </Typography>
                  <Typography className="mb-2 block">Accent color</Typography>
                  <Select
                    className="mb-4"
                    value={accentColor}
                    onChange={(_, val) => setAccentColor(val as typeof accentColor)}
                  >
                    {accentColorOptions.map((color) => (
                      <Option key={color.value} value={color}>
                        {color.label}
                      </Option>
                    ))}
                  </Select>
                  <Typography className="mb-2 block">Appearance</Typography>
                  <div className="flex gap-3 justify-between">
                    <Button
                      variant={appearance === 'light' ? 'primary' : 'outline'}
                      style={{ flex: 1 }}
                      onClick={() => setAppearance('light')}
                    >
                      Light 🌞
                    </Button>
                    <Button
                      variant={appearance === 'dark' ? 'primary' : 'outline'}
                      style={{ flex: 1 }}
                      onClick={() => setAppearance('dark')}
                    >
                      Dark 🌚
                    </Button>
                  </div>
                </Card>
              </div>
            </div>
          </main>
        </ThemeProvider>
      </FilterProvider>
    </AccessTokenProvider>
  )
}
