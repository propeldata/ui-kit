import type { ScaleOptionsByType } from 'chart.js'

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>
    }
  : T

export type ChartScales = Partial<{ [key: string]: ScaleOptionsByType<'linear' | 'logarithmic'> }>

export type ChartVariant = 'bar' | 'line'

export type TimeSeriesData = {
  values?: number[]
  labels?: string[]
}

export type ChartPaddingOptions =
  | number
  | {
      top?: number
      bottom?: number
      right?: number
      left?: number
    }

export type ChartPlugins = {
  [pluginName: string]: {
    [optionName: string]: string | undefined
  }
}

export type Styles = {
  font?: {
    color?: string
    family?: string
    size?: number | 'inherit'
    style?: 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit'
    weight?: string
    lineHeight?: number | string
  }
  canvas?: {
    width?: number
    height?: number
    hideGridLines?: boolean
    backgroundColor?: string
    padding?: ChartPaddingOptions
    borderRadius?: string
  }
  tooltip?: {
    display?: boolean
    backgroundColor?: string
    borderRadius?: number
    borderColor?: string
    borderWidth?: number
    color?: string
    padding?: number
    alignContent?: 'left' | 'center' | 'right'
    caretSize?: number
  }
  bar?: {
    thickness?: number
    borderWidth?: number
    borderRadius?: number
    borderColor?: string
    hoverBorderColor?: string
    backgroundColor?: string
    hoverBackgroundColor?: string
  }
  line?: {
    tension?: number
    stepped?: boolean
    borderWidth?: number
    borderRadius?: number
    borderColor?: string
    hoverBorderColor?: string
    backgroundColor?: string
    hoverBackgroundColor?: string
  }
  point?: {
    style?: string | boolean
    radius?: number
    borderWidth?: number
    borderColor?: string
    hoverBorderColor?: string
    backgroundColor?: string
    hoverBackgroundColor?: string
  }
  yAxis?: {
    beginAtZero?: boolean
    scale?: 'linear' | 'logarithmic'
  }
}
