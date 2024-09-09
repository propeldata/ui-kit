'use client'

import React, { SyntheticEvent } from 'react'
import { TimeSeriesGranularity } from 'src/graphql'
import { Autocomplete } from '../Autocomplete'
import { AutocompleteOption } from '../Autocomplete/Autocomplete.types'
import { ErrorFallback } from '../ErrorFallback'
import { useFilters } from '../FilterProvider/useFilters'
import { withContainer } from '../withContainer'
import { OrderedTimeSeriesGranularity, TimeGrainPickerProps } from './TimeGrainPicker.types'
import { granularityLabel } from './utils'

const TimeGrainPickerComponent = React.forwardRef<HTMLDivElement, TimeGrainPickerProps>(
  ({ autocompleteProps, options = OrderedTimeSeriesGranularity }, ref) => {
    const { granularity, setGranularity } = useFilters()

    const handleChange = (_: SyntheticEvent<Element, Event>, selectedOption: AutocompleteOption | string | null) => {
      if (selectedOption != null) {
        setGranularity(
          typeof selectedOption === 'string'
            ? (selectedOption as TimeSeriesGranularity)
            : (selectedOption.value as TimeSeriesGranularity)
        )
      }
    }

    return (
      <Autocomplete
        {...autocompleteProps}
        options={options.map((option) => ({ value: option, label: granularityLabel[option] }))}
        onChange={handleChange}
        value={
          typeof granularity === 'string' ? { label: granularityLabel[granularity], value: granularity } : granularity
        }
        disableClearable
        freeSolo={false}
        ref={ref}
      />
    )
  }
)

TimeGrainPickerComponent.displayName = 'TimeGrainPicker'

export const TimeGrainPicker = withContainer(TimeGrainPickerComponent, ErrorFallback)
