import { useEffect, useRef, RefCallback, RefObject, MutableRefObject } from 'react'

/**
 * Custom React hook that combines multiple refs into a single ref object.
 * This is particularly useful when you need to pass a ref to a component that already uses an internal ref.
 * The hook creates a new ref object (`targetRef`) and updates all provided refs (`refs`) to point to `targetRef.current`.
 * It handles both function refs and object refs.
 *
 * @param {...(Ref<T> | null)[]} refs - An array of refs to be combined.
 * @returns {RefObject<T>} A React ref object that is synchronized with the provided refs.
 */
export const useCombinedRefs = <T>(...refs: (MutableRefObject<T | null> | RefCallback<T> | null)[]): RefObject<T> => {
  const targetRef = useRef<T>(null)

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) {
        return
      }

      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else if ('current' in ref) {
        // Type assertion to treat ref as MutableRefObject
        const mutableRef = ref as MutableRefObject<T | null>
        mutableRef.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}
