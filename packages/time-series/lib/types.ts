export type PaddingOptions =
  | number
  | {
      top?: number
      bottom?: number
      right?: number
      left?: number
    }

export type BarStyles = {
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
    width?: string
    height?: string
    backgroundColor?: string
    padding?: PaddingOptions
    borderRadius?: string
  }
}
