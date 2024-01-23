import React, { useEffect, useRef } from 'react'
import { useTopValues } from '../../hooks'
import { buildOrFilter, getTimeZone } from '../../helpers'
import { useFilters } from '../FilterProvider'
import { useLog } from '../Log'
import { Option, Select } from '../Select'
import { Loader } from '../Loader'

import { withContainer } from '../withContainer'
import { ErrorFallback } from '../ErrorFallback'

import { MultiSelectFilterProps } from './MultiSelectFilter.types'
import componentStyles from './MultiSelectFilter.module.scss'

const MultiSelectFilterBase = ({
  options,
  columnName: columnNameProp,
  selectProps,
  query,
  error,
  loading,
  loaderProps
}: MultiSelectFilterProps) => {
  const id = useRef(Symbol()).current

  const isStatic = !query

  const columnName = query?.columnName ?? columnNameProp
  const timeZone = query?.timeZone ?? getTimeZone()

  const log = useLog()

  const { data, error: queryError, isLoading } = useTopValues({ ...query, timeZone })

  const isError = queryError != null || error != null

  const { filters, setFilters } = useFilters()

  const handleChange = (_: React.SyntheticEvent | null, valueList: string | string[] | null) => {
    if (typeof valueList === 'string') throw new Error('MultiSelectFilter should be used with multiple enabled')
    if (valueList == null) {
      const filterList = filters.filter((filter) => filter.id !== id)
      setFilters(filterList)
      return
    }

    const orFilter = { id, ...buildOrFilter(columnName ?? '', valueList) }

    const filterList = filters.filter((filter) => filter.id !== id).concat(orFilter)

    setFilters(filterList)
  }

  useEffect(() => {
    if (queryError != null) {
      log.error('Error fetching Top Values for MultiSelectFilter:', queryError.message)
    }
  }, [log, queryError])

  const selectOptions = isStatic ? options : data?.topValues.values ?? []

  if (loading || (!isStatic && isLoading)) {
    return <Loader {...loaderProps} className={componentStyles.loader} style={{ ...selectProps?.containerStyle }} />
  }

  return (
    <Select multiple disabled={isError} onChange={handleChange} {...selectProps}>
      {selectOptions?.map((option, idx) => {
        const value = typeof option === 'string' ? option : option.value ?? option.label ?? ''
        const label = typeof option === 'string' ? option : option.label ?? option.value ?? ''

        return (
          <Option key={`${value}-${idx}`} value={value} checkbox>
            {label}
          </Option>
        )
      })}
    </Select>
  )
}

export const MultiSelectFilter = withContainer(MultiSelectFilterBase, ErrorFallback)
