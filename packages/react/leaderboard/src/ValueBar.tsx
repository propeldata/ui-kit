import React from 'react'
import { css } from '@emotion/css'

interface Props {
  value: number
  maxValue: number
  color?: string
  backgroundColor?: string
}

export function ValueBar(props: Props) {
  const { value, maxValue, color, backgroundColor } = props

  const barWidth = `${Math.max(3, Math.ceil((value * 100) / maxValue))}%`

  return (
    <div
      className={css`
        display: inline-block;
        width: 100%;
        height: 6px;
        margin: 0;

        border-radius: 10px;

        background-color: ${backgroundColor};
      `}
    >
      <div
        className={css`
          background-color: ${color};
          height: 6px;
          border-radius: ${barWidth === '100%' ? '10px' : '10px 0 0 10px'};
          width: ${barWidth};
        `}
      />
    </div>
  )
}
