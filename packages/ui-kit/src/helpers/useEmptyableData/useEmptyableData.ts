import React from 'react'

export type UseEmptyableDataProps<T> = {
  isDataEmpty: (data: T) => boolean
  onEmptyData: () => void
}

/**
 * Returns a getter and setter for `data` where, whenever `data` changes.
 *
 * 1. Check if `data` is empty, using a user-supplied function `isDateEmpty`.
 * 2. If it's empty, call a user-supplied function `onEmptyData`.
 *
 * Returns also a getter for whether the data is empty (`isEmptyState`).
 */

export const useEmptyableData = <T>({ onEmptyData, isDataEmpty }: UseEmptyableDataProps<T>) => {
  const [isEmptyState, setIsEmptyState] = React.useState(false)
  const [data, setData] = React.useState<T | undefined>()

  React.useEffect(() => {
    const isEmptyStateVal = !data || isDataEmpty(data)

    setIsEmptyState(isEmptyStateVal)

    if (isEmptyStateVal) {
      onEmptyData()
      return
    }
  }, [data, onEmptyData, isDataEmpty])

  return {
    data,
    setData,
    isEmptyState
  }
}
