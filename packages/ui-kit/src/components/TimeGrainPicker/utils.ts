import { TimeSeriesGranularity } from '../../graphql'

export const granularityLabel: Record<TimeSeriesGranularity, string> = {
  [TimeSeriesGranularity.Day]: 'Day',
  [TimeSeriesGranularity.FifteenMinutes]: '15 Minutes',
  [TimeSeriesGranularity.FiveMinutes]: '5 Minutes',
  [TimeSeriesGranularity.Hour]: 'Hour',
  [TimeSeriesGranularity.Minute]: 'Minute',
  [TimeSeriesGranularity.Month]: 'Month',
  [TimeSeriesGranularity.TenMinutes]: '10 Minutes',
  [TimeSeriesGranularity.Week]: 'Week',
  [TimeSeriesGranularity.Year]: 'Year'
}
