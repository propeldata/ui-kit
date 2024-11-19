import React from 'react'
import classNames from 'classnames'
import { Button } from '../Button'
import { Loader as SkeletonLoader } from '../Loader'
import componentStyles from './DataGrid.module.scss'
import { getLinesStyle } from './utils'
import { DataGridProps } from './DataGrid.types'

interface LoaderProps extends Omit<DataGridProps, 'query' | 'headers' | 'rows'> {
  pageIndex: number
  pageSize: number
}

export const Loader: React.FC<LoaderProps> = ({
  className,
  disablePagination = false,
  tableLinesLayout = 'both',
  hideBorder,
  pageIndex,
  pageSize,
  slotProps,
  showRowCount = false,
  ...rest
}) => {
  const linesStyle = getLinesStyle(tableLinesLayout)

  const dummyArrayColumns = Array(8).fill(0)
  const dummyArrayRows = Array(Math.min(24, pageSize)).fill(0)

  return (
    <div
      {...rest}
      className={classNames(className, componentStyles.wrapper, { [componentStyles.hideBorder]: hideBorder })}
    >
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
                    <div>{rowIndex + 1 + pageIndex * pageSize ?? 0}</div>
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
          <span>
            {showRowCount === true && (
              <SkeletonLoader className={componentStyles.selectSkeleton}>###### rows</SkeletonLoader>
            )}
          </span>
          <div className={componentStyles.footerRows}>
            <label htmlFor="data-grid-rows-per-page">Rows per page:</label>
            <div style={{ width: '64px' }}>
              <SkeletonLoader className={componentStyles.selectSkeleton}>Select</SkeletonLoader>
            </div>
            <div className={componentStyles.paginationButtons}>
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
          </div>
        </div>
      )}
    </div>
  )
}
