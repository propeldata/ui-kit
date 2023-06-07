import React from 'react'
import { css } from '@emotion/css'

import { defaultChartHeight, serverErrorMessage } from './defaults'
import { Styles } from './types'

export interface ErrorFallbackProps {
  styles?: Styles
  error?: {
    title: string
    body: string
  }
}

export function ErrorFallback(props: ErrorFallbackProps) {
  const { error = serverErrorMessage, styles } = props

  const [isSmall, setIsSmall] = React.useState(false)

  const containerRef = React.useRef<HTMLDivElement>(null)

  const canvasWidth = styles?.canvas?.width
  const canvasHeight = styles?.canvas?.height || defaultChartHeight

  React.useLayoutEffect(() => {
    const containerWidth = containerRef.current?.clientWidth
    const containerHeight = containerRef.current?.clientHeight

    const isContainerSmall = (containerWidth && containerWidth < 150) || (containerHeight && containerHeight < 150)
    const isCanvasSmall = (canvasWidth && canvasWidth < 150) || canvasHeight < 150

    setIsSmall(Boolean(isContainerSmall || isCanvasSmall))
  }, [canvasHeight, canvasWidth])

  return (
    <div ref={containerRef} className={getContainerStyles(canvasHeight, canvasWidth)} role="alert">
      <div className={textWrapperStyles}>
        <Icon color={styles?.font?.color} />
        {!isSmall && (
          <>
            <div aria-live="assertive">
              <p className={textStyles}>{error.title}</p>
            </div>
            <div aria-live="assertive">
              <p>{error.body}</p>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

const Icon = ({ color }: { color?: string }) => (
  <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.0006 14.8109C10.4831 14.8109 10.0984 15.2304 10.0984 15.7483C10.0984 16.2658 10.5183 16.6857 11.0006 16.6857C11.5181 16.6857 11.9029 16.2658 11.9029 15.7483C11.938 15.2288 11.5201 14.8109 11.0006 14.8109ZM11.0006 13.2486C11.346 13.2486 11.5904 12.9691 11.5904 12.6237V6.99937C11.5904 6.65395 11.3109 6.37445 11.0006 6.37445C10.6903 6.37445 10.3757 6.65567 10.3757 6.99937V12.6237C10.3757 12.9674 10.6569 13.2486 11.0006 13.2486ZM20.6986 16.2677L12.8949 3.0694C12.5004 2.40112 11.7896 2.00117 11.0006 2C10.2117 2 9.50472 2.39917 9.10633 3.06862L1.29871 16.2701C0.906184 16.9329 0.900326 17.7285 1.28224 18.3987C1.67718 19.0877 2.39037 19.4978 3.19301 19.4978H18.8121C19.6132 19.4978 20.3256 19.0865 20.7185 18.3976C21.1009 17.7285 21.0931 16.9317 20.6986 16.2677ZM19.5972 17.7441C19.4644 18.0722 19.1559 18.248 18.777 18.248H3.19301C2.84516 18.248 2.53762 18.0728 2.36967 17.7793C2.2104 17.4998 2.21286 17.1817 2.37577 16.9059L10.1843 3.70526C10.3523 3.42013 10.6569 3.24984 11.0006 3.24984C11.0006 3.24984 11 3.24984 11.0006 3.24984C11.343 3.25045 11.6474 3.4201 11.8154 3.70447L19.623 16.9059C19.7534 17.1817 19.7925 17.4981 19.5972 17.7441Z"
      fill={color || '#475569'}
    />
  </svg>
)

const getContainerStyles = (height: number, width?: number) => css`
  width: ${width ? width + 'px' : '100%'};
  height: ${height}px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const textWrapperStyles = css`
  max-width: 263px;
  text-align: center;
  text-align: -webkit-center;
`

const textStyles = css`
  font-weight: 500;
`
