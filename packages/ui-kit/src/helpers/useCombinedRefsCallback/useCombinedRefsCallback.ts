import { useState, useCallback, Ref, MutableRefObject } from 'react'
import { useCombinedRefs } from '../useCombinedRefs'

/**
 * Custom React hook that creates a combined ref and provides a callback to set it.
 * It utilizes `useCombinedRefs` to merge `forwardedRef` and `innerRef` into a single ref (`combinedRef`).
 * Additionally, it manages a state (`componentContainer`) to store the DOM element associated with the ref.
 * The `setRef` callback is used to update both the `componentContainer` state and the `combinedRef`.
 * This hook is useful for components that need to expose their DOM node to parent components while maintaining an internal ref.
 *
 * @param {Ref<HTMLElement>} forwardedRef - The forwarded ref.
 * @param {Ref<HTMLElement>} innerRef - The internal ref.
 * @returns An object containing `componentContainer`, `combinedRef`, and `setRef`.
 */
export const useCombinedRefsCallback = ({
  forwardedRef,
  innerRef
}: {
  forwardedRef: Ref<HTMLElement>
  innerRef: Ref<HTMLElement>
}) => {
  const combinedRef = useCombinedRefs(forwardedRef, innerRef)
  const [componentContainer, setComponentContainer] = useState<HTMLElement | null>(null)

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      if (node !== null) {
        setComponentContainer(node)
        ;(combinedRef as MutableRefObject<HTMLElement | null>).current = node
      }
    },
    [combinedRef]
  )

  return { componentContainer, combinedRef, setRef }
}
