import type { ThemePropValues, ThemeProps } from '../themes/theme.types'

type ThemeDictProps = {
  name: ThemePropValues
  cssVarName: string
}

const themeDict: ThemeDictProps[] = [
  { name: 'fontFamily', cssVarName: '--propel-font-family' },
  { name: 'fontSize', cssVarName: '--propel-font-size' },
  { name: 'fontWeight', cssVarName: '--propel-font-weight' },
  { name: 'fontHeight', cssVarName: '--propel-font-height' },
  { name: 'textPrimary', cssVarName: '--propel-text-primary' },
  { name: 'textSecondary', cssVarName: '--propel-text-secondary' },
  { name: 'bgPrimary', cssVarName: '--propel-bg-primary' },
  { name: 'bgAccent', cssVarName: '--propel-bg-accent' },
  { name: 'bgAccentHover', cssVarName: '--propel-bg-accent-hover' },
  { name: 'borderPrimary', cssVarName: '--propel-border-primary' }
]

export const parseComputedStyle = (themeContainer: HTMLElement) => {
  const computedStyle = getComputedStyle(themeContainer)
  const theme: ThemeProps = {}

  themeDict.forEach((item) => {
    const cssVarValue = computedStyle.getPropertyValue(item.cssVarName)
    if (cssVarValue) {
      theme[item.name] = cssVarValue
    }
  })
  return theme
}

export const setContainerStyle = (themeContainer: HTMLElement, theme: ThemeProps) => {
  themeDict.forEach((item) => {
    const themePropValue = theme[item.name]
    if (themePropValue) {
      themeContainer.style.setProperty(item.cssVarName, themePropValue)
    }
  })
}
