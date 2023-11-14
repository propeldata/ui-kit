import type { ThemeProps } from '../themes/theme.types'

type ThemeDictProps = {
  name: keyof ThemeProps
  cssVarName: string
}

const themeDict: ThemeDictProps[] = [
  // Typography
  { name: 'fontFamily', cssVarName: '--propel-font-family' },
  { name: 'fontSize', cssVarName: '--propel-font-size' },
  { name: 'fontWeight', cssVarName: '--propel-font-weight' },
  { name: 'lineHeight', cssVarName: '--propel-font-height' },

  { name: 'tinyFontSize', cssVarName: '--propel-tiny-font-size' },
  { name: 'tinyFontWeight', cssVarName: '--propel-tiny-font-weight' },
  { name: 'tinyLineHeight', cssVarName: '--propel-tiny-line-height' },

  { name: 'h1FontSize', cssVarName: '--propel-h1-font-size' },
  { name: 'h1FontWeight', cssVarName: '--propel-h1-font-weight' },
  { name: 'h1LineHeight', cssVarName: '--propel-h1-line-height' },

  // Space
  { name: 'spaceXxs', cssVarName: '--propel-space-xxs' },
  { name: 'spaceXs', cssVarName: '--propel-space-xs' },

  // Utils
  { name: 'componentHeight', cssVarName: '--propel-component-height' },

  // Colors
  { name: 'successPrimary', cssVarName: '--propel-success-primary' },
  { name: 'successSecondary', cssVarName: '--propel-success-secondary' },
  { name: 'errorPrimary', cssVarName: '--propel-error-primary' },
  { name: 'errorSecondary', cssVarName: '--propel-error-secondary' },

  { name: 'colorPrimary', cssVarName: '--propel-color-primary' },
  { name: 'bgPrimary', cssVarName: '--propel-bg-primary' },
  { name: 'bgSecondary', cssVarName: '--propel-bg-secondary' },
  { name: 'textPrimary', cssVarName: '--propel-text-primary' },
  { name: 'textSecondary', cssVarName: '--propel-text-secondary' },
  { name: 'borderPrimary', cssVarName: '--propel-border-primary' },
  { name: 'accent', cssVarName: '--propel-accent' },
  { name: 'accentHover', cssVarName: '--propel-accent-hover' },
  { name: 'colorGradient', cssVarName: '--propel-color-gradient' }
]

// const cssVarNames = themeDict.map((item) => ({ [item.cssVarName]: item.cssVarName }))
// export type ThemeCSSVarNames2 = typeof cssVarNames

// @TODO: improve this type
export type ThemeCSSVarNames = {
  '--propel-font-family'?: string
  '--propel-font-size'?: string
  '--propel-font-weight'?: string
  '--propel-font-height'?: string
  '--propel-tiny-font-size'?: string
  '--propel-tiny-font-weight'?: string
  '--propel-tiny-line-height'?: string
  '--propel-h1-font-size'?: string
  '--propel-h1-font-weight'?: string
  '--propel-h1-line-height'?: string
  '--propel-space-xxs'?: string
  '--propel-space-xs'?: string
  '--propel-component-height'?: string
  '--propel-success-primary'?: string
  '--propel-success-secondary'?: string
  '--propel-error-primary'?: string
  '--propel-error-secondary'?: string
  '--propel-color-primary'?: string
  '--propel-bg-primary'?: string
  '--propel-bg-secondary'?: string
  '--propel-text-primary'?: string
  '--propel-text-secondary'?: string
  '--propel-border-primary'?: string
  '--propel-accent'?: string
  '--propel-accent-hover'?: string
  '--propel-color-gradient'?: string
}

export interface ThemeCSSProperties extends React.CSSProperties, ThemeCSSVarNames {}

export const parseComputedStyle = (themeContainer: HTMLElement) => {
  const computedStyle = getComputedStyle(themeContainer)
  const theme: Partial<ThemeProps> = {}

  themeDict.forEach((item) => {
    const cssVarValue = computedStyle.getPropertyValue(item.cssVarName)
    if (cssVarValue) {
      theme[item.name as string] = cssVarValue
    }
  })
  return theme
}

export const clearContainerStyle = (themeContainer: HTMLElement) => {
  themeDict.forEach((item) => {
    themeContainer.style.setProperty(item.cssVarName, '')
  })
}

export const setContainerStyle = (themeContainer: HTMLElement, theme: ThemeProps) => {
  themeDict.forEach((item) => {
    const themePropValue = theme[item.name as string]
    if (themePropValue) {
      themeContainer.style.setProperty(item.cssVarName, themePropValue)
    }
  })
}
