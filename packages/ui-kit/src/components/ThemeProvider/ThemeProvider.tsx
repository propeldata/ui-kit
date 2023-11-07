import { Chart } from 'chart.js'
import React, { createContext, useContext, useState } from 'react'
import { setupChartStyles, initChartJs } from '../../helpers'
import { parseComputedStyle, setContainerStyle } from '../../helpers/themeUtils'
import type { ThemeProps } from '../../themes/theme.types'
import themes from '../../themes/themes.module.css'

export type ThemeContextProps = {
  theme?: ThemeProps
  globalChartProps?: (chart: typeof Chart) => typeof Chart
}

export type ThemeProviderProps = {
  children?: React.ReactNode
  theme?: string | ThemeProps
  globalChartProps?: (chart: typeof Chart) => typeof Chart
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

export const useTheme = (): ThemeProps | undefined => {
  const context = useContext(ThemeContext)

  if (!context) {
    return parseComputedStyle(document.body)
  }

  return context.theme
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
  theme: initialTheme = themes.lightTheme,
  globalChartProps
}: ThemeProviderProps) => {
  const [theme, setTheme] = useState<ThemeProps | undefined>()
  const ref = React.useRef(null)

  React.useEffect(() => {
    if (!(ref.current && initialTheme)) {
      return
    }

    if (typeof initialTheme === 'string') {
      setTheme({ ...parseComputedStyle(ref.current), themeClassName: initialTheme })
      return
    }

    setContainerStyle(ref.current, initialTheme)
    setTheme(initialTheme)
  }, [ref, initialTheme])

  React.useEffect(() => {
    if (!(theme && !theme?.chartJsInitiated)) {
      return
    }

    initChartJs()
    setupChartStyles({ theme, chartProps: globalChartProps })
    setTheme((prevTheme) => ({ ...prevTheme, chartJsInitiated: true }))
  }, [theme, globalChartProps])

  return (
    <div ref={ref} className={typeof initialTheme === 'string' ? initialTheme : undefined}>
      <ThemeContext.Provider value={{ theme, globalChartProps }}>{children}</ThemeContext.Provider>
    </div>
  )
}
