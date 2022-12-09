export enum Position {
  Center = 'center',
  TopLeft = 'top-left',
  CenterLeft = 'center-left',
  BottomLeft = 'bottom-left',
  TopCenter = 'top-center',
  BottomCenter = 'bottom-center',
  TopRight = 'top-right',
  CenterRight = 'center-right',
  BottomRight = 'bottom-right'
}

export type CounterStyles = {
  width?: string
  height?: string
  color?: string
  fontSize?: string
  position?: Position
  background?: string
}
