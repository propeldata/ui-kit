/* eslint-disable @typescript-eslint/ban-ts-comment */

import { useEffect, useRef, Ref } from 'react'

export const useCombinedRefs = <T>(...refs: (Ref<T> | null)[]) => {
  const targetRef = useRef<T>(null)

  useEffect(() => {
    refs.forEach((ref) => {
      if (!ref) {
        return
      }

      if (typeof ref === 'function') {
        ref(targetRef.current)
      } else {
        // @ts-ignore
        // eslint-disable-next-line no-param-reassign
        ref.current = targetRef.current
      }
    })
  }, [refs])

  return targetRef
}
