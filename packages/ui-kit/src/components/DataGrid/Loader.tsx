import classNames from 'classnames'
import React from 'react'
import { useForwardedRefCallback } from '../../helpers'
import { Button } from '../Button'
import { Loader as SkeletonLoader } from '../Loader'
import { DefaultThemes } from '../ThemeProvider'
import componentStyles from './DataGrid.module.scss'

interface LoaderProps extends React.ComponentPropsWithoutRef<'div'> {
  disablePagination?: boolean
  baseTheme?: DefaultThemes
}

export const LoaderComponent = React.forwardRef<HTMLDivElement, LoaderProps>(
  ({ disablePagination = false, className, ...rest }, forwardedRef) => {
    const { setRef } = useForwardedRefCallback(forwardedRef)

    const dummyArrayRows = [...new Array(25)]
    const dummyArrayColumns = [...new Array(5)]

    return (
      <div {...rest} className={classNames(className, componentStyles.wrapper)} ref={setRef}>
        <div className={componentStyles.container}>
          <div className={componentStyles.tableContainer}>
            <table className={componentStyles.table} style={{ width: '100%' }}>
              <thead className={componentStyles.tableHead}>
                <tr className={componentStyles.tableRow}>
                  <th className={classNames(componentStyles.tableCellHead, componentStyles.tableIndexHeader)}></th>
                  {dummyArrayColumns.map((_, index) => (
                    <th key={index} className={componentStyles.tableCellHead}>
                      <SkeletonLoader className={componentStyles.skeleton}>loading...</SkeletonLoader>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className={componentStyles.tableBody}>
                {dummyArrayRows.map((_, index) => (
                  <tr className={componentStyles.tableRow} key={index}>
                    <td
                      style={{ maxWidth: 'var(--propel-space-4)' }}
                      className={classNames(componentStyles.tableCell, componentStyles.tableIndexCell)}
                    >
                      <div>{index + 1}</div>
                    </td>
                    {dummyArrayColumns.map((_, index) => (
                      <td className={componentStyles.tableCell} key={index}>
                        <SkeletonLoader className={componentStyles.skeleton}>loading...</SkeletonLoader>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {!disablePagination && (
          <div className={componentStyles.footer}>
            <div className={componentStyles.footerRows}>
              <label htmlFor="data-grid-rows-per-page">Rows per page:</label>
              <div style={{ width: '64px' }}>
                <SkeletonLoader className={componentStyles.selectSkeleton}>Select</SkeletonLoader>
              </div>
            </div>
            <Button className={componentStyles.paginationButton} disabled type="button">
              &lt;
            </Button>
            <Button className={componentStyles.paginationButton} disabled type="button">
              &gt;
            </Button>
          </div>
        )}
      </div>
    )
  }
)

LoaderComponent.displayName = 'Loader'

export const Loader = React.memo(LoaderComponent)
