'use client'

import React, { useState } from 'react'
import { TimeSeriesGranularity } from '../../graphql'
import { useFilters } from '../FilterProvider/useFilters'
import { Select } from '../Select'
import { OrderedTimeSeriesGranularity, TimeGrainPickerProps } from './TimeGrainPicker.types'
import { granularityLabel } from './utils'

interface TimeGrainPickerOption {
  label: string
  value: TimeSeriesGranularity
}

export const TimeGrainPicker = React.forwardRef<HTMLButtonElement, TimeGrainPickerProps>(
  ({ selectProps, options = OrderedTimeSeriesGranularity }, ref) => {
    const { granularity, setGranularity } = useFilters()

    const [selectedOption, setSelectedOption] = useState<TimeGrainPickerOption | null>(
      granularity != null ? { label: granularityLabel[granularity], value: granularity } : null
    )

    return (
      <Select<TimeGrainPickerOption>
        {...selectProps}
        ref={ref}
        onChange={(_, optionValue) => {
          if (optionValue != null) {
            setGranularity(optionValue.value)
            setSelectedOption(optionValue)
          }
        }}
        value={selectedOption}
        options={options.map((option) => ({
          label: granularityLabel[option],
          value: { label: granularityLabel[option], value: option }
        }))}
      />
    )
  }
)

TimeGrainPicker.displayName = 'TimeGrainPicker'
