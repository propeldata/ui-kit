import React from 'react'
import { css } from '@emotion/css'
import { ChartStyles, defaultChartHeight } from '../../themes'

interface LoaderProps {
  styles?: ChartStyles
  children?: React.ReactNode
}

export function Loader({ styles, children }: LoaderProps) {
  const width = styles?.canvas?.width || '100%'
  // If there are children, the height should be auto
  const defaultHeight = children ? 'auto' : defaultChartHeight
  const height = styles?.canvas?.height || defaultHeight
  const fontSize = styles?.font?.size || 'inherit'

  return (
    <div role="alert" aria-live="polite">
      <p hidden>Loading...</p>
      <div
        className={css`
          /* @TODO: to refactor */
          width: ${typeof width === 'number' ? `${width}px` : `${width}`};
          /* @TODO: to refactor */
          height: ${typeof height === 'number' ? `${height}px` : `${height}`};
          font-size: ${fontSize};
          display: inline-block;
          position: relative;
          overflow: hidden;
          background-color: #e9e9e9;
          margin: 0;
          vertical-align: top;
          color: transparent;
          user-select: none;

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
      >
        {children}
      </div>
    </div>
  )
}
