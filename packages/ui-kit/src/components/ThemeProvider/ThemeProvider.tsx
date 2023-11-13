import { Chart } from 'chart.js'
import classnames from 'classnames'
import React, { createContext, useContext, useState } from 'react'
import { initChartJs, setupChartStyles } from '../../helpers'
import { clearContainerStyle, parseComputedStyle, setContainerStyle } from '../../helpers/themeUtils'
import type { ThemeProps } from '../../themes/theme.types'
import themes from '../../themes/themes.module.scss'

export type ThemeContextProps = {
  theme?: ThemeProps
  globalChartProps?: (chart: typeof Chart) => typeof Chart
}

export type ThemeProviderProps = {
  children?: React.ReactNode
  baseTheme?: 'lightTheme' | 'darkTheme'
  theme?: string | ThemeProps
  globalChartProps?: (chart: typeof Chart) => typeof Chart
}

type ThemeStateProps = ThemeProps | undefined

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const useTheme = (customClassName?: string): ThemeStateProps => {
  const [theme, setTheme] = useState<ThemeStateProps>()
  const context = useContext(ThemeContext)

  React.useEffect(() => {
    if (!(theme && !theme?.chartJsInitiated)) {
      return
    }

    initChartJs()
    setupChartStyles({ theme })
    setTheme((prevTheme) => ({ ...prevTheme, chartJsInitiated: true }))
  }, [theme])

  React.useEffect(() => {
    if (context) {
      setTheme(context.theme)
      return
    }

    // If there is no ThemeProvider
    const themeContainer = document.createElement('div')
    themeContainer.classList.add(themes.lightTheme)

    let themeContainerElement = themeContainer

    if (customClassName) {
      // It raises the priority of custom styles
      const themeInnerContainer = document.createElement('div')
      themeInnerContainer.classList.add(customClassName)
      themeContainer.appendChild(themeInnerContainer)
      themeContainerElement = themeInnerContainer
    }

    document.body.appendChild(themeContainer)

    setTheme(parseComputedStyle(themeContainerElement))

    return () => {
      if (document.body.contains(themeContainer)) {
        document.body.removeChild(themeContainer)
      }
    }
  }, [context, customClassName])

  return theme
}

export const useGlobalChartProps = (): ((chart: typeof Chart) => typeof Chart) => {
  const context = useContext(ThemeContext)

  if (!context) {
    return undefined
  }

  return context.globalChartProps
}

export const ThemeProvider = ({
  children,
  baseTheme = 'lightTheme',
  theme: themeProp = themes.lightTheme,
  globalChartProps
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
    if (!(theme && !theme?.chartJsInitiated)) {
      return
    }

    initChartJs()
    setupChartStyles({ theme, chartProps: globalChartProps })
    setTheme((prevTheme) => ({ ...prevTheme, chartJsInitiated: true }))
  }, [theme, globalChartProps])

  return (
    <div ref={ref} className={classnames(themes[baseTheme], typeof themeProp === 'string' ? themeProp : undefined)}>
      <ThemeContext.Provider value={{ theme, globalChartProps }}>{children}</ThemeContext.Provider>
    </div>
  )
}
