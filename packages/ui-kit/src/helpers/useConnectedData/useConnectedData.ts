import React from 'react'

export type UseConnectedDataProps<T> = {
  isDataEmpty: (data: T) => boolean
  destroyChart: () => void
}

export const useConnectedData = <T>({ destroyChart, isDataEmpty }: UseConnectedDataProps<T>) => {
  const [isEmptyState, setIsEmptyState] = React.useState(false)
  const [data, setData] = React.useState<T | undefined>()

  React.useEffect(() => {
    const isEmptyStateVal = !data || isDataEmpty(data)

    setIsEmptyState(isEmptyStateVal)

    if (isEmptyStateVal) {
      destroyChart()
      return
    }
  }, [data, destroyChart, isDataEmpty])

  return {
    data,
    setData,
    isEmptyState,
    setIsEmptyState
  }
}
