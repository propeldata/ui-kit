'use client'

import React, { createContext, useState } from 'react'

import { FilterInput, TimeSeriesGranularity } from '../../graphql'
import { DateRangeOptionsProps } from '../TimeRangePicker'

interface FilterInputWithId extends FilterInput {
  id: symbol
}

export interface FilterContextValue {
  /** Filters that will be provided to the child components */
  filters: FilterInputWithId[]
  /** Setter function for the Filters */
  setFilters: React.Dispatch<React.SetStateAction<FilterInputWithId[]>>
  /** Timerange that will be provided to the child components */
  timeRange: DateRangeOptionsProps | null
  /** Setter function for the Time Range */
  setTimeRange: React.Dispatch<React.SetStateAction<DateRangeOptionsProps>>
  /** Time granularity that will be provided to the child components */
  granularity: TimeSeriesGranularity | null
  /** Setter function for the Time Granularity */
  setGranularity: React.Dispatch<React.SetStateAction<TimeSeriesGranularity>>
}

export const FilterContext = createContext<FilterContextValue>({
  filters: [],
  setFilters: () => {},
  timeRange: null,
  setTimeRange: () => {},
  granularity: null,
  setGranularity: () => {}
})

export interface FilterContextProps {
  children?: React.ReactNode
  /** Set of pre defined filters that will be used by all the child components */
  baseFilters?: FilterInput[]
  /** Default time granularity */
  defaultGranularity?: TimeSeriesGranularity
}

export const FilterProvider: React.FC<FilterContextProps> = ({
  children,
  baseFilters,
  defaultGranularity = TimeSeriesGranularity.Day
}) => {
  const [filters, setFilters] = useState<FilterInputWithId[]>(
    baseFilters?.map((filter) => ({ ...filter, id: Symbol() })) ?? []
  )
  const [timeRange, setTimeRange] = useState<DateRangeOptionsProps>({ value: '' })
  const [granularity, setGranularity] = useState<TimeSeriesGranularity>(defaultGranularity)

  return (
    <FilterContext.Provider value={{ filters, setFilters, timeRange, setTimeRange, granularity, setGranularity }}>
      {children}
    </FilterContext.Provider>
  )
}
