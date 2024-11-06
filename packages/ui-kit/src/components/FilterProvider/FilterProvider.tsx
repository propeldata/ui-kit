'use client'

import React, { createContext, useState } from 'react'
import { TimeSeriesGranularity } from '../../graphql'
import { DateRangeOptionsProps } from '../TimeRangePicker'

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
  maxGroupBy: undefined
})

export const FilterProvider: React.FC<FilterContextProps> = ({
  children,
  baseFilters,
  defaultGranularity = TimeSeriesGranularity.Day,
  defaultGroupBy = [],
  emptyGroupBy = [],
  maxGroupBy
}) => {
  const [filters, setFilters] = useState<FilterInputWithId[]>(
    baseFilters?.map((filter) => ({ ...filter, id: Symbol() })) ?? []
  )
  const [timeRange, setTimeRange] = useState<DateRangeOptionsProps>({ value: '' })
  const [granularity, setGranularity] = useState<TimeSeriesGranularity>(defaultGranularity)
  const [groupBy, setGroupBy] = useState<string[]>(defaultGroupBy)

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
        maxGroupBy
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}
