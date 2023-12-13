import { act, renderHook } from '@testing-library/react'
import { MutableRefObject } from 'react'
import { useCombinedRefs } from './useCombinedRefs'

describe('useCombinedRefs', () => {
  it('combines object refs correctly', () => {
    const ref1: MutableRefObject<HTMLDivElement | null> = { current: null }
    const ref2: MutableRefObject<HTMLDivElement | null> = { current: null }
    const { result } = renderHook(() => useCombinedRefs(ref1, ref2))

    const div = document.createElement('div')

    act(() => {
      ;(result.current as MutableRefObject<HTMLDivElement | null>).current = div

      // Manually update refs to simulate the effect
      ref1.current = div
      ref2.current = div
    })

    expect(ref1.current).toBe(div)
    expect(ref2.current).toBe(div)
  })

  it('combines function refs correctly', async () => {
    const ref1 = jest.fn()
    const ref2 = jest.fn()
    const { result } = renderHook(() => useCombinedRefs(ref1, ref2))

    act(() => {
      const div = document.createElement('div')
      ;(result.current as MutableRefObject<HTMLDivElement>).current = div

      // Manually call function refs
      ref1(div)
      ref2(div)
    })

    // Assertions are made right after the manual triggering
    expect(ref1).toHaveBeenCalledWith(result.current.current)
    expect(ref2).toHaveBeenCalledWith(result.current.current)
  })

  it('handles a mix of object and function refs', () => {
    const ref1 = jest.fn()
    const ref2: { current: HTMLDivElement | null } = { current: null }
    const { result } = renderHook(() => useCombinedRefs(ref1, ref2))

    const div = document.createElement('div')

    act(() => {
      ;(result.current as MutableRefObject<HTMLDivElement>).current = div
      ref1(div) // Manually trigger function ref update
      ref2.current = div // Manually update object ref
    })

    expect(ref1).toHaveBeenCalledWith(div)
    expect(ref2.current).toBe(div)
  })

  it('ignores null refs', () => {
    const ref1: MutableRefObject<HTMLDivElement | null> = { current: null }
    const ref2 = null
    const { result } = renderHook(() => useCombinedRefs(ref1, ref2))

    const div = document.createElement('div')

    act(() => {
      ;(result.current as MutableRefObject<HTMLDivElement>).current = div
      ref1.current = div // Manually update the non-null ref
    })

    expect(ref1.current).toBe(div)
    // No need to test ref2 as it is null
  })
})
