import React from 'react'
import { css } from '@emotion/css'

import { defaultStyles } from './defaults'
import { Styles } from './types'

interface Props {
  value: number
  maxValue: number
  styles?: Styles
}

export function ValueBar(props: Props) {
  const { value, maxValue, styles } = props

  const barWidth = `${Math.max(3, Math.ceil((value * 100) / maxValue))}%`

  return (
    <div
      className={css`
        display: inline-block;
        width: 100%;
        height: 6px;
        margin: 0;

        border-radius: 10px;

        background-color: ${styles?.table?.valueBar?.backgroundColor || defaultStyles.table?.valueBar?.backgroundColor};
      `}
    >
      <div
        className={css`
          background-color: ${styles?.table?.valueBar?.color ||
          styles?.font?.color ||
          defaultStyles.table?.valueBar?.color};
          height: 6px;
          border-radius: ${barWidth === '100%' ? '10px' : '10px 0 0 10px'};
          width: ${barWidth};
        `}
      />
    </div>
  )
}
