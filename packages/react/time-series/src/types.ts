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

export type BarStyles = {
  variant: 'bar'
  border?: {
    width?: number
    radius?: number
    color?: string
    hoverColor?: string
  }
  background?: {
    color?: string
    hoverColor?: string
  }
  font?: {
    color?: string
    family?: string
    size?: number
    style?: 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit'
    weight?: string
    lineHeight?: number | string
  }
  canvas?: {
    backgroundColor?: string
    padding?: ChartPaddingOptions
    borderRadius?: string
  }
}

export type LineStyles = {
  variant: 'line'
  border?: {
    width?: number
    radius?: number
    color?: string
    hoverColor?: string
  }
  background?: {
    color?: string
    hoverColor?: string
  }
  font?: {
    color?: string
    family?: string
    size?: number
    style?: 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit'
    weight?: string
    lineHeight?: number | string
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
  canvas?: {
    backgroundColor?: string
    padding?: ChartPaddingOptions
    borderRadius?: string
  }
}

export type ChartVariant = 'bar' | 'line'
