'use client'

import React, { createContext, useState } from 'react'

import { FilterInput } from '../../graphql'
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
}

export const FilterContext = createContext<FilterContextValue>({
  filters: [],
  setFilters: () => {},
  timeRange: null,
  setTimeRange: () => {}
})

export interface FilterContextProps {
  children?: React.ReactNode
  /** Set of pre defined filters that will be used by all the child components */
  baseFilters?: FilterInput[]
}

export const FilterProvider: React.FC<FilterContextProps> = ({ children, baseFilters }) => {
  const [filters, setFilters] = useState<FilterInputWithId[]>(
    baseFilters?.map((filter) => ({ ...filter, id: Symbol() })) ?? []
  )
  const [timeRange, setTimeRange] = useState<DateRangeOptionsProps>({ value: '' })

  return (
    <FilterContext.Provider value={{ filters, setFilters, timeRange, setTimeRange }}>{children}</FilterContext.Provider>
  )
}
