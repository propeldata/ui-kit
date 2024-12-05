import { DataPoolInput, FilterInput, TimeRangeInput, TimeSeriesGranularity } from '../../graphql'

export interface FilterInputWithId extends FilterInput {
  id: symbol
}

export interface FilterContextValue {
  /** Filters that will be provided to the child components */
  filters: FilterInputWithId[]
  /** Setter function for the Filters */
  setFilters: React.Dispatch<React.SetStateAction<FilterInputWithId[]>>
  /** Timerange that will be provided to the child components */
  timeRange: TimeRangeInput | null | undefined
  /** Setter function for the Time Range */
  setTimeRange: React.Dispatch<React.SetStateAction<TimeRangeInput | null | undefined>>
  /** Time granularity that will be provided to the child components */
  granularity: TimeSeriesGranularity | null
  /** Setter function for the Time Granularity */
  setGranularity: React.Dispatch<React.SetStateAction<TimeSeriesGranularity>>
  /** Columns to group by */
  groupBy: string[]
  /** Setter function for the Group By */
  setGroupBy: React.Dispatch<React.SetStateAction<string[]>>
  /** GroupBy to be used when the groupBy is empty */
  emptyGroupBy: string[]
  /** Maximum number of group by columns */
  maxGroupBy: number | undefined
  /** Data Pool input that will be used for all child components that use a Data Pool input */
  dataPool: DataPoolInput | null | undefined
  /** Setter function for the Data Pool */
  setDataPool: React.Dispatch<React.SetStateAction<DataPoolInput | null>>
}

export interface FilterContextProps {
  /** Set of pre defined filters that will be used by all the child components */
  baseFilters?: FilterInput[]
  /** Default time granularity */
  defaultGranularity?: TimeSeriesGranularity
  /** Default group by */
  defaultGroupBy?: string[]
  /** GroupBy to be used when the groupBy is empty */
  emptyGroupBy?: string[]
  /** Maximum number of group by columns */
  maxGroupBy?: number
  /** Data Pool input that will be used for all child components that use a Data Pool input
   *
   * In this example, the Counter component will use the default Data Pool input
   * @example
   * <FilterProvider defaultDataPool={{ name: 'Default Data Pool' }}>
   *  <Counter query={{ metric: { count: {} } }} />
   * </FilterProvider>
   */
  defaultDataPool?: DataPoolInput | null | undefined
  /** Default time range */
  defaultTimeRange?: TimeRangeInput | null
}
