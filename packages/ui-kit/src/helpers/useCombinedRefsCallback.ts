import { useState, useCallback } from 'react'
import { useCombinedRefs } from './useCombinedRefs'

/**
 * Custom React hook that creates a combined ref and provides a callback to set it.
 * It utilizes `useCombinedRefs` to merge `forwardedRef` and `innerRef` into a single ref (`combinedRef`).
 * Additionally, it manages a state (`componentContainer`) to store the DOM element associated with the ref.
 * The `setRef` callback is used to update both the `componentContainer` state and the `combinedRef`.
 * This hook is useful for components that need to expose their DOM node to parent components while maintaining an internal ref.
 *
 * @param {object} { forwardedRef, innerRef } - An object containing the refs to be combined.
 * @returns {object} An object containing `componentContainer`, `combinedRef`, and `setRef`.
 */
export const useCombinedRefsCallback = ({ forwardedRef, innerRef }) => {
  const combinedRef = useCombinedRefs(forwardedRef, innerRef)
  const [componentContainer, setComponentContainer] = useState<HTMLElement | null>(null)

  const setRef = useCallback(
    (node) => {
      if (node !== null) {
        setComponentContainer(node)
        combinedRef.current = node
      }
    },
    [combinedRef]
  )

  return { componentContainer, combinedRef, setRef }
}
