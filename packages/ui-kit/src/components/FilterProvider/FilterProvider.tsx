import React, { createContext, useState } from 'react'

import { FilterInput } from 'src/helpers'

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
}

export const FilterProvider: React.FC<FilterContextProps> = ({ children }) => {
  const [filters, setFilters] = useState<FilterInputWithId[]>([])

  return <FilterContext.Provider value={{ filters, setFilters }}>{children}</FilterContext.Provider>
}
