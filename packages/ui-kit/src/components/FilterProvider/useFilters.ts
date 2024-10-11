import { useContext } from 'react'
import { FilterContext } from './FilterProvider'

export const useFilters = () => {
  const context = useContext(FilterContext)

  if (context == null) {
    throw new Error('useFilters must be used within a FilterProvider')
  }

  return context
}
