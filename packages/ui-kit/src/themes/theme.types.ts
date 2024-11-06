// prettier-ignore
export type AccentColors = 'amber' | 'blue' | 'bronze' | 'brown' | 'crimson' | 'cyan' | 'gold' | 'grass' | 'gray' | 'green' | 'indigo' | 'iris' | 'jade' | 'lime' | 'mint' | 'orange' | 'pink' | 'plum' | 'purple' | 'red' | 'ruby' | 'sky' | 'teal' | 'tomato' | 'violet' | 'yellow'
export const accentColors: AccentColors[] = [
  'amber',
  'blue',
  'bronze',
  'brown',
  'crimson',
  'cyan',
  'gold',
  'grass',
  'gray',
  'green',
  'indigo',
  'iris',
  'jade',
  'lime',
  'mint',
  'orange',
  'pink',
  'plum',
  'purple',
  'red',
  'ruby',
  'sky',
  'teal',
  'tomato',
  'violet',
  'yellow'
]

export type GrayColors = 'auto' | 'gray' | 'mauve' | 'slate' | 'sage' | 'olive' | 'sand'
export const grayColors: GrayColors[] = ['auto', 'gray', 'mauve', 'slate', 'sage', 'olive', 'sand']

export type Radii = 'none' | 'small' | 'medium' | 'large' | 'full'
export const radii: Radii[] = ['none', 'small', 'medium', 'large', 'full']

export type Scalings = '90%' | '95%' | '100%' | '105%' | '110%'
export const scalings: Scalings[] = ['90%', '95%', '100%', '105%', '110%']

export type PanelBackgrounds = 'solid' | 'translucent'
export const panelBackgrounds: PanelBackgrounds[] = ['solid', 'translucent']

export type ThemeAppearances = 'light' | 'dark'

export interface ThemeSettingProps {
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

export interface ThemeComponentProps {
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
