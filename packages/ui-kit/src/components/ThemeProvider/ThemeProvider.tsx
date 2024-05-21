import { ChartConfiguration, ChartOptions } from 'chart.js'
import classnames from 'classnames'
import React, { createContext, useContext, useState } from 'react'
import { getPixelFontSizeAsNumber, initChartJs } from '../../helpers'
import { clearContainerStyle, parseComputedStyle, setContainerStyle } from '../../helpers/themeUtils'
import themes from '../../themes/themes.module.scss'
import type {
  ChartVariant,
  ThemeContextProps,
  ThemeProviderProps,
  ThemeStateProps,
  UseSetupThemeProps,
  UseSetupThemeResult
} from './ThemeProvider.types'

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

/** A hook that returns the theme. */
export const useTheme = (): ThemeStateProps | undefined => {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context.theme
}

/** A hook that sets up the theme. */
export const useSetupTheme = <T extends ChartVariant>({
  componentContainer,
  baseTheme = 'lightTheme',
  renderLoader: renderLoaderProp,
  renderEmpty: renderEmptyProp,
  errorFallback: errorFallbackProp
}: UseSetupThemeProps): UseSetupThemeResult<T> => {
  const [theme, setTheme] = useState<ThemeStateProps>()
  const [chartConfig, setChartConfig] = useState<ChartConfiguration<T>>()
  const context = useContext(ThemeContext)

  React.useEffect(() => {
    if (!theme) {
      return
    }

    let config: Partial<ChartConfiguration<T>> = {
      type: undefined
    }

    config.options = {
      color: theme.textSecondary ?? '',
      backgroundColor: theme.backgroundBrandSolid ?? '',
      borderColor: theme.borderPrimary ?? '',
      elements: {
        point: {
          pointStyle: 'circle',
          hitRadius: 6,
          radius: 0,
          borderWidth: 2,
          hoverRadius: 6,
          hoverBorderColor: theme.backgroundPrimary ?? '',
          backgroundColor: theme.backgroundBrandSolidHover ?? '',
          hoverBackgroundColor: theme.backgroundBrandSolidHover ?? ''
        },
        bar: {
          borderWidth: 0,
          hoverBackgroundColor: theme.backgroundBrandSolidHover ?? ''
        },
        line: {
          borderWidth: 3
        }
      },
      plugins: {
        tooltip: {
          padding: parseInt(theme.spacingMd ?? '') ?? 8,
          backgroundColor: theme.backgroundPrimary ?? '',
          bodyColor: theme.textSecondary ?? '',
          titleColor: theme.textSecondary ?? '',
          borderColor: theme.borderPrimary ?? '',
          borderWidth: 1,
          cornerRadius: 4,
          titleFont: {
            size: getPixelFontSizeAsNumber(theme.textXxsRegularFontSize),
            weight: 'bold',
            lineHeight: theme.textXxsRegularLineHeight,
            family: theme.textXxsRegularFontFamily
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

    if (context) {
      // Merge the theme from the context with the component scope styles
      setTheme({ ...context.theme, ...parseComputedStyle(componentContainer) })
      return
    }

    // Set the theme from the component scope styles if there is no ThemeProvider context.
    // Use light theme as a fallback.
    if (!componentContainer.classList.contains(themes[baseTheme])) {
      componentContainer.classList.add(themes[baseTheme])
    }

    setTheme(parseComputedStyle(componentContainer))
  }, [context, componentContainer, baseTheme])

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
  baseTheme = 'lightTheme',
  theme: themeProp,
  globalChartConfigProps,
  renderEmpty,
  errorFallback,
  renderLoader,
  components
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeStateProps>()
  const ref = React.useRef(null)

  React.useEffect(() => {
    if (!ref.current) {
      return
    }

    clearContainerStyle(ref.current)

    const baseThemeStyleProps = parseComputedStyle(ref.current)

    if (typeof themeProp === 'string') {
      setTheme({ ...baseThemeStyleProps, baseTheme })
      return
    }

    const combinedWithBaseProps = { ...baseThemeStyleProps, ...themeProp }
    setContainerStyle(ref.current, combinedWithBaseProps)
    setTheme(combinedWithBaseProps)
  }, [ref, themeProp, baseTheme])

  return (
    <div
      ref={ref}
      className={classnames(themes[baseTheme], typeof themeProp === 'string' ? themeProp : undefined)}
      data-testid="theme-provider"
    >
      <ThemeContext.Provider
        value={{ theme, globalChartConfigProps, renderEmpty, errorFallback, renderLoader, components }}
      >
        {children}
      </ThemeContext.Provider>
    </div>
  )
}
