import React from 'react'
import { css } from '@emotion/css'
import { Styles } from './types'

interface Props {
  styles?: Styles
}

const getContainer = ({ fontSize }: { fontSize?: string }) => css`
  @keyframes loading {
    0% {
      background-color: #eeeeee;
    }
    100% {
      background-color: #f0f3f5;
    }
  }

  width: 100%;
  height: 100%;
  font-size: ${fontSize || 'inherit'};

  color: transparent;
  user-select: none;

  animation: loading 1s linear infinite alternate;
`

export function Loader(props: Props) {
  const { styles } = props

  return <span className={getContainer({ fontSize: styles?.font?.size })}>000</span>
}
