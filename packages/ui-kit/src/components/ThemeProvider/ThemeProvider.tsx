import { ChartConfiguration, ChartOptions } from 'chart.js'
import classnames from 'classnames'
import React, { createContext, useContext, useState } from 'react'
import { getPixelFontSizeAsNumber, initChartJs } from '../../helpers'
import { clearContainerStyle, parseComputedStyle, setContainerStyle } from '../../helpers/themeUtils'
import themes from '../../themes/themes.module.scss'
import { AccentColors, ThemeAppearances } from '../../themes'
import type {
  ChartVariant,
  ThemeContextProps,
  ThemeProviderProps,
  ThemeStateProps,
  UseSetupThemeProps,
  UseSetupThemeResult
} from './ThemeProvider.types'
import * as radixColors from '@radix-ui/colors'

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

/** A hook that returns the theme. */
export const useTheme = (): ThemeStateProps | undefined => {
  const context = useContext(ThemeContext)

  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context.theme
}

const getAccentColors = (accentColor: AccentColors, appearance: ThemeAppearances) => {
  const appearanceSuffix = appearance === 'dark' ? 'Dark' : ''
  return {
    ...radixColors.whiteA,
    ...radixColors.blackA,
    ...radixColors[`slate${appearanceSuffix}`], // @TODO: fix this
    ...radixColors[`slate${appearanceSuffix}A`], // @TODO: fix this
    ...(radixColors[`${accentColor}${appearanceSuffix}`] as Record<string, string>),
    ...(radixColors[`${accentColor}${appearanceSuffix}A`] as Record<string, string>)
  }
}

/** A hook that sets up the theme. */
export const useSetupTheme = <T extends ChartVariant>({
  componentContainer,
  appearance = 'light',
  accentColor = 'blue',
  renderLoader: renderLoaderProp,
  renderEmpty: renderEmptyProp,
  errorFallback: errorFallbackProp
}: UseSetupThemeProps): UseSetupThemeResult<T> => {
  const [theme, setTheme] = useState<ThemeStateProps>()
  const [chartConfig, setChartConfig] = useState<ChartConfiguration<T>>()
  const context = useContext(ThemeContext)
  const colors: Record<string, string> = React.useMemo(
    () => getAccentColors(accentColor, appearance),
    [accentColor, appearance]
  )

  React.useEffect(() => {
    if (!theme) {
      return
    }

    let config: Partial<ChartConfiguration<T>> = {
      type: undefined
    }

    config.options = {
      color: theme.getVar('--gray-11'),
      backgroundColor: theme.getVar('--accent-8'),
      borderColor: theme.getVar('--gray-7'),
      elements: {
        point: {
          pointStyle: 'circle',
          hitRadius: 6,
          radius: 0,
          borderWidth: 2,
          hoverRadius: 6,
          hoverBorderColor: theme.getVar('--accent-contrast'),
          backgroundColor: theme?.getVar('--accent-10'),
          hoverBackgroundColor: theme?.getVar('--accent-10')
        },
        bar: {
          borderWidth: 0,
          hoverBackgroundColor: theme.getVar('--accent-10') ?? ''
        },
        line: {
          borderWidth: 3
        }
      },
      plugins: {
        tooltip: {
          padding: getPixelFontSizeAsNumber(theme.getVar('--space-2')) ?? 8,
          backgroundColor: theme.getVar('--accent-1'),
          bodyColor: theme.getVar('--gray-9'),
          titleColor: theme.getVar('--gray-9'),
          borderColor: theme.getVar('--gray-7'),
          borderWidth: 1,
          cornerRadius: 4,
          titleFont: {
            size: getPixelFontSizeAsNumber(theme.getVar('--font-size-1')),
            weight: 'bold',
            lineHeight: theme.getVar('--line-height-1'),
            family: theme.getVar('--default-font-family')
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
      // setThemeOld({ ...context.theme, ...parseComputedStyle(componentContainer) })
      setTheme({
        appearance,
        ...context.theme,
        ...parseComputedStyle(componentContainer),
        tokens: { ...colors },
        componentContainer,
        getVar: (key: string) => (componentContainer ? getComputedStyle(componentContainer).getPropertyValue(key) : '')
      })
      return
    }

    // Set the theme from the component scope styles if there is no ThemeProvider context.
    // Use light theme as a fallback.
    if (!componentContainer.classList.contains(themes[appearance])) {
      componentContainer.classList.add(themes[appearance])
    }

    // setThemeOld({ ...parseComputedStyle(componentContainer) })
    setTheme({
      appearance,
      ...parseComputedStyle(componentContainer),
      tokens: { ...colors },
      componentContainer,
      getVar: (key: string) => (componentContainer ? getComputedStyle(componentContainer).getPropertyValue(key) : '')
    })
  }, [appearance, context, colors, componentContainer])

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
  appearance = 'light',
  accentColor = 'blue',
  className,
  globalChartConfigProps,
  renderEmpty,
  errorFallback,
  renderLoader,
  components,
  ...other
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeStateProps>()
  const ref = React.useRef(null)
  const colors = React.useMemo(() => getAccentColors(accentColor, appearance), [accentColor, appearance])

  React.useEffect(() => {
    if (!ref.current) {
      return
    }

    clearContainerStyle(ref.current)

    const baseThemeStyleProps = parseComputedStyle(ref.current)

    // if (typeof className === 'string') {
    //   setTheme({
    //     appearance,
    //     ...baseThemeStyleProps,
    //     tokens: { ...colors },
    //     componentContainer: ref?.current,
    //     getVar: (key: string) => (ref?.current ? getComputedStyle(ref?.current).getPropertyValue(key) : '')
    //   })
    //   return
    // }

    const combinedWithBaseProps = { ...baseThemeStyleProps, ...colors }

    setContainerStyle(ref.current, combinedWithBaseProps)
    setTheme({
      appearance,
      ...combinedWithBaseProps,
      tokens: { ...colors },
      componentContainer: ref?.current,
      getVar: (key: string) => (ref?.current ? getComputedStyle(ref?.current).getPropertyValue(key) : '')
    })
  }, [appearance, ref, colors, className, baseTheme])

  return (
    <div
      ref={ref}
      // className={classnames(themes['propel-themes'], themes[appearance], className)}
      className={classnames(themes['propel-themes'], themes[appearance], className)}
      data-testid="theme-provider"
      data-accent-color={accentColor}
      data-scaling="100%" // @TODO: fix this
      data-radius="medium" // @TODO: fix this
      data-gray-color="slate" // @TODO: fix this
      {...other}
    >
      <ThemeContext.Provider
        value={{ theme, globalChartConfigProps, renderEmpty, errorFallback, renderLoader, components }}
      >
        {children}
      </ThemeContext.Provider>
    </div>
  )
}
