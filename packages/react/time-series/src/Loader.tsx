import React from 'react'
import { css } from '@emotion/css'

import { Styles } from './types'
import { defaultChartHeight } from './defaults'

interface LoaderProps {
  styles?: Styles
}

export function Loader(props: LoaderProps) {
  const { styles } = props

  const width = styles?.canvas?.width
  const height = styles?.canvas?.height || defaultChartHeight

  return (
    <div
      className={css`
        width: ${width ? width + 'px' : '100%'};
        height: ${height}px;
        display: inline-block;
        position: relative;
        overflow: hidden;
        background-color: #e9e9e9;

        &::after {
          position: absolute;
          top: 0;
          right: 0;
          bottom: 0;
          left: 0;
          transform: translateX(-100%);
          background-image: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0) 0,
            rgba(255, 255, 255, 0.2) 20%,
            rgba(255, 255, 255, 0.5) 60%,
            rgba(255, 255, 255, 0)
          );
          animation: shimmer 1.5s infinite;
          content: '';
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}
    />
  )
}
