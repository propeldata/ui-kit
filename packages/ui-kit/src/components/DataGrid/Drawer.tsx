import classNames from 'classnames'
import React, { ComponentPropsWithoutRef, forwardRef, TextareaHTMLAttributes, useEffect, useRef } from 'react'
import { useCombinedRefs } from '../../helpers'

import componentStyles from './Drawer.module.scss'
import { DrawerProps } from './Drawer.types'
import { CloseIcon, CopyIcon } from './icons'
import { getDisplayValue } from './utils'

// TODO: abstract Drawer to a generic component?
export function Drawer(props: DrawerProps) {
  const { isOpen, row, cell, onClose } = props

  const drawerRef = useRef<HTMLDivElement>(null)

  const displayRow = cell ? { id: cell.id, cells: [cell] } : row

  return (
    <div ref={drawerRef} className={classNames(componentStyles.container, !isOpen && componentStyles.hidden)}>
      <header className={classNames(componentStyles.header)}>
        <button type="button" className={componentStyles.closeButton} onClick={onClose}>
          <CloseIcon />
        </button>
      </header>
      <main className={componentStyles.main}>
        {displayRow?.cells.map((cell, idx) => (
          <>
            <div key={`${cell.header}-${cell.value}-${idx}`} className={componentStyles.valueContainer}>
              <div>
                <span className={componentStyles.label}>{cell.header}</span>
                <button
                  className={componentStyles.closeButton}
                  onClick={() => navigator.clipboard.writeText(cell.value)}
                >
                  <CopyIcon />
                </button>
              </div>
              {/* <SizedTextArea className={componentStyles.value} readOnly>{getDisplayValue(cell.value)}</SizedTextArea> */}
              <code className={componentStyles.value}>{getDisplayValue(cell.value)}</code>
            </div>
            {row && idx < row.cells.length - 1 && <div className={componentStyles.divider}></div>}
          </>
        ))}
      </main>
    </div>
  )
}

/**
 * Textarea that automatically adjusts its height to fit its content.
 */
// const SizedTextArea = forwardRef<HTMLTextAreaElement, ComponentPropsWithoutRef<'textarea'>>(function TextArea({ children, ...rest }, ref) {
//   const innerRef = useRef<HTMLTextAreaElement>(null)

//   const componentRef = useCombinedRefs(ref, innerRef)

//   useEffect(() => {
//     if (componentRef.current) {
//       componentRef.current.style.height = `${componentRef.current.scrollHeight}px`
//     }
//   }, [componentRef])

//   return <textarea ref={componentRef} {...rest}>{children}</textarea>
// })
