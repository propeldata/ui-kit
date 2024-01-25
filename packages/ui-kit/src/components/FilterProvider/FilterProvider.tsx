import React, { createContext, useState } from 'react'

import { FilterInput } from '../../helpers'

interface FilterInputWithId extends FilterInput {
  id: symbol
}

export interface FilterContextValue {
  /** Filters that will be provided to the child components */
  filters: FilterInputWithId[]
  /** Setter function for the Filters */
  setFilters: React.Dispatch<React.SetStateAction<FilterInputWithId[]>>
}

export const FilterContext = createContext<FilterContextValue>({ filters: [], setFilters: () => {} })

export interface FilterContextProps {
  children?: React.ReactNode
  /** Set of pre defined filters that will be used by all the child components */
  baseFilters?: FilterInput[]
}

export const FilterProvider: React.FC<FilterContextProps> = ({ children, baseFilters }) => {
  const [filters, setFilters] = useState<FilterInputWithId[]>(
    baseFilters?.map((filter) => ({ ...filter, id: Symbol() })) ?? []
  )

  return <FilterContext.Provider value={{ filters, setFilters }}>{children}</FilterContext.Provider>
}
