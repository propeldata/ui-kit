import React from 'react'
import { render, screen } from '@testing-library/react'
import { ThemeProvider, useSetupTheme } from './ThemeProvider'
import type { ThemeTokenProps } from '../../themes/theme.types'
import { FallbackComponents } from '../shared.types'
import { Loader } from '../Loader'
import { ErrorFallback } from '../ErrorFallback'

const theme: ThemeTokenProps = {
  foregroundBrandPrimary: 'red',
  borderPrimary: 'blue'
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

    expect(styles.getPropertyValue('--propel-foreground-brand-primary')).toBe('red')
    expect(styles.getPropertyValue('--propel-border-primary')).toBe('blue')
  })
})

describe('useSetupTheme', () => {
  interface TestComponentProps extends FallbackComponents {
    container?: HTMLElement
    enableFallback?: 'loader' | 'error' | 'empty'
  }

  const TestComponent: React.FC<TestComponentProps> = ({
    container,
    renderLoader,
    errorFallback,
    renderEmpty,
    enableFallback
  }) => {
    const {
      theme,
      chartConfig,
      renderLoader: renderLoaderComponent,
      errorFallback: errorFallbackComponent,
      renderEmpty: renderEmptyComponent
    } = useSetupTheme({ componentContainer: container, renderLoader, errorFallback, renderEmpty })

    if (enableFallback === 'loader' && renderLoaderComponent) {
      return typeof renderLoaderComponent === 'function'
        ? renderLoaderComponent({ loaderProps: {}, Loader, theme })
        : renderLoaderComponent
    }

    if (enableFallback === 'error' && errorFallbackComponent) {
      return typeof errorFallbackComponent === 'function'
        ? errorFallbackComponent({ errorFallbackProps: {}, ErrorFallback, theme })
        : errorFallbackComponent
    }

    if (enableFallback === 'empty' && renderEmptyComponent) {
      return typeof renderEmptyComponent === 'function' ? renderEmptyComponent({ theme }) : renderEmptyComponent
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
    div.style.setProperty('--propel-foreground-brand-primary', 'red')
    div.style.setProperty('--propel-border-primary', 'blue')

    render(<TestComponent container={div} />)
    expect(screen.getByText(/Theme: {"borderPrimary":"blue","foregroundBrandPrimary":"red"}/)).toBeInTheDocument()
    expect(screen.getByText(/ChartConfig:/)).toBeInTheDocument() // Adjust this based on expected chartConfig structure
  })

  it('should render empty fallback content when provided as a ThemeProvider prop', () => {
    const renderEmptyContent = 'No data available'

    render(
      <ThemeProvider renderEmpty={() => <div>{renderEmptyContent}</div>}>
        <TestComponent enableFallback="empty" />
      </ThemeProvider>
    )

    expect(screen.getByText(renderEmptyContent)).toBeInTheDocument()
  })

  it('should render empty fallback content when provided as a component prop, overriding ThemeProvider fallback settings', () => {
    const renderEmptyContent = 'No data available'

    render(
      <ThemeProvider renderEmpty={() => <div>Global Empty State fallback</div>}>
        <TestComponent enableFallback="empty" renderEmpty={() => <div>{renderEmptyContent}</div>} />
      </ThemeProvider>
    )

    expect(screen.getByText(renderEmptyContent)).toBeInTheDocument()
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
    const renderLoaderContent = 'Loading...'

    render(
      <ThemeProvider renderLoader={() => <div>{renderLoaderContent}</div>}>
        <TestComponent enableFallback="loader" />
      </ThemeProvider>
    )

    expect(screen.getByText(renderLoaderContent)).toBeInTheDocument()
  })

  it('should render loader fallback content when provided as a component prop, overriding ThemeProvider fallback settings', () => {
    const renderLoaderContent = 'Loading...'

    render(
      <ThemeProvider renderLoader={() => <div>Global Loader fallback</div>}>
        <TestComponent enableFallback="loader" renderLoader={() => <div>{renderLoaderContent}</div>} />
      </ThemeProvider>
    )

    expect(screen.getByText(renderLoaderContent)).toBeInTheDocument()
  })
})
