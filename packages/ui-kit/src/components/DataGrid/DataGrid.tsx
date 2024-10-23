'use client'

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
import { ErrorFallback, ErrorFallbackProps } from '../ErrorFallback'
import { useCombinedRefsCallback, useEmptyableData, withThemeWrapper } from '../../helpers'
import { DataGridConnection } from '../../graphql'
import { useSetupTheme } from '../ThemeProvider'
import { useDataGrid } from '../../hooks'

import { DataGridData, DataGridProps } from './DataGrid.types'
import componentStyles from './DataGrid.module.scss'
import classNames from 'classnames'
import { Drawer } from './Drawer'
import type { CellElement, RowElement } from './Drawer'
import { PaginationProps } from '../shared.types'
import { Button } from '../Button'
import { Select } from '../Select'
import { Option } from '../Select/Option'
import { Loader } from './Loader'
import { DEFAULT_PAGE_SIZE_OPTIONS, MINIMUM_TABLE_HEIGHT } from './consts'
import { getLinesStyle } from './utils'
import { handleArbitraryColor, useParsedComponentProps } from '../../themes'
import { prettifyName } from '../shared.utils'

const tanstackColumnHelper = createColumnHelper<DataGridConnection['headers']>()

export const DataGridComponent = React.forwardRef<HTMLDivElement, DataGridProps>(
  (
    {
      query,
      renderLoader,
      error,
      errorFallback,
      renderEmpty,
      headers: headersProp,
      rows: rowsProp,
      resizable: isResizable = false,
      slotProps: slotPropsProp,
      loading,
      loaderProps,
      errorFallbackProps: errorFallbackPropsInitial,
      disablePagination = false,
      tableLinesLayout = 'both',
      paginationProps: paginationPropsProp,
      borderColor,
      className,
      gridLineColor,
      prettifyHeaders = false,
      // unused to avoid passing in rest
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      card,
      hideBorder,
      accentColor,
      ...rest
    },
    forwardedRef
  ) => {
    const innerRef = React.useRef<HTMLDivElement>(null)
    const { componentContainer, setRef } = useCombinedRefsCallback({ innerRef, forwardedRef })
    const themeWrapper = withThemeWrapper(setRef)

    const { themeSettings, parsedProps } = useParsedComponentProps({
      ...rest,
      accentColor
    })

    const {
      theme,
      renderLoader: renderLoaderComponent,
      errorFallback: errorFallbackComponent,
      renderEmpty: renderEmptyComponent
    } = useSetupTheme({
      componentContainer,
      renderLoader,
      errorFallback,
      renderEmpty,
      ...themeSettings
    })

    const tokenStyles = {
      '--propel-datagrid-border-color':
        borderColor != null ? handleArbitraryColor(borderColor) : 'var(--propel-gray-4)',
      '--propel-datagrid-grid-line-color':
        gridLineColor != null ? handleArbitraryColor(gridLineColor) : 'var(--propel-gray-3)'
    }

    const paginationProps = paginationPropsProp ?? {}
    const { defaultPageSize: defaultPageSizeProp, pageSizeOptions: pageSizeOptionsProp } = paginationProps

    const pageSizeOptions = pageSizeOptionsProp ?? DEFAULT_PAGE_SIZE_OPTIONS

    const slotProps = useRef(slotPropsProp).current

    const [pageSize, setPageSize] = useState(defaultPageSizeProp ?? query?.first ?? 10)

    const [isOpenDrawer, setIsOpenDrawer] = useState(false)
    const [selectedRow, setSelectedRow] = useState<RowElement | null>(null)
    const [selectedCell, setSelectedCell] = useState<CellElement | null>(null)

    const [pagination, setPagination] = useState<PaginationProps>({ first: pageSize })

    const isStatic = !query

    const withPagination = disablePagination ? {} : pagination

    const {
      data: dataGridData,
      isLoading: isLoadingDataGridData,
      error: queryError
    } = useDataGrid({ ...query, ...withPagination, enabled: !isStatic })

    const isLoading = isStatic ? loading : isLoadingDataGridData

    const { isEmptyState, setData } = useEmptyableData<DataGridData>({
      isDataEmpty: (data) => !data?.headers || !data?.rows || data?.rows.length === 0 || data?.headers?.length === 0
    })

    const pageSizeOptionValues = React.useMemo(
      () => pageSizeOptions.map((size) => ({ value: size, label: String(size) })),
      [pageSizeOptions]
    )

    useEffect(() => {
      if (dataGridData) {
        const headers = dataGridData.dataGrid.headers
        const rows = dataGridData.dataGrid.rows

        setData({ headers, rows })
      }
    }, [dataGridData, prettifyHeaders, setData])

    const headers = useMemo(() => {
      let headers: string[] | undefined

      if (isStatic) {
        headers = headersProp
      } else {
        headers = dataGridData?.dataGrid.headers
      }

      if (prettifyHeaders === true) {
        return headers?.map((header) => prettifyName(header))
      }

      return headers
    }, [dataGridData, isStatic, headersProp, prettifyHeaders])
    const rows = useMemo(() => (isStatic ? rowsProp : dataGridData?.dataGrid.rows), [dataGridData, isStatic, rowsProp])

    const pageInfo = dataGridData?.dataGrid.pageInfo

    const hasNextPage = pageInfo?.hasNextPage ?? false
    const hasPreviousPage = pageInfo?.hasPreviousPage ?? false

    const handlePaginateNext = () => {
      if (isStatic) {
        table.nextPage()
        return
      }

      if (pageInfo != null) {
        setPagination({ first: pageSize, after: pageInfo.endCursor ?? '' })
      }
    }

    const handlePaginateBack = () => {
      if (isStatic) {
        table.previousPage()
        return
      }

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

    const reactTablePagination =
      isStatic && !disablePagination
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
      defaultColumn: {
        size: 200,
        minSize: 10,
        maxSize: 500
      },
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

      csvRows.push(headers?.join(',') + '\n' ?? '')
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

    if (isLoading) {
      if (renderLoaderComponent) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore - renderLoaderComponent doesn't accept something different to the skeleton loader, we need to fix this
        return themeWrapper(renderLoaderComponent({ loaderProps, Loader, theme }))
      }

      return (
        <Loader
          disablePagination={disablePagination}
          tableLinesLayout={tableLinesLayout}
          hideBorder={hideBorder}
          slotProps={slotProps}
          {...rest}
          style={{ ...rest.style, ...tokenStyles }}
        />
      )
    }

    if (queryError != null) {
      const errorFallbackProps: ErrorFallbackProps = {
        error,
        ...errorFallbackPropsInitial
      }
      if (errorFallbackComponent) {
        return themeWrapper(errorFallbackComponent({ errorFallbackProps, ErrorFallback, theme }))
      }

      return <ErrorFallback {...errorFallbackProps} />
    }

    if (isEmptyState && renderEmptyComponent) {
      return themeWrapper(renderEmptyComponent({ theme }))
    }

    const linesStyle = getLinesStyle(tableLinesLayout)

    return (
      <div
        ref={setRef}
        {...parsedProps}
        className={classNames(componentStyles.wrapper, className)}
        style={{ ...rest.style, ...tokenStyles }}
      >
        <div className={componentStyles.container}>
          <div className={componentStyles.tableContainer}>
            <div
              ref={tableRef}
              className={componentStyles.table}
              style={{ width: isResizable ? table.getCenterTotalSize() : '100%' }}
              {...slotProps?.table}
            >
              <div
                className={classNames(componentStyles.tableHead)}
                style={{
                  width: table.getCenterTotalSize()
                }}
              >
                {table.getHeaderGroups().map((headerGroup) => (
                  <div className={classNames(componentStyles.tableRowHead)} key={headerGroup.id}>
                    <div
                      role="cell"
                      {...slotProps?.cell}
                      {...slotProps?.header}
                      className={classNames(
                        componentStyles.tableCellHead,
                        componentStyles.tableIndexHeader,
                        linesStyle,
                        slotProps?.cell?.className,
                        slotProps?.header?.className,
                        {
                          [componentStyles.hideBorder]: hideBorder
                        }
                      )}
                    ></div>
                    {headerGroup.headers.map((header) => (
                      <div
                        role="cell"
                        {...slotProps?.cell}
                        {...slotProps?.header}
                        className={classNames(
                          componentStyles.tableCellHead,
                          linesStyle,
                          slotProps?.cell?.className,
                          slotProps?.header?.className,
                          {
                            [componentStyles.hideBorder]: hideBorder
                          }
                        )}
                        style={{
                          ...slotProps?.cell?.style,
                          ...slotProps?.header?.style,
                          width: header.getSize()
                        }}
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
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div className={componentStyles.tableBody}>
                {table.getRowModel().rows.map((row, index) => (
                  <div className={componentStyles.tableRow} key={row.id}>
                    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events */}
                    <div
                      {...slotProps?.cell}
                      role="cell"
                      onClick={() => handleRowIndexClick(row)}
                      className={classNames(
                        componentStyles.tableCell,
                        componentStyles.tableIndexCell,
                        {
                          [componentStyles.selectedRow]: row.id === selectedRow?.id
                        },
                        linesStyle,
                        {
                          [componentStyles.hideBorder]: hideBorder
                        },
                        slotProps?.cell?.className
                      )}
                    >
                      <div>{index + 1}</div>
                    </div>
                    {row.getVisibleCells().map((cell, index) => (
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
                      <div
                        {...slotProps?.cell}
                        role="cell"
                        onClick={() => handleRowCellClick(cell)}
                        style={{ ...slotProps?.cell?.style, width: cell.column.getSize() }}
                        className={classNames(
                          componentStyles.tableCell,
                          {
                            [componentStyles.selectedRow]:
                              cell.id === selectedRow?.cells[index].id || cell.id === selectedCell?.id
                          },
                          linesStyle,
                          slotProps?.cell?.className,
                          {
                            [componentStyles.hideBorder]: hideBorder
                          }
                        )}
                        key={cell.id}
                      >
                        <span>{flexRender(cell.column.columnDef.cell, cell.getContext())}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <Drawer
            style={{
              maxHeight:
                tableRef.current?.clientHeight != null && tableRef.current.clientHeight >= MINIMUM_TABLE_HEIGHT
                  ? tableRef.current.clientHeight
                  : '100%'
            }}
            isOpen={isOpenDrawer}
            row={selectedRow}
            cell={selectedCell}
            onClose={handleCloseDrawer}
            onCsvDownload={handleCsvDownload}
          />
        </div>
        {!disablePagination && (
          <div {...slotProps?.footer} className={classNames(componentStyles.footer, slotProps?.footer?.className)}>
            <div className={componentStyles.footerRows}>
              <label htmlFor="data-grid-rows-per-page">Rows per page:</label>
              <Select
                {...slotProps?.select}
                className={classNames(componentStyles.paginationSelect, slotProps?.select?.className)}
                id="data-grid-rows-per-page"
                size="small"
                value={pageSizeOptionValues.find((option) => option.value === pageSize)}
                onChange={(_, newValue) => {
                  if (newValue != null) {
                    const size = Number(newValue?.value)
                    setPageSize(size)
                    if (isStatic) {
                      setClientPagination((prev) => ({ ...prev, pageSize: size }))
                    } else {
                      setPagination((prev) => ({ ...prev, first: size }))
                    }
                  }
                }}
              >
                {pageSizeOptionValues.map((option) => (
                  <Option key={option.value} value={option}>
                    {option.label}
                  </Option>
                ))}
              </Select>
            </div>
            <Button
              {...slotProps?.button}
              className={classNames(componentStyles.paginationButton, slotProps?.button?.className)}
              disabled={isStatic ? !table.getCanPreviousPage() : !hasPreviousPage}
              onClick={handlePaginateBack}
              type="button"
              data-testid="propel-datagrid-paginate-back"
            >
              &lt;
            </Button>
            <Button
              {...slotProps?.button}
              className={classNames(componentStyles.paginationButton, slotProps?.button?.className)}
              disabled={isStatic ? !table.getCanNextPage() : !hasNextPage}
              onClick={handlePaginateNext}
              type="button"
              data-testid="propel-datagrid-paginate-next"
            >
              &gt;
            </Button>
          </div>
        )}
      </div>
    )
  }
)

DataGridComponent.displayName = 'DataGridComponent'

export const DataGrid = withContainer(DataGridComponent, ErrorFallback) as typeof DataGridComponent
