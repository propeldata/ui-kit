'use client'

import React, { SyntheticEvent } from 'react'
import { TimeSeriesGranularity } from '../../graphql'
import { Autocomplete } from '../Autocomplete'
import { AutocompleteOption } from '../Autocomplete/Autocomplete.types'
import { ErrorFallback } from '../ErrorFallback'
import { useFilters } from '../FilterProvider/useFilters'
import { withContainer } from '../withContainer'
import { TimeGrainPickerProps } from './TimeGrainPicker.types'

const TimeGrainPickerComponent = React.forwardRef<HTMLDivElement, TimeGrainPickerProps>(
  ({ autocompleteProps, options = Object.values(TimeSeriesGranularity) }, ref) => {
    const { granularity, setGranularity } = useFilters()

    const handleChange = (_: SyntheticEvent<Element, Event>, selectedOption: AutocompleteOption | string | null) => {
      if (selectedOption != null) {
        setGranularity(selectedOption as TimeSeriesGranularity)
      }
    }

    return (
      <Autocomplete
        {...autocompleteProps}
        options={options}
        onChange={handleChange}
        value={granularity}
        disableClearable
        freeSolo={false}
        ref={ref}
      />
    )
  }
)

TimeGrainPickerComponent.displayName = 'TimeGrainPicker'

export const TimeGrainPicker = withContainer(TimeGrainPickerComponent, ErrorFallback)
