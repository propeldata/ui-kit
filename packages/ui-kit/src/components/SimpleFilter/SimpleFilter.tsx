import React, { SyntheticEvent, useRef } from 'react'
import { useTopValues } from '../../hooks'
import { FilterInput, FilterOperator, getTimeZone } from '../../helpers'

import { Autocomplete } from '../Autocomplete'
import { AutocompleteOption } from '../Autocomplete/Autocomplete.types'
import { useFilter } from '../FilterProvider/useFilter'

import { SimpleFilterProps } from './SimpleFilter.types'
import { withContainer } from '../withContainer'
import { ErrorFallback } from '../ErrorFallback'
import { Loader } from '../Loader'
import componentStyles from './SimpleFilter.module.scss'

const SimpleFilterComponent = ({
  autocompleteProps,
  columnName: columnNameProp = '',
  query,
  errorFallbackProps,
  error,
  loading,
  loaderProps,
  options = []
}: SimpleFilterProps) => {
  const id = useRef(Symbol()).current

  const isStatic = !query

  const { filters, setFilters } = useFilter()

  const columnName = query?.columnName ?? columnNameProp
  const zone = query?.timeZone ?? getTimeZone()

  const { data, error: hasError, isLoading } = useTopValues({ ...query, timeZone: zone })

  const handleChange = (_: SyntheticEvent<Element, Event>, value: AutocompleteOption | null) => {
    if (value == null) return

    const newFilter: FilterInput = {
      column: columnName,
      operator: FilterOperator.Equals,
      value: value.label
    }

    const newFilterList = filters.filter((filter) => filter.id !== id).concat({ ...newFilter, id })

    setFilters([...newFilterList])
  }

  const autocompleteOptions = isStatic
    ? options?.map((label) => ({ label })) ?? []
    : data?.topValues.values.map((label) => ({ label })) ?? []

  if (error != null || hasError != null) {
    return <ErrorFallback error={null} {...errorFallbackProps} style={{ height: '34.2px' }} />
  }

  if (loading || (!isStatic && isLoading)) {
    return (
      <Loader {...loaderProps} className={componentStyles.loader} style={{ ...autocompleteProps?.containerStyle }} />
    )
  }

  return <Autocomplete {...autocompleteProps} options={autocompleteOptions} onChange={handleChange} />
}

export const SimpleFilter = withContainer(SimpleFilterComponent, ErrorFallback)
