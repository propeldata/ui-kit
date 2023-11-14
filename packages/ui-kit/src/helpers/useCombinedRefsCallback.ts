import { useState, useCallback } from 'react'
import { useCombinedRefs } from './useCombinedRefs'

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
