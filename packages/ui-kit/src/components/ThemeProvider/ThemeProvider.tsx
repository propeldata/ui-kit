'use client'

import * as radixColors from '@radix-ui/colors'
import { Theme } from '@radix-ui/themes'
import { ChartConfiguration, ChartOptions } from 'chart.js'
import classnames from 'classnames'
import React, { createContext, useContext, useState } from 'react'
import { getPixelFontSizeAsNumber, initChartJs } from '../../helpers'
import { clearContainerStyle, parseComputedStyle, setContainerStyle } from '../../helpers/themeUtils'
import { getMatchingGrayColor } from '../../themes/helpers/getMatchingGrayColor'
import type {
  AccentColors,
  GrayColors,
  PanelBackgrounds,
  Radii,
  Scalings,
  ThemeAppearances,
  ThemeTokenProps
} from '../../themes/theme.types'
import themes from '../../themes/themes.module.scss'
import type {
  ChartVariant,
  ThemeContextProps,
  ThemeProps,
  ThemeStateProps,
  UseSetupThemeProps,
  UseSetupThemeResult
} from './ThemeProvider.types'

export const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

/** A hook that returns the theme. */
export const useTheme = (): ThemeStateProps | undefined => {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context.theme
}

const getAccentColors = (
  accentColor: AccentColors,
  appearance: ThemeAppearances,
  grayColor: Exclude<GrayColors, 'auto'>
) => {
  const appearanceSuffix = appearance === 'dark' ? 'Dark' : ''
  return {
    ...radixColors.whiteA,
    ...radixColors.blackA,
    ...radixColors[`red${appearanceSuffix}`],
    ...radixColors[`red${appearanceSuffix}A`],
    ...(radixColors[`${grayColor}${appearanceSuffix}`] as Record<string, string>),
    ...(radixColors[`${grayColor}${appearanceSuffix}A`] as Record<string, string>),
    ...(radixColors[`${accentColor}${appearanceSuffix}`] as Record<string, string>),
    ...(radixColors[`${accentColor}${appearanceSuffix}A`] as Record<string, string>)
  }
}

/** A hook that sets up the theme. */
export const useSetupTheme = <T extends ChartVariant>({
  componentContainer,
  appearance: appearanceProp,
  accentColor: accentColorProp,
  grayColor: grayColorProp,
  radius: radiusProp,
  scaling: scalingProp,
  panelBackground: panelBackgroundProp,
  renderLoader: renderLoaderProp,
  renderEmpty: renderEmptyProp,
  errorFallback: errorFallbackProp
}: UseSetupThemeProps): UseSetupThemeResult<T> => {
  const [theme, setTheme] = useState<ThemeStateProps>()
  const [chartConfig, setChartConfig] = useState<ChartConfiguration<T>>()
  const context = useContext(ThemeContext)

  const getDefault = React.useCallback(
    (key: keyof ThemeTokenProps, defaultValue: string) => {
      return !context?.theme ? defaultValue : context.theme[key]
    },
    [context]
  )

  const accentColor = accentColorProp ? accentColorProp : (getDefault('accentColor', 'blue') as AccentColors)
  const grayColorVal = grayColorProp ? grayColorProp : (getDefault('grayColor', 'auto') as GrayColors)
  const grayColor = grayColorVal === 'auto' ? getMatchingGrayColor(accentColor ?? 'blue') : grayColorVal
  const appearance = appearanceProp ? appearanceProp : (getDefault('appearance', 'light') as ThemeAppearances)
  const radius = radiusProp ? radiusProp : (getDefault('radius', 'medium') as Radii)
  const scaling = scalingProp ? scalingProp : (getDefault('scaling', '100%') as Scalings)
  const panelBackground = panelBackgroundProp
    ? panelBackgroundProp
    : (getDefault('panelBackground', 'translucent') as PanelBackgrounds)

  const colors: Record<string, string> = React.useMemo(
    () => getAccentColors(accentColor ?? 'blue', appearance ?? 'light', grayColor ?? 'gray'),
    [accentColor, appearance, grayColor]
  )

  React.useEffect(() => {
    if (!theme) {
      return
    }

    let config: Partial<ChartConfiguration<T>> = {
      type: undefined
    }

    config.options = {
      color: theme.getVar('--propel-gray-11'),
      backgroundColor: theme.getVar('--propel-accent-8'),
      borderColor: theme.getVar('--propel-gray-7'),
      elements: {
        point: {
          pointStyle: 'circle',
          hitRadius: 6,
          radius: 0,
          borderWidth: 2,
          hoverRadius: 6,
          hoverBorderColor: theme.getVar('--propel-accent-contrast'),
          backgroundColor: theme?.getVar('--propel-accent-10'),
          hoverBackgroundColor: theme?.getVar('--propel-accent-10')
        },
        bar: {
          borderWidth: 0,
          hoverBackgroundColor: theme.getVar('--propel-accent-10') ?? ''
        },
        line: {
          borderWidth: 3
        }
      },
      plugins: {
        tooltip: {
          padding: getPixelFontSizeAsNumber(theme.getVar('--propel-space-2')) ?? 8,
          backgroundColor: theme.getVar('--propel-accent-1'),
          bodyColor: theme.getVar('--propel-gray-9'),
          titleColor: theme.getVar('--propel-gray-9'),
          borderColor: theme.getVar('--propel-gray-7'),
          borderWidth: 1,
          cornerRadius: 4,
          titleFont: {
            size: getPixelFontSizeAsNumber(theme.getVar('--propel-font-size-1')),
            weight: 'bold',
            lineHeight: theme.getVar('--propel-line-height-1'),
            family: theme.getVar('--propel-default-font-family')
          }
        }
      }
    } as ChartOptions<T>

    if (context) {
      if (context.globalChartConfigProps) {
        // @TODO: fix any
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        config = context.globalChartConfigProps(config as any) as ChartConfiguration<T>
      }
    }

    initChartJs()

    setChartConfig(config as ChartConfiguration<T>)
  }, [theme, context])

  React.useEffect(() => {
    if (!componentContainer) {
      return
    }

    if (!componentContainer.classList.contains(themes['propel-themes'])) {
      componentContainer.classList.add(themes['propel-themes'])
    }

    if (context) {
      let componentColors = colors

      if (accentColor && context?.theme && accentColor !== context?.theme.accentColor) {
        componentColors = getAccentColors(accentColor, appearance, grayColor)

        const baseThemeStyleProps = parseComputedStyle(componentContainer)
        const combinedWithBaseProps = { ...baseThemeStyleProps, ...componentColors }
        setContainerStyle(componentContainer, combinedWithBaseProps)
      }

      // Merge the theme from the context with the component scope styles
      setTheme({
        ...context.theme,
        tokens: { ...componentColors },
        ...parseComputedStyle(componentContainer),
        getVar: (key: string) => {
          const value = componentContainer ? getComputedStyle(componentContainer).getPropertyValue(key) : ''
          if (value === '') {
            return context?.theme?.getVar(key) ?? ''
          }
          return value
        }
      })

      return
    }

    const baseThemeStyleProps = parseComputedStyle(componentContainer)

    clearContainerStyle(componentContainer)

    const componentColors = getAccentColors(accentColor, appearance, grayColor)
    const combinedWithBaseProps = { ...baseThemeStyleProps, ...componentColors }
    setContainerStyle(componentContainer, combinedWithBaseProps)

    if (!componentContainer.classList.contains(themes[appearance])) {
      componentContainer.classList.add(themes[appearance])
    }

    setTheme({
      accentColor,
      appearance,
      grayColor,
      radius,
      scaling,
      panelBackground,
      ...parseComputedStyle(componentContainer),
      tokens: { ...colors },
      componentContainer,
      getVar: (key: string) => (componentContainer ? getComputedStyle(componentContainer).getPropertyValue(key) : '')
    })
  }, [
    appearance,
    accentColor,
    grayColor,
    radius,
    scaling,
    panelBackground,
    context,
    colors,
    grayColorProp,
    componentContainer
  ])

  const { renderEmpty, errorFallback, renderLoader, components } = context ?? {}

  return {
    theme,
    chartConfig,
    renderEmpty: renderEmptyProp || renderEmpty,
    errorFallback: errorFallbackProp || errorFallback,
    renderLoader: renderLoaderProp || renderLoader,
    components
  }
}

