'use client'

import React, { SyntheticEvent, useEffect, useRef } from 'react'
import { FilterInput, FilterOperator } from '../../graphql'
import { getTimeZone, useForwardedRefCallback, withThemeWrapper } from '../../helpers'
import { useTopValues } from '../../hooks'
import { Autocomplete } from '../Autocomplete'
import { AutocompleteOption } from '../Autocomplete/Autocomplete.types'
import { ErrorFallback } from '../ErrorFallback'
import { useFilters } from '../FilterProvider/useFilters'
import { Loader, LoaderProps } from '../Loader'
import { useLog } from '../Log'
import { useSetupTheme } from '../ThemeProvider'
import { withContainer } from '../withContainer'
import { SimpleFilterProps } from './SimpleFilter.types'

const SimpleFilterComponent = React.forwardRef<HTMLSpanElement, SimpleFilterProps>(
  (
    {
      autocompleteProps,
      columnName: columnNameProp = '',
      query,
      error,
      loading,
      loaderProps: loaderPropsInitial,
      renderLoader,
      options = []
    },
    forwardedRef
  ) => {
    const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
    const themeWrapper = withThemeWrapper(setRef)
    const { theme, renderLoader: renderLoaderComponent } = useSetupTheme({
      componentContainer,
      renderLoader
    })

    const id = useRef(Symbol()).current
    const isStatic = !query

    const { filters, setFilters } = useFilters()
    const columnName = query?.columnName ?? columnNameProp
    const log = useLog()
    const {
      data,
      error: queryError,
      isLoading
    } = useTopValues({ ...query, timeZone: getTimeZone(query?.timeZone), enabled: !isStatic })

    const isError = queryError != null || error != null

    const handleChange = (_: SyntheticEvent<Element, Event>, selectedOption: AutocompleteOption | string | null) => {
      if (selectedOption == null) {
        const filterList = filters.filter((filter) => filter.id !== id)
        setFilters(filterList)
        return
      }

      const filter: FilterInput = {
        column: columnName,
        operator: FilterOperator.Equals,
        value:
          typeof selectedOption === 'string' ? selectedOption : selectedOption?.value ?? selectedOption?.label ?? ''
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
      const loaderProps: LoaderProps = {
        ...loaderPropsInitial,
        style: {
          width: autocompleteProps?.containerStyle?.width ?? 'auto',
          height: autocompleteProps?.containerStyle?.height ?? loaderPropsInitial?.style?.height ?? '42px'
        }
      }

      if (renderLoaderComponent) {
        return themeWrapper(renderLoaderComponent({ loaderProps, Loader, theme }))
      }

      return <Loader {...loaderProps} />
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
)

SimpleFilterComponent.displayName = 'SimpleFilter'

export const SimpleFilter = withContainer(SimpleFilterComponent, ErrorFallback)
