'use client'

import React from 'react'
import { Checkbox } from '@radix-ui/themes'

import { Option, OptionValue, Select } from '../Select'

import componentStyles from './GroupBy.module.scss'
import { getGroupByLabel } from './utils'
import { Divider } from '../Divider'
import { Loader } from '../Loader'
import { GroupByProps } from './GroupBy.types'
import { useForwardedRefCallback } from '../../helpers'
import { useDataPoolColumns } from '../../hooks/useDataPoolColumns'

import '@radix-ui/themes/styles.css'
import { useLog } from '../Log'
import { useFilters } from '../FilterProvider'

const UNGROUPED_VALUE = 'Ungrouped'

export const GroupBy = React.forwardRef<HTMLButtonElement, GroupByProps>(
  ({ selectProps, query, columns: columnsProp, loading = false, ...rest }, forwardedRef) => {
    const { groupBy, setGroupBy } = useFilters()

    const log = useLog()

    const { setRef } = useForwardedRefCallback(forwardedRef)

    const isStatic = query?.dataPool == null

    const { columns: data, isLoading, error } = useDataPoolColumns({ ...query, enabled: !isStatic })

    const isLoadingQuery = isStatic ? false : isLoading

    const columns = isStatic ? columnsProp ?? [] : data?.map(({ columnName }) => columnName) ?? []

    const handleOptionClick = (column: string) => {
      const columns = new Set([...groupBy])

      if (column === UNGROUPED_VALUE) {
        setGroupBy([])
        return
      }

      if (columns.has(column)) {
        columns.delete(column)
      } else {
        columns.add(column)
      }

      setGroupBy([...columns])
    }

    const handleChange = (
      _event: React.MouseEvent<Element> | React.KeyboardEvent<Element> | React.FocusEvent<Element, Element> | null,
      optionValue: OptionValue | null
    ) => {
      const column = optionValue?.value as string

      if (column === UNGROUPED_VALUE) {
        setGroupBy([])
        return
      }

      if (column == null) {
        return
      }

      handleOptionClick(column)
    }

    const handleOnlyClick = (column: string) => {
      setGroupBy([column])
    }

    if (error != null) {
      log.warn(error)
    }

    return (
      <Loader isLoading={isLoadingQuery || loading}>
        <Select
          {...selectProps}
          {...rest}
          ref={setRef}
          slotProps={{
            root: {
              value: (<GroupByDisplayValue selectedColumns={groupBy} />) as unknown as string // Button value to be display actually enables jsx
            }
          }}
          style={{ visibility: isLoading ? 'hidden' : 'visible' }}
          onChange={handleChange}
        >
          <GroupByOption
            column={UNGROUPED_VALUE}
            selectedColumns={groupBy}
            onOptionClick={handleOptionClick}
            isUngroupedOption
          />
          <Divider />
          <p className={componentStyles.groupByLabel}>Group By...</p>
          {columns.map((column, idx) => (
            <GroupByOption
              key={`${column}${idx}`}
              column={column}
              selectedColumns={groupBy}
              onOptionClick={handleOptionClick}
              onOnlyClick={handleOnlyClick}
            />
          ))}
        </Select>
      </Loader>
    )
  }
)

GroupBy.displayName = 'GroupBy'

interface GroupByDisplayValueProps {
  selectedColumns: string[]
}

const GroupByDisplayValue = ({ selectedColumns }: GroupByDisplayValueProps) => {
  const label = getGroupByLabel(selectedColumns)

  return (
    <div className={componentStyles.groupByDisplayValue}>
      Group By
      <div className={componentStyles.verticalDivider}>
        <span>.</span>
      </div>
      <span className={componentStyles.displayValueLabel}>{label}</span>
    </div>
  )
}

interface GroupByOptionProps {
  column: string
  selectedColumns: string[]
  onOptionClick: (column: string) => void
  onOnlyClick?: (column: string) => void
  isUngroupedOption?: boolean
}

const GroupByOption = ({
  column,
  selectedColumns,
  onOptionClick,
  onOnlyClick,
  isUngroupedOption = false
}: GroupByOptionProps) => {
  return (
    <Option className={componentStyles.option} value={{ value: column, label: column }}>
      <div>
        <Checkbox
          onClick={(event) => {
            event.stopPropagation()
            onOptionClick(column)
          }}
          checked={
            isUngroupedOption
              ? selectedColumns.length === 0
              : selectedColumns.some((selectedColumn) => selectedColumn === column)
          }
        />
        {column}
      </div>
      {!isUngroupedOption && (
        <button
          type="button"
          className={componentStyles.onlyButton}
          onClick={(event) => {
            event.stopPropagation()
            onOnlyClick?.(column)
          }}
        >
          Only
        </button>
      )}
    </Option>
  )
}