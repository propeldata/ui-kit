'use client'

import React, { createContext, useEffect, useState } from 'react'
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
  setDataPool: () => {},
  filterSql: null,
  setFilterSql: () => {},
  filterSqlList: [],
  setFilterSqlList: () => {}
})

export const FilterProvider: React.FC<React.PropsWithChildren<FilterContextProps>> = ({
  children,
  baseFilters,
  defaultGranularity = TimeSeriesGranularity.Day,
  defaultGroupBy = [],
  emptyGroupBy = [],
  maxGroupBy,
  defaultTimeRange,
  defaultDataPool,
  baseFilterSql
}) => {
  const [filters, setFilters] = useState<FilterInputWithId[]>(
    baseFilters?.map((filter) => ({ ...filter, id: Symbol() })) ?? []
  )
  const [timeRange, setTimeRange] = useState<TimeRangeInput | null | undefined>(defaultTimeRange)
  const [granularity, setGranularity] = useState<TimeSeriesGranularity>(defaultGranularity)
  const [groupBy, setGroupBy] = useState<string[]>(defaultGroupBy)
  const [dataPool, setDataPool] = useState<DataPoolInput | null | undefined>(defaultDataPool)
  const [filterSql, setFilterSql] = useState<string | null | undefined>(baseFilterSql)

  const [filterSqlList, setFilterSqlList] = useState<Array<{ filterSql: string; id: symbol }>>([])

  useEffect(() => {
    if (filterSqlList.length > 0) {
      setFilterSql(filterSqlList.map(({ filterSql }) => filterSql).join(' AND '))
    } else {
      setFilterSql(baseFilterSql)
    }
  }, [baseFilterSql, filterSql, filterSqlList])

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
        setDataPool,
        filterSql,
        setFilterSql,
        filterSqlList,
        setFilterSqlList
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}
