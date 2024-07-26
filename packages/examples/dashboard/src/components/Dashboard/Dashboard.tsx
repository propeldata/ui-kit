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
  getMatchingGrayColor,
  Card,
  Typography,
  colors,
  accentColors,
  AccentColors,
  grayColors,
  GrayColors,
  radii,
  Radii,
  scalings,
  Scalings,
  panelBackgrounds,
  PanelBackgrounds,
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
import BGImage from '../../assets/bg.svg'

const GlobalStyles = () => {
  const theme = useTheme()
  if (document && theme) {
    document.body.style.setProperty('--color-background', theme.getVar('--propel-accent-1') as string)
  }
  return null
}

interface DashboardProps extends DashboardCommonProps {
  fetchToken: () => Promise<string>
}

interface RoundColorButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  color: string
  selected: boolean
  onClick: () => void
}

const RoundColorButton = ({ selected, color, ...other }: RoundColorButtonProps) => (
  <button
    className="w-6 h-6 relative rounded-full m-1 outline outline-offset-2 cursor-pointer"
    style={{
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      backgroundColor: colors[color][`${color}11`],
      outlineColor: selected ? 'var(--propel-gray-11)' : 'transparent'
    }}
    {...other}
  />
)

export const Dashboard = ({ fetchToken, envs }: DashboardProps) => {
  const [appearance, setAppearance] = React.useState<ThemeAppearances>('light')
  const [timeRange, setTimeRange] = React.useState<DateRangeOptionsProps | undefined>({
    value: 'last-30-days'
  })

  const [accentColor, setAccentColor] = React.useState<AccentColors>('purple')
  const [grayColor, setGrayColor] = React.useState<GrayColors>(getMatchingGrayColor('purple'))
  const [radius, setRadius] = React.useState<Radii>('medium')
  const [scaling, setScaling] = React.useState<Scalings>('100%')
  const [panelBackground, setPanelBackground] = React.useState<PanelBackgrounds>('translucent')

  return (
    <AccessTokenProvider fetchToken={fetchToken}>
      <FilterProvider>
        <ThemeProvider
          accentColor={accentColor}
          grayColor={grayColor}
          radius={radius}
          scaling={scaling}
          panelBackground={panelBackground}
          appearance={appearance}
          renderEmpty={() => (
            <div style={{ display: 'flex', flex: 1, justifyContent: 'center', alignItems: 'center', height: 300 }}>
              No Data
            </div>
          )}
        >
          <GlobalStyles />
          <main
            className="relative"
            style={{ color: 'var(--propel-gray-11)', backgroundColor: 'var(--propel-color-background)' }}
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
            <div className="flex relative">
              <div className="absolute inset-1">
                <BGImage />
              </div>
              <div className="flex-1 z-10">
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
              <div className="flex-none w-96 pr-6 z-10" data-scaling="100%">
                <Card style={{ boxShadow: 'var(--propel-shadow-4)' }}>
                  <Typography size={6} className="mb-4 block">
                    Theme
                  </Typography>
                  <Typography className="mb-2 block">Accent color</Typography>
                  <div className="flex flex-wrap mb-4">
                    {accentColors.map((color) => (
                      <RoundColorButton
                        key={color}
                        color={color}
                        selected={color === accentColor}
                        title={color}
                        onClick={() => setAccentColor(color)}
                      />
                    ))}
                  </div>
                  <Typography className="mb-2 block">Gray color</Typography>
                  <div className="flex flex-wrap mb-4">
                    {grayColors
                      .filter((color) => color !== 'auto')
                      .map((color) => (
                        <RoundColorButton
                          key={color}
                          color={color}
                          selected={color === grayColor}
                          title={color}
                          onClick={() => setGrayColor(color)}
                        />
                      ))}
                  </div>
                  <Typography className="mb-2 block">Radius</Typography>
                  <div className="flex flex-wrap mb-4">
                    {radii.map((radiusVal) => (
                      <button
                        data-radius={radiusVal}
                        className="p-2 mr-1 mb-1 relative outline outline-offset-1 cursor-pointer"
                        style={{ outlineColor: radius === radiusVal ? 'var(--propel-gray-11)' : 'transparent' }}
                        key={radiusVal}
                        onClick={() => setRadius(radiusVal)}
                      >
                        <div
                          style={{
                            width: 32,
                            height: 32,
                            borderTopLeftRadius: 'var(--propel-radius-5)',
                            backgroundImage:
                              'linear-gradient(to bottom right, var(--propel-accent-3), var(--propel-accent-4))',
                            borderTop: '2px solid var(--propel-accent-a8)',
                            borderLeft: '2px solid var(--propel-accent-a8)'
                          }}
                        />
                      </button>
                    ))}
                  </div>
                  <Typography className="mb-2 block">Scaling</Typography>
                  <div className="flex flex-wrap mb-4">
                    {scalings.map((scalingVal) => (
                      <button
                        className="px-2 py-1 mr-1 mb-1 relative outline outline-offset-1 cursor-pointer"
                        style={{ outlineColor: scaling === scalingVal ? 'var(--propel-gray-11)' : 'transparent' }}
                        key={scalingVal}
                        onClick={() => setScaling(scalingVal)}
                      >
                        <Typography size={1}>{scalingVal}</Typography>
                      </button>
                    ))}
                  </div>
                  <Typography className="mb-2 block">Panel background</Typography>
                  <div className="flex flex-wrap mb-4 gap-2">
                    {panelBackgrounds.map((panelBackgroundVal) => (
                      <button
                        className="px-2 py-1 mr-1 mb-1 relative outline outline-offset-1 cursor-pointer flex-1"
                        style={{
                          outlineColor:
                            panelBackground === panelBackgroundVal ? 'var(--propel-gray-11)' : 'var(--propel-gray-4)'
                        }}
                        key={panelBackgroundVal}
                        onClick={() => setPanelBackground(panelBackgroundVal)}
                      >
                        <Typography size={1}>{panelBackgroundVal}</Typography>
                      </button>
                    ))}
                  </div>
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
