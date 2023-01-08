export type ChartPaddingOptions =
  | number
  | {
      top?: number
      bottom?: number
      right?: number
      left?: number
    }

export type TimeSeriesData = {
  values?: string[]
  labels?: string[]
}

export type ChartVariant = 'bar' | 'line'

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
    hideGridLines?: boolean
    backgroundColor?: string
    padding?: ChartPaddingOptions
    borderRadius?: string
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
    borderWidth?: number
    borderRadius?: number
    borderColor?: string
    hoverBorderColor?: string
    backgroundColor?: string
    hoverBackgroundColor?: string
  }
  point?: {
    style?: 'circle' | 'cross' | 'crossRot' | 'dash' | 'line' | 'rect' | 'rectRounded' | 'rectRot' | 'star' | 'triangle'
    background?: {
      color?: string
      hoverColor?: string
    }
    border?: {
      color?: string
      width?: string
      hoverColor?: string
      hoverWidth?: string
    }
    hit?: {
      radius?: string
    }
    radius?: string
    hoverRadius?: string
    rotation?: string
  }
}
