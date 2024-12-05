'use client'

import React, { createContext, useState } from 'react'
import { DataPoolInput, TimeRangeInput, TimeSeriesGranularity } from '../../graphql'

import { FilterContextProps, FilterContextValue, FilterInputWithId } from './FilterProvider.types'

export const FilterContext = createContext<FilterContextValue>({
  filters: [],
  setFilters: () => {},
  timeRange: null,
  setTimeRange: () => {},
  granularity: null,
  setGranularity: () => {},
  groupBy: [],
  setGroupBy: () => {},
  emptyGroupBy: [],
  maxGroupBy: undefined,
  dataPool: null,
  setDataPool: () => {}
})

export const FilterProvider: React.FC<React.PropsWithChildren<FilterContextProps>> = ({
  children,
  baseFilters,
  defaultGranularity = TimeSeriesGranularity.Day,
  defaultGroupBy = [],
  emptyGroupBy = [],
  maxGroupBy,
  defaultTimeRange,
  defaultDataPool
}) => {
  const [filters, setFilters] = useState<FilterInputWithId[]>(
    baseFilters?.map((filter) => ({ ...filter, id: Symbol() })) ?? []
  )
  const [timeRange, setTimeRange] = useState<TimeRangeInput | null | undefined>(defaultTimeRange)
  const [granularity, setGranularity] = useState<TimeSeriesGranularity>(defaultGranularity)
  const [groupBy, setGroupBy] = useState<string[]>(defaultGroupBy)
  const [dataPool, setDataPool] = useState<DataPoolInput | null | undefined>(defaultDataPool)

  return (
    <FilterContext.Provider
      value={{
        filters,
        setFilters,
        timeRange,
        setTimeRange,
        granularity,
        setGranularity,
        groupBy,
        setGroupBy,
        emptyGroupBy,
        maxGroupBy,
        dataPool,
        setDataPool
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}
