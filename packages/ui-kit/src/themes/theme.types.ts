// prettier-ignore
export const accentColors = ['amber', 'blue', 'bronze', 'brown', 'crimson', 'cyan', 'gold', 'grass', 'gray', 'green', 'indigo', 'iris', 'jade', 'lime', 'mint', 'orange', 'pink', 'plum', 'purple', 'red', 'ruby', 'sky', 'teal', 'tomato', 'violet', 'yellow'] as const
export type AccentColors = (typeof accentColors)[number]

export const grayColors = ['auto', 'gray', 'mauve', 'slate', 'sage', 'olive', 'sand'] as const
export type GrayColors = (typeof grayColors)[number]

export const radii = ['none', 'small', 'medium', 'large', 'full'] as const
export type Radii = (typeof radii)[number]

export const scalings = ['90%', '95%', '100%', '105%', '110%'] as const
export type Scalings = (typeof scalings)[number]

export const panelBackgrounds = ['solid', 'translucent'] as const
export type PanelBackgrounds = (typeof panelBackgrounds)[number]

export type ThemeAppearances = 'light' | 'dark'

export type ThemeSettingProps = {
  /**
   * The initial theme used as a base. It provides a default set of styling
   * from which customizations can be applied.
   */
  appearance?: ThemeAppearances
  /**
   * The global theme accent color. This color is used to highlight elements
   */
  accentColor?: AccentColors
  /**
   * The global theme gray color. This color is used for text and background colors
   */
  grayColor?: GrayColors
  /**
   * The global theme radius color. This color is used for border radius
   */
  radius?: Radii
  /**
   * The global theme scaling. This value is used to scale components
   */
  scaling?: Scalings
  /**
   * The global theme panel background. This value is used to set the panel background
   */
  panelBackground?: PanelBackgrounds
}

export interface ThemeTokenProps extends ThemeSettingProps {
  /**
   * The root theme container element
   */
  componentContainer?: HTMLElement | null
  /** The component root element to which the theme will be applied. */
  themeProviderContainer?: HTMLElement | null
  /**
   * Method that returns the value of a CSS variable from the theme.
   */
  getVar: (varName: string) => string
  tokens: {
    [key: string]: string
  }
}

export type ThemeComponentProps = {
  /** Supports all standard CSS properties along with custom theme-based CSS variables */
  style?: React.CSSProperties

  /** Provides a className for the ErrorFallback container */
  className?: string
}

export interface PaletteColor {
  name: AccentColors
  primary: string
  secondary: string
}
