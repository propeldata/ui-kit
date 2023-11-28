import { Chart } from 'chart.js'
import classnames from 'classnames'
import React, { createContext, useContext, useState } from 'react'
import { setupChartStyles } from '../../helpers'
import { clearContainerStyle, parseComputedStyle, setContainerStyle } from '../../helpers/themeUtils'
import themes from '../../themes/themes.module.scss'
import type { ThemeContextProps, ThemeProviderProps, ThemeStateProps, UseThemeProps } from './ThemeProvider.types'

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const useTheme = ({ componentContainer, baseTheme = 'lightTheme' }: UseThemeProps): ThemeStateProps => {
  const [theme, setTheme] = useState<ThemeStateProps>()
  const context = useContext(ThemeContext)

  React.useEffect(() => {
    if (!theme || context) {
      return
    }

    setupChartStyles({ theme })
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

  return theme
}

export const useGlobalChartConfigProps = (): ((chart: typeof Chart) => typeof Chart) => {
  const context = useContext(ThemeContext)

  if (!context) {
    return undefined
  }

  return context.globalChartConfigProps
}

export const ThemeProvider = ({
  children,
  baseTheme = 'lightTheme',
  theme: themeProp = themes.lightTheme,
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

  React.useEffect(() => {
    if (!theme) {
      return
    }

    setupChartStyles({ theme, globalChartConfigProps })
  }, [theme, globalChartConfigProps])

  return (
    <div ref={ref} className={classnames(themes[baseTheme], typeof themeProp === 'string' ? themeProp : undefined)}>
      <ThemeContext.Provider value={{ theme, globalChartConfigProps }}>{children}</ThemeContext.Provider>
    </div>
  )
}
