'use client'

import React, { useState } from 'react'
import { useForwardedRefCallback } from '../../helpers'
import { TimeSeriesGranularity } from '../../graphql'
import { useFilters } from '../FilterProvider/useFilters'
import { Option, Select } from '../Select'
import { OrderedTimeSeriesGranularity, TimeGrainPickerProps } from './TimeGrainPicker.types'
import { granularityLabel } from './utils'
import { useParsedComponentProps } from '../../themes'

interface TimeGrainPickerOption {
  label: string
  value: TimeSeriesGranularity
}

export const TimeGrainPicker = React.forwardRef<HTMLDivElement, TimeGrainPickerProps>(
  ({ selectProps, options = OrderedTimeSeriesGranularity, ...rest }, forwardedRef) => {
    const selectOptions = React.useMemo(
      () => options.map((option) => ({ label: granularityLabel[option], value: option })),
      [options]
    )

    const { parsedPropsWithoutRest } = useParsedComponentProps(rest)
    const { setRef } = useForwardedRefCallback(forwardedRef)

    const selectRef = React.useRef<HTMLButtonElement | null>(null)

    const { granularity, setGranularity } = useFilters()

    const [selectedOption, setSelectedOption] = useState<TimeGrainPickerOption | null>(
      selectOptions?.find((option) => option.value === granularity) ?? null
    )

    return (
      <div ref={setRef} {...parsedPropsWithoutRest}>
        <Select
          {...selectProps}
          ref={selectRef}
          onChange={(_, optionValue) => {
            if (optionValue == null) {
              return
            }

            setGranularity(optionValue.value)
            setSelectedOption(selectOptions.find((option) => option.value === optionValue.value) ?? null)
          }}
          value={selectedOption}
        >
          {selectOptions.map((option) => (
            <Option key={option.label} value={option}>
              {option.label}
            </Option>
          ))}
        </Select>
      </div>
    )
  }
)

TimeGrainPicker.displayName = 'TimeGrainPicker'
