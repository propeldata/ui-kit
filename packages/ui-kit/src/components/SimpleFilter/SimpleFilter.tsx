import React, { SyntheticEvent, useEffect, useRef } from 'react'
import { FilterInput, FilterOperator, getTimeZone } from '../../helpers'

import { Autocomplete } from '../Autocomplete'
import { useFilters } from '../FilterProvider/useFilters'
import { DropdownOption } from '../shared.types'

import { SimpleFilterProps } from './SimpleFilter.types'
import { withContainer } from '../withContainer'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import { useLog } from '../Log'
import { useTopValues } from '../../hooks'

const SimpleFilterComponent = ({
  autocompleteProps,
  columnName: columnNameProp = '',
  query,
  error,
  loading,
  loaderProps,
  options = []
}: SimpleFilterProps) => {
  const id = useRef(Symbol()).current

  const isStatic = !query

  const { filters, setFilters } = useFilters()

  const columnName = query?.columnName ?? columnNameProp
  const timeZone = query?.timeZone ?? getTimeZone()

  const log = useLog()

  const { data, error: queryError, isLoading } = useTopValues({ ...query, timeZone, enabled: !isStatic })

  const isError = queryError != null || error != null

  const handleChange = (_: SyntheticEvent<Element, Event>, selectedOption: DropdownOption | string | null) => {
    if (selectedOption == null) {
      const filterList = filters.filter((filter) => filter.id !== id)
      setFilters(filterList)
      return
    }

    const filter: FilterInput = {
      column: columnName,
      operator: FilterOperator.Equals,
      value: typeof selectedOption === 'string' ? selectedOption : selectedOption?.value ?? selectedOption?.label ?? ''
    }

    const filterList = filters.filter((filter) => filter.id !== id).concat({ ...filter, id })

    setFilters(filterList)
  }

  const autocompleteOptions = (isStatic ? options : data?.topValues.values) ?? []

  useEffect(() => {
    if (queryError != null) {
      log.error('Error fetching Top Values for SimpleFilter:', queryError.message)
    }
  }, [log, queryError])

  if (loading || (!isStatic && isLoading)) {
    return (
      <Loader
        {...loaderProps}
        style={{
          width: autocompleteProps?.containerStyle?.width ?? 'auto',
          height: autocompleteProps?.containerStyle?.height ?? loaderProps?.style?.height ?? '42px'
        }}
      />
    )
  }
  return (
    <Autocomplete
      {...autocompleteProps}
      options={autocompleteOptions}
      onChange={handleChange}
      freeSolo={isError || autocompleteProps?.freeSolo}
    />
  )
}

export const SimpleFilter = withContainer(SimpleFilterComponent, ErrorFallback)