export const ThemeProvider = ({
  children,
  appearance = 'light',
  accentColor = 'blue',
  grayColor: grayColorProp = 'auto',
  radius = 'medium',
  scaling = '100%',
  panelBackground = 'translucent',
  className,
  globalChartConfigProps,
  renderEmpty,
  errorFallback,
  renderLoader,
  components,
  ...other
}: ThemeProps) => {
  const grayColor = grayColorProp === 'auto' ? getMatchingGrayColor(accentColor) : grayColorProp
  const [theme, setTheme] = useState<ThemeStateProps>()
  const ref = React.useRef(null)
  const colors = React.useMemo(
    () => getAccentColors(accentColor, appearance, grayColor),
    [accentColor, appearance, grayColor]
  )

  React.useEffect(() => {
    if (!ref.current) {
      return
    }

    clearContainerStyle(ref.current)

    const baseThemeStyleProps = parseComputedStyle(ref.current)
    const combinedWithBaseProps = { ...baseThemeStyleProps, ...colors }

    setContainerStyle(ref.current, combinedWithBaseProps)

    setTheme({
      appearance,
      accentColor,
      grayColor,
      radius,
      scaling,
      panelBackground,
      ...combinedWithBaseProps,
      tokens: { ...colors },
      themeProviderContainer: ref?.current,
      getVar: (key: string) => (ref?.current ? getComputedStyle(ref?.current).getPropertyValue(key) : '')
    })
  }, [appearance, accentColor, grayColor, radius, scaling, panelBackground, ref, colors, className])

  return (
    <Theme>
      <div
        ref={ref}
        className={classnames(themes['propel-themes'], themes[appearance], className)}
        data-testid="theme-provider"
        data-accent-color={accentColor}
        data-gray-color={grayColor}
        data-radius={radius}
        data-scaling={scaling}
        data-panel-background={panelBackground}
        {...other}
      >
        <ThemeContext.Provider
          value={{ theme, globalChartConfigProps, renderEmpty, errorFallback, renderLoader, components }}
        >
          {children}
        </ThemeContext.Provider>
      </div>
    </Theme>
  )
}
