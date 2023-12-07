import React from 'react'
import { render } from '@testing-library/react'
import { useForwardedRefCallback } from './useForwardedRefCallback' // Adjust the import path as needed

describe('useForwardedRefCallback', () => {
  it('updates the forwarded ref with the DOM node', () => {
    const TestComponent = React.forwardRef<HTMLDivElement>((_, ref) => {
      const { setRef } = useForwardedRefCallback<HTMLDivElement>(ref)
      return <div ref={setRef} />
    })
    TestComponent.displayName = 'TestComponent'

    const ref = React.createRef<HTMLDivElement>()
    render(<TestComponent ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLElement)
    expect(ref.current?.tagName).toBe('DIV')
  })

  it('updates the component container state with the DOM node', () => {
    const TestComponentWithContainer = React.forwardRef<HTMLDivElement>((_, ref) => {
      const [, setContainer] = React.useState<HTMLDivElement | null>(null)
      const { setRef } = useForwardedRefCallback<HTMLDivElement>(ref)

      return (
        <div
          ref={(node) => {
            setContainer(node)
            setRef(node)
          }}
        />
      )
    })
    TestComponentWithContainer.displayName = 'TestComponent'

    const ref = React.createRef<HTMLDivElement>()
    render(<TestComponentWithContainer ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLDivElement)
    expect(ref.current?.tagName).toBe('DIV')
  })
})
