'use client'

import React, { createContext, useState } from 'react'

import { FilterContextValue, FilterInputWithId } from './FilterProvider.types'

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

export const FilterProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [filters, setFilters] = useState<FilterInputWithId[]>([])

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
