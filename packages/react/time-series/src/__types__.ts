import { ChartTypeRegistry, PointStyle, ScriptableAndArray, ScriptableContext } from 'chart.js'

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

export type BaseStyles = {
  font?: {
    color?: string
    family?: string
    size?: number
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
}

export interface BarStyles extends BaseStyles {
  bar?: {
    thickness?: number
    borderWidth?: number
    borderRadius?: number
    borderColor?: string
    hoverBorderColor?: string
    backgroundColor?: string
    hoverBackgroundColor?: string
  }
}

export interface LineStyles extends BaseStyles {
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
    style?: ScriptableAndArray<PointStyle, ScriptableContext<keyof ChartTypeRegistry>>
    radius?: number
    borderWidth?: number
    borderColor?: string
    hoverBorderColor?: string
    backgroundColor?: string
    hoverBackgroundColor?: string
  }
}