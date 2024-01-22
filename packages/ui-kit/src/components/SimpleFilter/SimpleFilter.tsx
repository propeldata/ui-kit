import React, { SyntheticEvent, useEffect, useRef } from 'react'
import { useTopValues } from '../../hooks'
import { FilterInput, FilterOperator, getTimeZone } from '../../helpers'

import { Autocomplete } from '../Autocomplete'
import { AutocompleteOption } from '../Autocomplete/Autocomplete.types'
import { useFilters } from '../FilterProvider/useFilters'

import { SimpleFilterProps } from './SimpleFilter.types'
import { withContainer } from '../withContainer'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import componentStyles from './SimpleFilter.module.scss'
import { useLog } from '../Log'

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

  const { data, error: queryError, isLoading } = useTopValues({ ...query, timeZone })

  const isError = queryError != null || error != null

  const handleChange = (_: SyntheticEvent<Element, Event>, selectedOption: AutocompleteOption | string | null) => {
    if (selectedOption == null) return

    const filter: FilterInput = {
      column: columnName,
      operator: FilterOperator.Equals,
      value: typeof selectedOption === 'string' ? selectedOption : selectedOption?.value ?? selectedOption?.label ?? ''
    }

    const filterList = filters.filter((filter) => filter.id !== id).concat({ ...filter, id })

    setFilters(filterList)
  }

  const autocompleteOptions = isStatic ? options ?? [] : data?.topValues.values ?? []

  useEffect(() => {
    if (queryError != null) {
      log.error('Error fetching Top Values for SimpleFilter:', queryError.message)
    }
  }, [log, queryError])

  if (loading || (!isStatic && isLoading)) {
    return (
      <Loader {...loaderProps} className={componentStyles.loader} style={{ ...autocompleteProps?.containerStyle }} />
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
