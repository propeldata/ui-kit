import { ChartTypeRegistry, PluginOptionsByType, PointStyle, ScriptableAndArray, ScriptableContext } from 'chart.js'

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

export type Styles = {
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
    style?: ScriptableAndArray<PointStyle, ScriptableContext<keyof ChartTypeRegistry>>
    radius?: number
    borderWidth?: number
    borderColor?: string
    hoverBorderColor?: string
    backgroundColor?: string
    hoverBackgroundColor?: string
  }
}

/**
 * Workaround to make custom plugin types to work
 */
type _DeepPartialArray<T> = Array<DeepPartial<T>>

// eslint-disable-next-line @typescript-eslint/ban-types
type DeepPartial<T> = T extends Function
  ? T
  : T extends Array<infer U>
  ? _DeepPartialArray<U>
  : T extends object
  ? _DeepPartialObject<T>
  : T | undefined

type _DeepPartialObject<T> = { [P in keyof T]?: DeepPartial<T[P]> }

export type CustomPlugins = _DeepPartialObject<PluginOptionsByType<keyof ChartTypeRegistry>>
