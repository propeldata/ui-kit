import React, { createContext, useContext, useState } from 'react'

type ThemeContextProps = {
  themeObj?: Theme
  theme?: string | Theme
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined)

type ThemeProviderProps = {
  children?: React.ReactNode
  theme?: string | Theme
}

type ThemeProps = 'bgColor' | 'textColor'

type ThemeObjDictProps = {
  name: ThemeProps
  cssVarName: string
}

const themeObjDict: ThemeObjDictProps[] = [
  { name: 'bgColor', cssVarName: '--propel-bg-color' },
  { name: 'textColor', cssVarName: '--propel-text-color' }
]

type Theme = {
  bgColor?: string
  textColor?: string
}

const parseComputedStyle = (themeContainer: HTMLElement) => {
  const computedStyle = getComputedStyle(themeContainer)
  const themeObj: Theme = {}

  themeObjDict.forEach((item) => {
    const cssVarValue = computedStyle.getPropertyValue(item.cssVarName)
    if (cssVarValue) {
      themeObj[item.name] = cssVarValue
    }
  })
  return themeObj
}

const setContainerStyle = (themeContainer: HTMLElement, theme: Theme) => {
  themeObjDict.forEach((item) => {
    const themePropValue = theme[item.name]
    if (themePropValue) {
      themeContainer.style.setProperty(item.cssVarName, themePropValue)
    }
  })
}

export const useTheme = (): { themeObj?: Theme; theme?: Theme | string } => {
  const context = useContext(ThemeContext)

  if (!context) {
    return { themeObj: parseComputedStyle(document.body) }
  }

  return context
}

export const ThemeProvider = ({ children, theme }: ThemeProviderProps) => {
  const [themeObj, setThemeObj] = useState<Theme | undefined>()
  const ref = React.useRef(null)

  React.useEffect(() => {
    if (!(ref.current && theme)) {
      return
    }

    if (typeof theme === 'string') {
      setThemeObj(parseComputedStyle(ref.current))
      return
    }

    setContainerStyle(ref.current, theme)
    setThemeObj(theme)
  }, [ref, theme])

  return (
    <div ref={ref} className={typeof theme === 'string' ? theme : undefined}>
      <ThemeContext.Provider value={{ themeObj, theme }}>{children}</ThemeContext.Provider>
    </div>
  )
}
