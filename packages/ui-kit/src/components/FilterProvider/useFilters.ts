import { useContext } from 'react'
import { useLog } from '../Log'
import { FilterContext } from './FilterProvider'

export const useFilters = () => {
  const context = useContext(FilterContext)

  const log = useLog()

  if (context == null) {
    log.warn('useFilters must be used within a FilterProvider')
  }

  return context
}
