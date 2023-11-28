export type ChartPaddingOptions =
  | number
  | {
      /** The top padding */
      top?: number
      /** The bottom padding */
      bottom?: number
      /** The right padding */
      right?: number
      /** The left padding */
      left?: number
    }

export type ChartPlugins = {
  [pluginName: string]: {
    [optionName: string]: string | undefined | unknown
  }
}

export type FontProps = {
  /** The color of the font */
  color?: string
  /** The font family to use */
  family?: string
  /** The size of the font */
  size?: string | number | 'inherit'
  /** The style of the font */
  style?: 'normal' | 'italic' | 'oblique' | 'initial' | 'inherit'
  /** The weight of the font */
  weight?: string
  /** The line height of the font */
  lineHeight?: number | string
}

export interface ChartFontProps extends FontProps {
  stretch?: string
  variant?: string
}

export type ChartCanvasProps = {
  /** The width of the canvas */
  width?: number | string
  /** The height of the canvas */
  height?: number | string
  /** Whether to hide the grid lines */
  hideGridLines?: boolean
  /** The background color of the canvas */
  backgroundColor?: string
  /** The padding of the canvas */
  padding?: ChartPaddingOptions
  /** The border radius of the canvas */
  borderRadius?: string
}

export type ChartTooltipProps = {
  /** Whether to show the tooltip or not */
  display?: boolean
  /** Background color of the tooltip */
  backgroundColor?: string
  /** Border radius of the tooltip */
  borderRadius?: number
  /** Border color of the tooltip */
  borderColor?: string
  /** Border width of the tooltip */
  borderWidth?: number
  /** Text color of the tooltip */
  color?: string
  /** Padding of the tooltip */
  padding?: number
  /** Alignment of the content inside the tooltip */
  alignContent?: 'left' | 'center' | 'right'
  /** Size of the tooltip's caret */
  caretSize?: number
}

export type ChartBarProps = {
  /** Thickness of the bars */
  thickness?: number
  /** Border width of the bars */
  borderWidth?: number
  /** Border radius of the bars */
  borderRadius?: number
  /** Border color of the bars */
  borderColor?: string
  /** Border color of the bars on hover */
  hoverBorderColor?: string
  /** Background color of the bars */
  backgroundColor?: string
  /** Background color of the bars on hover */
  hoverBackgroundColor?: string
}

export type ChartLineProps = {
  /** Tension of the line */
  tension?: number
  /** Whether the line should be stepped or not */
  stepped?: boolean
  /** Border width of the line */
  borderWidth?: number
  /** Border radius of the bars */
  borderRadius?: number
  /** Border color of the bars */
  borderColor?: string
  /** Border color of the bars on hover */
  hoverBorderColor?: string
  /** Background color of the bars */
  backgroundColor?: string
  /** Background color of the bars on hover */
  hoverBackgroundColor?: string
}

export type ChartPointProps = {
  /** Shape of the point */
  style?: string | boolean
  /** Radius of the point */
  radius?: number
  /** Border width of the point */
  borderWidth?: number
  /** Border color of the point */
  borderColor?: string
  /** Border color of the point on hover */
  hoverBorderColor?: string
  /** Background color of the point */
  backgroundColor?: string
  /** Background color of the point on hover */
  hoverBackgroundColor?: string
}

export type ChartTableProps = {
  /** The width of the table */
  width?: string
  /** The height of the table */
  height?: string
  /** Whether the table header should remain fixed while scrolling */
  stickyHeader?: boolean
  /** Whether the table shows number order */
  isOrdered?: boolean
  /** Whether the table shows a value bar. It will not show the value bar if the values are non-numeric. */
  hasValueBar?: boolean
  /** The background color of the table */
  backgroundColor?: string
  /** The padding of the table */
  padding?: string
  /** The styles for the table header */
  header?: ChartTableHeaderProps
  /** The styles for the table columns */
  columns?: ChartTableColumnsProps
  /** The styles for the table value column */
  valueColumn?: ChartTableValueColumnProps
  /** The styles for the table value bar */
  valueBar?: ChartTableValueBarProps
}

export type ChartTableHeaderProps = {
  /** The background color of the header */
  backgroundColor?: string
  /** The alignment of the header text */
  align?: 'left' | 'center' | 'right'
  /** The font styles for the header text */
  font?: FontProps
}

export type ChartTableColumnsProps = {
  /** The background color of the columns */
  backgroundColor?: string
  /** The alignment of the column text */
  align?: 'left' | 'center' | 'right'
  /** The font styles for the column text */
  font?: FontProps
}

export type ChartTableValueColumnProps = {
  /** Whether the value column should use the locale format */
  localize?: boolean
  /** Symbol to be shown before the value text */
  prefixValue?: string
  /** Symbol to be shown after the value text */
  sufixValue?: string
  /** The background color of the value column */
  backgroundColor?: string
  /** The alignment of the value column text */
  align?: 'left' | 'center' | 'right'
  /** The font styles for the value column text */
  font?: FontProps
}

export type ChartTableValueBarProps = {
  /** The color of the value bar */
  color?: string
  /** The background color of the value bar */
  backgroundColor?: string
}

export type ChartYAxisProps = {
  /** Whether the y axis should begin at zero or not */
  beginAtZero?: boolean
  /** The scale of the y axis */
  scale?: 'linear' | 'logarithmic'
}

export type ChartStyles = {
  /** Styles for the font used in the component */
  font?: ChartFontProps
  /** Styles for the canvas used in the component */
  canvas?: ChartCanvasProps
  /** Styles for the tooltip displayed on hover */
  tooltip?: ChartTooltipProps
  /** Styles for the bars in the chart (only used in `bar` variant) */
  bar?: ChartBarProps
  /** Styles for the line in the chart (only used in `line` variant) */
  line?: ChartLineProps
  /** Styles for the points in the chart */
  point?: ChartPointProps
  /** Styles for the table chart (only used in `table` variant) */
  table?: ChartTableProps
  /** Options for the y Axis */
  yAxis?: ChartYAxisProps
}

/**
 * @deprecated the type is deprecated, use ChartStyles instead
 */
export type Styles = ChartStyles
