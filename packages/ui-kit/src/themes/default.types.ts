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
    [optionName: string]: string | undefined | unknown
  }
}

export type ChartStyles = {
  font?: {
    color?: string
    family?: string
    size?: number | string | 'inherit'
    style?: 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit'
    weight?: string
    lineHeight?: number | string
    stretch?: string
    variant?: string
  }
  canvas?: {
    width?: number
    height?: number | string
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
  table?: {
    width?: string
    height?: string
    stickyHeader?: boolean
    isOrdered?: boolean
    hasValueBar?: boolean
    backgroundColor?: string
    padding?: string
    header?: {
      backgroundColor?: string
      align?: 'left' | 'center' | 'right'
      font?: {
        color?: string
        family?: string
        size?: string | 'inherit'
        style?: 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit'
        weight?: string
        lineHeight?: number | string
      }
    }
    columns?: {
      backgroundColor?: string
      align?: 'left' | 'center' | 'right'
      font?: {
        color?: string
        family?: string
        size?: string | 'inherit'
        style?: 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit'
        weight?: string
        lineHeight?: number | string
      }
    }
    valueColumn?: {
      localize?: boolean
      prefixValue?: string
      sufixValue?: string
      backgroundColor?: string
      align?: 'left' | 'center' | 'right'
      font?: {
        color?: string
        family?: string
        size?: string | 'inherit'
        style?: 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit'
        weight?: string
        lineHeight?: number | string
      }
    }
    valueBar?: {
      color?: string
      backgroundColor?: string
    }
  }
  yAxis?: {
    beginAtZero?: boolean
    scale?: 'linear' | 'logarithmic'
  }
}

/**
 * @deprecated the type is deprecated, use ChartStyles instead
 */
export type Styles = ChartStyles
