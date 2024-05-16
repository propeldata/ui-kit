import React, { useEffect, useMemo, useRef, useState } from 'react'
import {
  useReactTable,
  createColumnHelper,
  getCoreRowModel,
  flexRender,
  getSortedRowModel,
  Row,
  Cell,
  getPaginationRowModel
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
import { PaginationProps } from '../shared.types'

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
      headers: headersProp,
      rows: rowsProp,
      resizable: isResizable = false,
      tableProps,
      cellProps,
      defaultPageSize: defaultPageSizeProp
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

    const [pageSize, setPageSize] = useState(defaultPageSizeProp ?? query?.first ?? 10)

    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [selectedRow, setSelectedRow] = useState<RowElement | null>(null)
    const [selectedCell, setSelectedCell] = useState<CellElement | null>(null)

    const [pagination, setPagination] = useState<PaginationProps>({ first: pageSize })

    const isStatic = !query

    const { data: dataGridData } = useDataGrid({ ...query, ...pagination, enabled: !isStatic })

    const headers = useMemo(
      () => (isStatic ? headersProp : dataGridData?.dataGrid.headers),
      [dataGridData, isStatic, headersProp]
    )
    const rows = useMemo(() => (isStatic ? rowsProp : dataGridData?.dataGrid.rows), [dataGridData, isStatic, rowsProp])

    const pageInfo = dataGridData?.dataGrid.pageInfo

    const hasNextPage = pageInfo?.hasNextPage ?? false
    const hasPreviousPage = pageInfo?.hasPreviousPage ?? false

    const handlePaginateNext = () => {
      if (pageInfo != null) {
        setPagination({ first: pageSize, after: pageInfo.endCursor ?? '' })
      }
    }

    const handlePaginateBack = () => {
      if (pageInfo != null) {
        setPagination({ last: pageSize, before: pageInfo.startCursor ?? '' })
      }
    }

    const tanstackTableData = useMemo(() => rows?.map((row) => row.map((cell) => cell ?? '') ?? []) ?? [], [rows])
    const tanstackTableColumns = useMemo(
      () =>
        headers?.map((header, idx) =>
          tanstackColumnHelper.accessor((cell) => cell[idx], {
            id: header,
            header: () => header,
            cell: (info) => info.renderValue()
          })
        ) ?? [],
      [headers]
    )

    const tableRef = useRef<HTMLTableElement>(null)

    const [clientPagination, setClientPagination] = useState({ pageIndex: 0, pageSize })

    const reactTablePagination = isStatic
      ? {
          getPaginationRowModel: getPaginationRowModel(),
          state: { pagination: clientPagination },
          onPaginationChange: setClientPagination
        }
      : {}

    const table = useReactTable({
      data: tanstackTableData,
      columns: tanstackTableColumns,
      getCoreRowModel: getCoreRowModel(),
      getSortedRowModel: getSortedRowModel(),
      columnResizeMode: 'onChange',
      columnResizeDirection: 'ltr',
      enableColumnResizing: true,
      ...reactTablePagination
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

    const handleCsvDownload = () => {
      const csvRows: string[] = []

      const headers = dataGridData?.dataGrid.headers
      csvRows.push(headers?.join(',') + '\n' ?? '')

      const rows = dataGridData?.dataGrid.rows
      rows?.forEach((row) => {
        csvRows.push(row?.join(',') + '\n' ?? '')
      })

      const blob = new Blob(csvRows, { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.setAttribute('hidden', '')
      a.setAttribute('href', url)
      a.setAttribute('download', `${query?.dataPool?.name ?? query?.dataPool?.id ?? 'data'}.csv`)
      a.click()
    }

    return (
      <div className={componentStyles.wrapper}>
        <div className={componentStyles.container}>
          <div className={componentStyles.tableContainer}>
            <table ref={tableRef} className={componentStyles.table} {...tableProps}>
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
                    <th className={classNames(componentStyles.tableCellHead, componentStyles.tableIndexHeader)}></th>
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
          <Drawer
            style={{ maxHeight: tableRef.current?.clientHeight }}
            isOpen={isOpenDrawer}
            row={selectedRow}
            cell={selectedCell}
            onClose={handleCloseDrawer}
            onCsvDownload={handleCsvDownload}
          />
        </div>
        <div className={componentStyles.footer}>
          {isStatic ? (
            <>
              <label htmlFor="data-grid-rows-per-page">Rows per page:</label>
              <select
                id="data-grid-rows-per-page"
                value={pageSize}
                onChange={(event) => {
                  const size = Number(event.target.value)
                  setPageSize(size)
                  setClientPagination((prev) => ({ ...prev, pageSize: size }))
                }}
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <button disabled={!table.getCanPreviousPage()} onClick={() => table.previousPage()} type="button">
                &lt;
              </button>
              <button disabled={!table.getCanNextPage()} onClick={() => table.nextPage()} type="button">
                &gt;
              </button>
            </>
          ) : (
            <>
              <label htmlFor="data-grid-rows-per-page">Rows per page:</label>
              <select
                id="data-grid-rows-per-page"
                value={pageSize}
                onChange={(event) => {
                  const size = Number(event.target.value)
                  setPageSize(size)
                  setPagination((prev) => ({ ...prev, first: size }))
                }}
              >
                <option value={10}>10</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
              <button disabled={!hasPreviousPage} onClick={handlePaginateBack} type="button">
                &lt;
              </button>
              <button disabled={!hasNextPage} onClick={handlePaginateNext} type="button">
                &gt;
              </button>
            </>
          )}
        </div>
      </div>
    )
  }
)

DataGridComponent.displayName = 'DataGridComponent'

export const DataGrid = withContainer(DataGridComponent, ErrorFallback) as typeof DataGridComponent
