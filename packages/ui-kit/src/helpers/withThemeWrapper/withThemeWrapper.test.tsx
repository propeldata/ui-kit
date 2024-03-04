import React from 'react'
import { render, screen } from '@testing-library/react'
import { withThemeWrapper } from './withThemeWrapper'
import { useForwardedRefCallback } from '../useForwardedRefCallback'

describe('withThemeWrapper', () => {
  const setRefMock = jest.fn()
  const wrapperRef = React.createRef<HTMLDivElement>()

  const WrappedComponent = React.forwardRef<HTMLDivElement, object>((_, forwardedRef) => {
    const { ref, setRef } = useForwardedRefCallback(forwardedRef)

    React.useEffect(() => {
      setRefMock(ref.current)
    }, [ref])

    const themeWrapper = withThemeWrapper(setRef)

    return themeWrapper(<span>Wrapped Component</span>)
  })
  WrappedComponent.displayName = 'WrappedComponent'

  it('renders the wrapped component with properly initilized ref', () => {
    render(<WrappedComponent ref={wrapperRef} />)

    expect(screen.getByText('Wrapped Component')).toBeInTheDocument()
    expect(setRefMock).toHaveBeenCalledWith(expect.any(HTMLDivElement))
  })
})
