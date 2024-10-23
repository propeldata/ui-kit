import React from 'react'
import classNames from 'classnames'
import { Button } from '../Button'
import { Loader as SkeletonLoader } from '../Loader'
import componentStyles from './DataGrid.module.scss'
import { getLinesStyle } from './utils'
import { DataGridProps } from './DataGrid.types'

interface LoaderProps extends Omit<DataGridProps, 'query' | 'headers' | 'rows'> {
  dummyArrayColumns?: number[]
  dummyArrayRows?: number[]
}

export const Loader: React.FC<LoaderProps> = ({
  className,
  dummyArrayColumns = Array(5).fill(0),
  dummyArrayRows = Array(10).fill(0),
  disablePagination = false,
  tableLinesLayout = 'both',
  hideBorder,
  slotProps,
  ...rest
}) => {
  const linesStyle = getLinesStyle(tableLinesLayout)

  return (
    <div {...rest} className={classNames(className, componentStyles.wrapper)}>
      <div className={componentStyles.container}>
        <div className={componentStyles.tableContainer}>
          <div className={componentStyles.table} style={{ width: '100%' }}>
            <div className={componentStyles.tableHead}>
              <div className={componentStyles.tableRowHead}>
                <div
                  className={classNames(componentStyles.tableCellHead, componentStyles.tableIndexHeader, linesStyle, {
                    [componentStyles.hideBorder]: hideBorder
                  })}
                ></div>
                {dummyArrayColumns.map((_, index) => (
                  <div
                    key={index}
                    className={classNames(componentStyles.tableCellHead, linesStyle, {
                      [componentStyles.hideBorder]: hideBorder
                    })}
                    {...slotProps?.cell}
                  >
                    <SkeletonLoader className={componentStyles.skeleton}>
                      #################################
                    </SkeletonLoader>
                  </div>
                ))}
              </div>
            </div>
            <div className={componentStyles.tableBody}>
              {dummyArrayRows.map((_, rowIndex) => (
                <div className={componentStyles.tableRow} key={rowIndex}>
                  <div
                    className={classNames(componentStyles.tableCell, componentStyles.tableIndexCell, linesStyle, {
                      [componentStyles.hideBorder]: hideBorder
                    })}
                    {...slotProps?.cell}
                  >
                    <div>{rowIndex + 1}</div>
                  </div>
                  {dummyArrayColumns.map((_, colIndex) => (
                    <div
                      className={classNames(componentStyles.tableCell, linesStyle, {
                        [componentStyles.hideBorder]: hideBorder
                      })}
                      key={colIndex}
                      {...slotProps?.cell}
                    >
                      <SkeletonLoader className={componentStyles.skeleton}>
                        #################################
                      </SkeletonLoader>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {!disablePagination && (
        <div {...slotProps?.footer} className={classNames(componentStyles.footer, slotProps?.footer?.className)}>
          <div className={componentStyles.footerRows}>
            <label htmlFor="data-grid-rows-per-page">Rows per page:</label>
            <div style={{ width: '64px' }}>
              <SkeletonLoader className={componentStyles.selectSkeleton}>Select</SkeletonLoader>
            </div>
          </div>
          <Button
            {...slotProps?.button}
            className={classNames(componentStyles.paginationButton, slotProps?.button?.className)}
            disabled
            type="button"
          >
            &lt;
          </Button>
          <Button
            {...slotProps?.button}
            className={classNames(componentStyles.paginationButton, slotProps?.button?.className)}
            disabled
            type="button"
          >
            &gt;
          </Button>
        </div>
      )}
    </div>
  )
}
