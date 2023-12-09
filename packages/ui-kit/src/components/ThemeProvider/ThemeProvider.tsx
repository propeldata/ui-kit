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
  UseSetupThemeProps
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
  baseTheme = 'lightTheme'
}: UseSetupThemeProps): { theme: ThemeStateProps; chartConfig?: ChartConfiguration<T> } => {
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
      backgroundColor: theme.accent ?? '',
      borderColor: theme.borderPrimary ?? '',
      elements: {
        point: {
          pointStyle: 'circle',
          hitRadius: 6,
          radius: 0,
          borderWidth: 2,
          hoverRadius: 6,
          hoverBorderColor: theme.bgPrimary ?? '',
          backgroundColor: theme.accentHover ?? '',
          hoverBackgroundColor: theme.accentHover ?? ''
        },
        bar: {
          borderWidth: 0,
          hoverBackgroundColor: theme.accentHover ?? ''
        },
        line: {
          borderWidth: 3
        }
      },
      plugins: {
        tooltip: {
          padding: parseInt(theme.spaceXs as string),
          backgroundColor: theme.bgPrimary ?? '',
          bodyColor: theme.textSecondary ?? '',
          titleColor: theme.textSecondary ?? '',
          borderColor: theme.borderPrimary ?? '',
          borderWidth: 1,
          cornerRadius: 4,
          titleFont: {
            size: getPixelFontSizeAsNumber(theme.tinyFontSize),
            weight: 'bold',
            lineHeight: theme.tinyLineHeight,
            family: theme.fontFamily
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

  return { theme, chartConfig }
}

export const ThemeProvider = ({
  children,
  baseTheme = 'lightTheme',
  theme: themeProp,
  globalChartConfigProps
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
      <ThemeContext.Provider value={{ theme, globalChartConfigProps }}>{children}</ThemeContext.Provider>
    </div>
  )
}
