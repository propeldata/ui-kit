import { render } from '@testing-library/react'
import React from 'react'
import type { ThemeTokenProps } from '../../themes/theme.types'
import { ThemeProvider, useTheme } from './ThemeProvider'

const theme: ThemeTokenProps = {
  colorPrimary: 'red',
  colorSecondary: 'blue'
}

describe('ThemeProvider', () => {
  it('should apply the provided theme class if a string is passed as theme prop', () => {
    const themeClass = 'customTheme'
    const { container } = render(
      <ThemeProvider theme={themeClass}>
        <div />
      </ThemeProvider>
    )

    expect(container.firstChild).toHaveClass(themeClass)
  })

  it('should apply the provided theme styles if an object is passed as theme prop', () => {
    const { container } = render(
      <ThemeProvider theme={theme}>
        <div />
      </ThemeProvider>
    )

    const styles = getComputedStyle(container.firstChild as Element)

    expect(styles.getPropertyValue('--propel-color-primary')).toBe('red')
    expect(styles.getPropertyValue('--propel-color-secondary')).toBe('blue')
  })
})

describe('useTheme', () => {
  const TestComponent = ({ container }: { container?: HTMLElement }) => {
    const theme = useTheme({ componentContainer: container })
    return <div>{JSON.stringify(theme || 'No theme')}</div>
  }

  it('should return undefined if no theme is provided', () => {
    const { getByText } = render(<TestComponent />)
    expect(getByText(/No theme/i, { trim: true })).toBeInTheDocument()
  })

  it('should return the current theme if a theme is provided', () => {
    const div = document.createElement('div')
    div.style.setProperty('--propel-color-primary', 'red')
    div.style.setProperty('--propel-color-secondary', 'blue')

    const { getByText } = render(<TestComponent container={div} />)
    expect(getByText(JSON.stringify(theme))).toBeInTheDocument()
  })
})
