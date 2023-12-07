import { useState, useCallback, ForwardedRef, MutableRefObject } from 'react'

/**
 * Custom React hook that manages a component container state and updates a forwarded ref.
 * This hook is particularly useful in scenarios where a component needs to expose its DOM node to a parent component via a ref.
 * It offers a clean way to manage the forwarded ref and synchronize it with a local state.
 *
 * The hook creates a `componentContainer` state to store the DOM element associated with the ref.
 * The `setRef` callback is used to update this state and the forwarded ref. This is especially useful for components
 * that require direct DOM access or need to provide such access to their parent components.
 *
 * @param {ForwardedRef<T>} forwardedRef - The forwarded ref, typically provided by React.forwardRef.
 * @returns An object containing `componentContainer`, `ref`, and `setRef`.
 *          `componentContainer` is the stateful reference to the component's DOM node.
 *          `ref` is a mutable reference object that points to the same DOM node.
 *          `setRef` is a callback function to set the ref's current value.
 */
export const useForwardedRefCallback = <T>(forwardedRef: ForwardedRef<T>) => {
  const [componentContainer, setComponentContainer] = useState<T | null>(null)

  const setRef = useCallback(
    (node: T | null) => {
      if (node !== null) {
        setComponentContainer(node)

        // Update the forwardedRef with the new node
        if (typeof forwardedRef === 'function') {
          forwardedRef(node)
        } else if (forwardedRef !== null) {
          ;(forwardedRef as MutableRefObject<T | null>).current = node
        }
      }
    },
    [forwardedRef]
  )

  return { componentContainer, ref: forwardedRef as MutableRefObject<T | null>, setRef }
}
