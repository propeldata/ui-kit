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
import { Tooltip } from '@radix-ui/themes'
import '@radix-ui/themes/styles.css'

import { withContainer } from '../withContainer'
import { ErrorFallback, ErrorFallbackProps } from '../ErrorFallback'
import { useCombinedRefsCallback, useEmptyableData, withThemeWrapper } from '../../helpers'
import { DataGridConnection } from '../../graphql'
import { useSetupTheme } from '../ThemeProvider'
import { useCounter, useDataGrid } from '../../hooks'
import { ArrowDownIcon, ChevronLeftIcon, ChevronRightIcon } from '../Icons'

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
import { TriangleIcon } from '../Icons/Triangle'

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
      loading = false,
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
      showRowCount = false,
      ...rest
    },
    forwardedRef
  ) => {
    const [pageIndex, setPageIndex] = useState(0)

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
    const [isTableOverflowingY, setIsTableOverflowingY] = useState(false)

    const [pagination, setPagination] = useState<PaginationProps>({ first: pageSize })

    const isStatic = !query

    const withPagination = disablePagination ? {} : pagination

    const {
      data: dataGridData,
      isLoading: isLoadingDataGridData,
      error: queryError
    } = useDataGrid({ ...query, columns: query?.columns ?? ['*'], ...withPagination, enabled: !isStatic })

    const isLoading = isStatic ? loading : isLoadingDataGridData

    const withDataPoolName = query?.dataPool?.name != null ? { name: query.dataPool.name } : {}
    const withDataPoolId = query?.dataPool?.id != null ? { id: query.dataPool.id } : {}

    const { data: rowCountData } = useCounter({
      ...query,
      metric: {
        // @ts-expect-error - could not narrow down the type, ensured at least one is defined in enabled prop
        count: {
          dataPool: {
            ...withDataPoolName,
            ...withDataPoolId
          }
        }
      },
      enabled: !isStatic && (query.dataPool?.name != null || query.dataPool?.id != null) && showRowCount === true
    })

    const rowCount = isStatic ? rowsProp?.length : rowCountData?.counter?.value

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
      setPageIndex(pageIndex + 1)

      if (isStatic) {
        table.nextPage()
        return
      }

      if (pageInfo != null) {
        setPagination({ first: pageSize, after: pageInfo.endCursor ?? '' })
      }
    }

    const handlePaginateBack = () => {
      setPageIndex(pageIndex - 1)

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
    const containerRef = useRef<HTMLDivElement>(null)

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
        size: 500
      },
      ...reactTablePagination
    })

    useEffect(() => {
      function setDefaultSizing() {
        const INDEX_COLUMN_WIDTH = 40
        const MIN_COLUMN_WIDTH = 200

        const tableCopy = containerRef.current

        const tableChildren = []

        if (tableCopy) {
          while (tableCopy.firstChild) {
            tableChildren.push(tableCopy.firstChild)
            tableCopy.removeChild(tableCopy.firstChild)
          }
        }

        const clientWidth = tableCopy?.clientWidth

        if (tableCopy && tableChildren.length > 0) {
          tableChildren.forEach((child) => {
            tableCopy.appendChild(child)
          })
        }

        const defaultColumnWidth = Math.max(
          ((clientWidth ?? 0) - INDEX_COLUMN_WIDTH) / tanstackTableColumns.length,
          MIN_COLUMN_WIDTH
        )

        if (defaultColumnWidth && defaultColumnWidth !== Infinity && defaultColumnWidth > 0) {
          table.setColumnSizing(() => {
            const obj: Record<string, number> = {}
            table.getAllColumns().forEach((col) => {
              obj[col.id] = defaultColumnWidth
            })
            return obj
          })
        }

        const containerWidth = containerRef.current?.clientWidth
        const columnWidth = Math.max(
          ((containerWidth ?? 0) - INDEX_COLUMN_WIDTH) / tanstackTableColumns.length,
          MIN_COLUMN_WIDTH
        )

        const containerHeight = containerRef.current?.clientHeight
        const containerScrollHeight = containerRef.current?.scrollHeight

        setIsTableOverflowingY(
          containerHeight != null && containerScrollHeight != null && containerHeight < containerScrollHeight
        )

        if (columnWidth && columnWidth !== Infinity && columnWidth > 0) {
          table.setColumnSizing(() => {
            const obj: Record<string, number> = {}
            table.getAllColumns().forEach((col) => {
              obj[col.id] = columnWidth
            })
            return obj
          })
        }
      }

      setDefaultSizing()

      window.addEventListener('resize', () => {
        setDefaultSizing()
      })

      return () => {
        window.removeEventListener('resize', () => {})
      }
    }, [table, tanstackTableColumns.length, pageSize, isResizable])

    useEffect(() => {
      function handleKeyPress(event: KeyboardEvent) {
        if (event.key === 'Escape') {
          handleCloseDrawer()
        }

        if ((event.ctrlKey || event.metaKey) && event.key === 'c') {
          if (selectedCell != null) {
            navigator.clipboard.writeText(selectedCell.value)
          }
        }
      }

      document.addEventListener('keydown', handleKeyPress)

      return () => {
        document.removeEventListener('keydown', handleKeyPress)
      }
    }, [selectedCell])

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
          pageIndex={pageIndex}
          pageSize={isStatic ? clientPagination.pageSize : pageSize}
          showRowCount={showRowCount}
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

    const headerGroups = table.getHeaderGroups()
    const rowGroup = table.getRowModel().rows

    return (
      <div
        ref={setRef}
        {...parsedProps}
        className={classNames(componentStyles.wrapper, { [componentStyles.hideBorder]: hideBorder }, className)}
        style={{ ...rest.style, ...tokenStyles }}
      >
        <div ref={containerRef} className={componentStyles.container}>
          <div className={componentStyles.tableContainer}>
            <div ref={tableRef} className={componentStyles.table} style={{ width: '100%' }} {...slotProps?.table}>
              <div className={classNames(componentStyles.tableHead)}>
                {headerGroups.map((headerGroup) => (
                  <div
                    role="rowheader"
                    className={classNames(componentStyles.tableRowHead)}
                    style={{ width: isResizable ? 'fit-content' : '100%' }}
                    key={headerGroup.id}
                  >
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
                    {headerGroup.headers.map((header, idx) => (
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
                            [componentStyles.hideBorder]: hideBorder,
                            [componentStyles.numeric]: rowGroup.every(
                              (row) => !isNaN(Number(row.getAllCells()[idx].getValue()))
                            )
                          }
                        )}
                        style={{
                          ...slotProps?.cell?.style,
                          ...slotProps?.header?.style,
                          width: isResizable ? header.getSize() : header.getSize()
                        }}
                        key={header.id}
                      >
                        {header.isPlaceholder ? null : (
                          <>
                            <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                            {query?.orderByColumn != null && query.orderByColumn - 1 === idx && (
                              <div>
                                <TriangleIcon />
                              </div>
                            )}
                          </>
                        )}
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
              <div role="rowgroup" className={componentStyles.tableBody}>
                {rowGroup.map((row, index) => (
                  <div
                    role="row"
                    className={classNames(componentStyles.tableRow, {
                      [componentStyles.preventGap]: isTableOverflowingY
                    })}
                    style={{ width: isResizable ? 'fit-content' : '100%' }}
                    key={row.id}
                  >
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
                      <div>{index + 1 + pageIndex * (isStatic ? clientPagination.pageSize : pageSize)}</div>
                    </div>
                    {row.getVisibleCells().map((cell, index) => (
                      // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/click-events-have-key-events
                      <div
                        {...slotProps?.cell}
                        role="cell"
                        onClick={() => handleRowCellClick(cell)}
                        style={{
                          ...slotProps?.cell?.style,
                          width: isResizable ? cell.column.getSize() : cell.column.getSize()
                        }}
                        className={classNames(
                          componentStyles.tableCell,
                          {
                            [componentStyles.selectedRow]:
                              cell.id === selectedRow?.cells[index].id || cell.id === selectedCell?.id
                          },
                          linesStyle,
                          slotProps?.cell?.className,
                          {
                            [componentStyles.hideBorder]: hideBorder,
                            [componentStyles.numeric]: !isNaN(Number(cell.getValue()))
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
                containerRef.current?.clientHeight != null && containerRef.current.clientHeight >= MINIMUM_TABLE_HEIGHT
                  ? containerRef.current.clientHeight
                  : '100%'
            }}
            isOpen={isOpenDrawer}
            row={selectedRow}
            cell={selectedCell}
            onClose={handleCloseDrawer}
          />
        </div>
        {!disablePagination && (
          <div {...slotProps?.footer} className={classNames(componentStyles.footer, slotProps?.footer?.className)}>
            <span>{rowCount != null && showRowCount === true && `${Number(rowCount).toLocaleString()} rows`}</span>

            <div className={componentStyles.footerRows}>
              <Tooltip content="Download all data as CSV">
                <button type="button" className={componentStyles.downloadButton} onClick={handleCsvDownload}>
                  <ArrowDownIcon />
                </button>
              </Tooltip>
              <div className={componentStyles.paginationSelectWrapper}>
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
                        setClientPagination({ pageIndex: 0, pageSize: size })
                      } else {
                        setPagination({ first: size })
                      }
                      setPageIndex(0)
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
              <div className={componentStyles.paginationButtons}>
                <Button
                  {...slotProps?.button}
                  className={classNames(componentStyles.paginationButton, slotProps?.button?.className)}
                  disabled={isStatic ? !table.getCanPreviousPage() : !hasPreviousPage}
                  onClick={handlePaginateBack}
                  type="button"
                  data-testid="propel-datagrid-paginate-back"
                >
                  <ChevronLeftIcon />
                </Button>
                <Button
                  {...slotProps?.button}
                  className={classNames(componentStyles.paginationButton, slotProps?.button?.className)}
                  disabled={isStatic ? !table.getCanNextPage() : !hasNextPage}
                  onClick={handlePaginateNext}
                  type="button"
                  data-testid="propel-datagrid-paginate-next"
                >
                  <ChevronRightIcon />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
)

DataGridComponent.displayName = 'DataGridComponent'

export const DataGrid = withContainer(DataGridComponent, ErrorFallback) as typeof DataGridComponent
