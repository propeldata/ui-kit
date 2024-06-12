import classNames from 'classnames'
import React, { forwardRef, Fragment, useRef } from 'react'
import { CloseIcon, ArrowDownIcon, CopyIcon } from '../../Icons'
import { Typography } from '../../Typography'

import componentStyles from './Drawer.module.scss'
import { DrawerProps } from './Drawer.types'
import { getDisplayValue } from '../utils'
import { useCombinedRefsCallback } from 'src/helpers'

// TODO: abstract Drawer to a generic component?
export const Drawer = forwardRef<HTMLDivElement, DrawerProps>(function Drawer(
  { isOpen, row, cell, onClose, onCsvDownload, className, ...rest },
  forwardedRef
) {
  const innerRef = useRef<HTMLDivElement>(null)
  const { setRef } = useCombinedRefsCallback({ forwardedRef, innerRef })

  const displayRow = cell ? { id: cell.id, cells: [cell] } : row

  return (
    <div
      {...rest}
      ref={setRef}
      className={classNames(componentStyles.container, !isOpen && componentStyles.hidden, className)}
    >
      <header className={classNames(componentStyles.header)}>
        <button type="button" className={componentStyles.downloadButton} onClick={onCsvDownload}>
          <ArrowDownIcon />
        </button>
        <button type="button" className={componentStyles.closeButton} onClick={onClose}>
          <CloseIcon />
        </button>
      </header>
      <main className={componentStyles.main}>
        {displayRow?.cells.map((cell, idx) => (
          <Fragment key={`${cell.header}-${cell.value}-${idx}`}>
            <div className={componentStyles.valueContainer}>
              <div>
                <Typography variant="textSmRegular">{cell.header}</Typography>
                <button
                  className={componentStyles.closeButton}
                  onClick={() => navigator.clipboard.writeText(cell.value)}
                >
                  <CopyIcon />
                </button>
              </div>
              <code className={componentStyles.value}>{getDisplayValue(cell.value)}</code>
            </div>
            {row && idx < row.cells.length - 1 && <div className={componentStyles.divider}></div>}
          </Fragment>
        ))}
      </main>
    </div>
  )
})
