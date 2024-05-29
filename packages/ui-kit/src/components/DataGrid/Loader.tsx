import React from 'react'
import classNames from 'classnames'

import componentStyles from './DataGrid.module.scss'
import { Button } from '../Button'
import { Loader as SkeletonLoader } from '../Loader'

interface LoaderProps {
  disablePagination?: boolean
}

const LoaderComponent = ({ disablePagination = false }: LoaderProps) => {
  const dummyArrayRows = [...new Array(25)]
  const dummyArrayColumns = [...new Array(5)]

  return (
    <div className={componentStyles.wrapper}>
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
                    style={{ maxWidth: '32px' }}
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

export const Loader = React.memo(LoaderComponent)
