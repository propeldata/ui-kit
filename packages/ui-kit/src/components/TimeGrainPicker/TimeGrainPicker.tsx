'use client'

import React from 'react'
import { TimeSeriesGranularity } from 'src/graphql'
import { ErrorFallback } from '../ErrorFallback'
import { useFilters } from '../FilterProvider/useFilters'
import { Option, Select } from '../Select'
import { withContainer } from '../withContainer'
import { OrderedTimeSeriesGranularity, TimeGrainPickerProps } from './TimeGrainPicker.types'
import { granularityLabel } from './utils'

const TimeGrainPickerComponent = React.forwardRef<HTMLButtonElement, TimeGrainPickerProps>(
  ({ selectProps, options = OrderedTimeSeriesGranularity }, ref) => {
    const { granularity, setGranularity } = useFilters()

    return (
      <Select
        {...selectProps}
        onChange={(_, optionValue) => {
          if (optionValue != null) {
            setGranularity(optionValue.value as TimeSeriesGranularity)
          }
        }}
        value={
          typeof granularity === 'string' ? { label: granularityLabel[granularity], value: granularity } : granularity
        }
        ref={ref}
      >
        {options.map((option) => (
          <Option key={option} value={{ value: option, label: granularityLabel[option] }}>
            {granularityLabel[option]}
          </Option>
        ))}
      </Select>
    )
  }
)

TimeGrainPickerComponent.displayName = 'TimeGrainPicker'

export const TimeGrainPicker = withContainer(TimeGrainPickerComponent, ErrorFallback)
