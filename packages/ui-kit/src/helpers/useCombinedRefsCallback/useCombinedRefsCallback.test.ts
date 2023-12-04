import { renderHook, act } from '@testing-library/react'
import { useCombinedRefsCallback } from './useCombinedRefsCallback'

describe('useCombinedRefsCallback', () => {
  it('updates component container and combined ref correctly', () => {
    const forwardedRef: { current: HTMLElement | null } = { current: null }
    const innerRef: { current: HTMLElement | null } = { current: null }

    const { result } = renderHook(() => useCombinedRefsCallback({ forwardedRef, innerRef }))

    const div = document.createElement('div')

    act(() => {
      result.current.setRef(div)
    })

    expect(result.current.componentContainer).toBe(div)
    expect(forwardedRef.current).toBe(div)
    expect(innerRef.current).toBe(div)
  })

  it('does not update refs if node is null', () => {
    const forwardedRef: { current: HTMLElement | null } = { current: null }
    const innerRef: { current: HTMLElement | null } = { current: null }

    const { result } = renderHook(() => useCombinedRefsCallback({ forwardedRef, innerRef }))

    act(() => {
      result.current.setRef(null)
    })

    expect(result.current.componentContainer).toBeNull()
    expect(forwardedRef.current).toBeNull()
    expect(innerRef.current).toBeNull()
  })
})
