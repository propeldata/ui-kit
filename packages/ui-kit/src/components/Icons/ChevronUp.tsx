import React from 'react'
import { IconProps } from './Icons.types'

export const ChevronUpIcon = ({ width, height, size = 20, ...rest }: IconProps) => (
  <svg
    width={width ?? size}
    height={height ?? size}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...rest}
  >
    <path
      d="M5 12.5L10 7.5L15 12.5"
      stroke="currentColor"
      strokeWidth="1.66667"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)
