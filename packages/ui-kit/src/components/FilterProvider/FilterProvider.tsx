import React, { createContext, useState } from 'react'

import { FilterContextValue, FilterInputWithId } from './FilterProvider.types'

export const FilterContext = createContext<FilterContextValue>({ filters: [], setFilters: () => {} })

export const FilterProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [filters, setFilters] = useState<FilterInputWithId[]>([])

  return <FilterContext.Provider value={{ filters, setFilters }}>{children}</FilterContext.Provider>
}
