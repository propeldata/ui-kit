import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, useTheme } from './ThemeProvider' // Adjust the import path as needed
import type { ThemeTokenProps } from '../../themes/theme.types' // Adjust the import path as needed

const theme: ThemeTokenProps = {
  colorPrimary: 'red',
  colorSecondary: 'blue'
  // ... other necessary theme properties
}

describe('ThemeProvider', () => {
  it('should apply the provided theme class if a string is passed as theme prop', () => {
    const themeClass = 'customTheme'
    render(
      <ThemeProvider theme={themeClass}>
        <div />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme-provider')).toHaveClass(themeClass)
  })

  it('should apply the provided theme styles if an object is passed as theme prop', () => {
    render(
      <ThemeProvider theme={theme}>
        <div />
      </ThemeProvider>
    )

    const styles = getComputedStyle(screen.getByTestId('theme-provider'))

    expect(styles.getPropertyValue('--propel-color-primary')).toBe('red')
    expect(styles.getPropertyValue('--propel-color-secondary')).toBe('blue')
  })
})

describe('useTheme', () => {
  const TestComponent = ({ container }: { container?: HTMLElement }) => {
    const { theme, chartConfig } = useTheme({ componentContainer: container })
    return (
      <div>
        Theme: {JSON.stringify(theme || 'No theme')}, ChartConfig: {JSON.stringify(chartConfig || 'No chartConfig')}
      </div>
    )
  }

  it('should return undefined if no theme is provided', () => {
    render(<TestComponent />)
    expect(screen.getByText(/No theme/i, { trim: true })).toBeInTheDocument()
  })

  it('should return the current theme and chart configuration if a theme is provided', () => {
    const div = document.createElement('div')
    div.style.setProperty('--propel-color-primary', 'red')
    div.style.setProperty('--propel-color-secondary', 'blue')

    render(<TestComponent container={div} />)
    expect(screen.getByText(/Theme: {"colorPrimary":"red","colorSecondary":"blue"}/)).toBeInTheDocument()
    expect(screen.getByText(/ChartConfig:/)).toBeInTheDocument() // Adjust this based on expected chartConfig structure
  })
})
