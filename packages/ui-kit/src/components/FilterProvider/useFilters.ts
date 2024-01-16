import { useContext } from 'react'
import { FilterContext } from './FilterProvider'

export const useFilters = () => {
  return useContext(FilterContext)
}
