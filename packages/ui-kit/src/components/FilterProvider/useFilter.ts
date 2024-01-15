import { useContext } from 'react'
import { FilterContext } from './FilterProvider'

export const useFilter = () => {
  return useContext(FilterContext)
}
