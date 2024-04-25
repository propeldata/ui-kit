import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  Row,
  Cell
} from '@tanstack/react-table'

import { withContainer } from '../withContainer'
import { ErrorFallback } from '../ErrorFallback'
import { DataGridConnection, useCombinedRefsCallback, useEmptyableData, withThemeWrapper } from '../../helpers'
import { useSetupTheme } from '../ThemeProvider'
import { useDataGrid } from '../../hooks'

import { DataGridData, DataGridProps } from './DataGrid.types'
import componentStyles from './DataGrid.module.scss'
import classNames from 'classnames'
import { Drawer } from './Drawer'
import { CellElement, RowElement } from './Drawer.types'

// let idDataGrid = 0

const tanstackColumnHelper = createColumnHelper<DataGridConnection['headers']>()

export const DataGridComponent = React.forwardRef<HTMLDivElement, DataGridProps>(
  (
    {
      baseTheme,
      query,
      renderLoader,
      errorFallback,
      renderEmpty,
      resizable: isResizable = false,
      tableProps,
      cellProps
    },
    forwardedRef
  ) => {
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

    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [selectedRow, setSelectedRow] = useState<RowElement | null>(null)
    const [selectedCell, setSelectedCell] = useState<CellElement | null>(null)

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
      columnResizeDirection: 'ltr',
      enableColumnResizing: true
    })

    useEffect(() => {
      function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Escape') {
          handleCloseDrawer()
        }
      }

      document.addEventListener('keydown', handleKeyPress)

      return () => {
        document.removeEventListener('keydown', handleKeyPress)
      }
    }, [])

    const handleRowIndexClick = (row: Row<string[]>) => {
      setSelectedCell(null)
      setSelectedRow({
        id: row.id,
        cells: row.getVisibleCells().map((cell) => ({
          id: cell.id,
          header: cell.column.id,
          value: cell.getValue() as string
        }))
      })
      setIsOpenDrawer(true)
    }

    const handleRowCellClick = (cell: Cell<string[], unknown>) => {
      setSelectedRow(null)
      setSelectedCell({
        id: cell.id,
        header: cell.column.id,
        value: cell.getValue() as string
      })
      setIsOpenDrawer(true)
    }

    const handleCloseDrawer = () => {
      setIsOpenDrawer(false)
      setSelectedRow(null)
      setSelectedCell(null)
    }

    return (
      <div className={componentStyles.container}>
        <div className={componentStyles.tableContainer}>
          <table className={componentStyles.table} {...tableProps}>
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
                  <th className={classNames(componentStyles.tableCellHead, componentStyles.tableIndexHeader)} />
                  {headerGroup.headers.map((header) => (
                    <th
                      {...{
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
                            onTouchStart: header.getResizeHandler()
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
              {table.getRowModel().rows.map((row, index) => (
                <tr className={componentStyles.tableRow} key={row.id}>
                  <td
                    style={{ maxWidth: '32px' }}
                    onClick={() => handleRowIndexClick(row)}
                    className={classNames(componentStyles.tableCell, componentStyles.tableIndexCell, {
                      [componentStyles.selectedRow]: row.id === selectedRow?.id
                    })}
                    {...cellProps}
                  >
                    <div>{index + 1}</div>
                  </td>
                  {row.getVisibleCells().map((cell, index) => (
                    <td
                      onClick={() => handleRowCellClick(cell)}
                      className={classNames(componentStyles.tableCell, {
                        [componentStyles.selectedRow]:
                          cell.id === selectedRow?.cells[index].id || cell.id === selectedCell?.id
                      })}
                      {...cellProps}
                      key={cell.id}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Drawer isOpen={isOpenDrawer} row={selectedRow} cell={selectedCell} onClose={handleCloseDrawer} />
      </div>
    )
  }
)

DataGridComponent.displayName = 'DataGridComponent'

export const DataGrid = withContainer(DataGridComponent, ErrorFallback) as typeof DataGridComponent
