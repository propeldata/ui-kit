import React, { useMemo } from 'react'
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  getSortedRowModel
} from '@tanstack/react-table'

import { withContainer } from '../withContainer'
import { ErrorFallback } from '../ErrorFallback'
import { DataGridConnection, useCombinedRefsCallback, useEmptyableData, withThemeWrapper } from '../../helpers'
import { useSetupTheme } from '../ThemeProvider'
import { useDataGrid } from '../../hooks'

import { DataGridData, DataGridProps } from './DataGrid.types'
import componentStyles from './DataGrid.module.scss'
import classNames from 'classnames'

// let idDataGrid = 0

const tanstackColumnHelper = createColumnHelper<DataGridConnection['headers']>()

export const DataGridComponent = React.forwardRef<HTMLDivElement, DataGridProps>(
  ({ baseTheme, query, renderLoader, errorFallback, renderEmpty, resizable: isResizable = false }, forwardedRef) => {
    // const innerRef = React.useRef<HTMLDivElement>(null)
    // const { componentContainer, setRef } = useCombinedRefsCallback({ innerRef, forwardedRef })
    // const themeWrapper = withThemeWrapper(setRef)

    // const {
    //   theme,
    //   chartConfig,
    //   renderLoader: renderLoaderComponent,
    //   errorFallback: errorFallbackComponent,
    //   renderEmpty: renderEmptyComponent
    // } = useSetupTheme<'bar'>({
    //   componentContainer,
    //   baseTheme,
    //   renderLoader,
    //   errorFallback,
    //   renderEmpty
    // })

    // const idRef = React.useRef(idDataGrid++)
    // const id = `data-grid-${idRef.current}`

    const isStatic = !query

    const { data: dataGridData } = useDataGrid({ ...query, enabled: !isStatic })

    const tanstackTableData = useMemo(
      () => dataGridData?.dataGrid.rows.map((row) => row.map((cell) => cell ?? '') ?? []) ?? [],
      [dataGridData]
    )
    const tanstackTableColumns = useMemo(
      () =>
        dataGridData?.dataGrid.headers.map((header, idx) =>
          tanstackColumnHelper.accessor((cell) => cell[idx], {
            id: header,
            header: () => header,
            cell: (info) => info.renderValue()
          })
        ) ?? [],
      [dataGridData]
    )

    const table = useReactTable({
      data: tanstackTableData,
      columns: tanstackTableColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      columnResizeMode: 'onChange',
      columnResizeDirection: 'ltr'
    })

    return (
      <div>
        <table className={componentStyles.table}>
          <thead
            className={componentStyles.tableHead}
            {...{
              style: {
                width: isResizable ? table.getCenterTotalSize() : 'initial'
              }
            }}
          >
            {table.getHeaderGroups().map((headerGroup) => (
              <tr className={componentStyles.tableRow} key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    {...{
                      key: header.id,
                      colSpan: header.colSpan,
                      style: {
                        width: isResizable ? header.getSize() : 'initial'
                      }
                    }}
                    className={componentStyles.tableCellHead}
                    key={header.id}
                  >
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    {isResizable && (
                      <div
                        {...{
                          onDoubleClick: () => header.column.resetSize(),
                          onMouseDown: header.getResizeHandler(),
                          onTouchStart: header.getResizeHandler(),
                          className: `resizer ${table.options.columnResizeDirection} ${
                            header.column.getIsResizing() ? 'isResizing' : ''
                          }`
                        }}
                        className={classNames(componentStyles.resizer)}
                      />
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody className={componentStyles.tableBody}>
            {table.getRowModel().rows.map((row) => (
              <tr className={componentStyles.tableRow} key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <td className={componentStyles.tableCell} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }
)

DataGridComponent.displayName = 'DataGridComponent'

export const DataGrid = withContainer(DataGridComponent, ErrorFallback) as typeof DataGridComponent
