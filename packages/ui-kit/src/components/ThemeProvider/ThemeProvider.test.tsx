import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, useSetupTheme } from './ThemeProvider'
import type { ThemeTokenProps } from '../../themes/theme.types'
import { FallbackComponents } from '../shared.types'
import { Loader } from '../Loader'
import { ErrorFallback } from '../ErrorFallback'

const theme: ThemeTokenProps = {
  colorPrimary: 'red',
  colorSecondary: 'blue'
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

describe('useSetupTheme', () => {
  interface TestComponentProps extends FallbackComponents {
    container?: HTMLElement
    enableFallback?: 'loader' | 'error' | 'empty'
  }

  const TestComponent: React.FC<TestComponentProps> = ({
    container,
    loaderFallback,
    errorFallback,
    emptyFallback,
    enableFallback
  }) => {
    const {
      theme,
      chartConfig,
      loaderFallback: loaderFallbackComponent,
      errorFallback: errorFallbackComponent,
      emptyFallback: emptyFallbackComponent
    } = useSetupTheme({ componentContainer: container, loaderFallback, errorFallback, emptyFallback })

    if (enableFallback === 'loader' && loaderFallbackComponent) {
      return typeof loaderFallbackComponent === 'function'
        ? loaderFallbackComponent({ loaderProps: {}, Loader, theme })
        : loaderFallbackComponent
    }

    if (enableFallback === 'error' && errorFallbackComponent) {
      return typeof errorFallbackComponent === 'function'
        ? errorFallbackComponent({ errorFallbackProps: {}, ErrorFallback, theme })
        : errorFallbackComponent
    }

    if (enableFallback === 'empty' && emptyFallbackComponent) {
      return typeof emptyFallbackComponent === 'function' ? emptyFallbackComponent({ theme }) : emptyFallbackComponent
    }

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

  it('should render empty fallback content when provided as a ThemeProvider prop', () => {
    const emptyFallbackContent = 'No data available'

    render(
      <ThemeProvider emptyFallback={() => <div>{emptyFallbackContent}</div>}>
        <TestComponent enableFallback="empty" />
      </ThemeProvider>
    )

    expect(screen.getByText(emptyFallbackContent)).toBeInTheDocument()
  })

  it('should render empty fallback content when provided as a component prop, overriding ThemeProvider fallback settings', () => {
    const emptyFallbackContent = 'No data available'

    render(
      <ThemeProvider emptyFallback={() => <div>Global Empty State fallback</div>}>
        <TestComponent enableFallback="empty" emptyFallback={() => <div>{emptyFallbackContent}</div>} />
      </ThemeProvider>
    )

    expect(screen.getByText(emptyFallbackContent)).toBeInTheDocument()
  })

  it('should render error fallback content when provided as a ThemeProvider prop', () => {
    const errorFallbackContent = 'An error occurred'

    render(
      <ThemeProvider errorFallback={() => <div>{errorFallbackContent}</div>}>
        <TestComponent enableFallback="error" />
      </ThemeProvider>
    )

    expect(screen.getByText(errorFallbackContent)).toBeInTheDocument()
  })

  it('should render error fallback content when provided as a component prop, overriding ThemeProvider fallback settings', () => {
    const errorFallbackContent = 'An error occurred'

    render(
      <ThemeProvider errorFallback={() => <div>Global Error fallback</div>}>
        <TestComponent enableFallback="error" errorFallback={() => <div>{errorFallbackContent}</div>} />
      </ThemeProvider>
    )

    expect(screen.getByText(errorFallbackContent)).toBeInTheDocument()
  })

  it('should render loader fallback content when provided as a ThemeProvider prop', () => {
    const loaderFallbackContent = 'Loading...'

    render(
      <ThemeProvider loaderFallback={() => <div>{loaderFallbackContent}</div>}>
        <TestComponent enableFallback="loader" />
      </ThemeProvider>
    )

    expect(screen.getByText(loaderFallbackContent)).toBeInTheDocument()
  })

  it('should render loader fallback content when provided as a component prop, overriding ThemeProvider fallback settings', () => {
    const loaderFallbackContent = 'Loading...'

    render(
      <ThemeProvider loaderFallback={() => <div>Global Loader fallback</div>}>
        <TestComponent enableFallback="loader" loaderFallback={() => <div>{loaderFallbackContent}</div>} />
      </ThemeProvider>
    )

    expect(screen.getByText(loaderFallbackContent)).toBeInTheDocument()
  })
})
