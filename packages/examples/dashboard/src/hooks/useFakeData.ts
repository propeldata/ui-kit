import React from 'react'

type UseFakeDataProps = {
  data: any
  isLoading: boolean
  setIsLoading: (isLoading: boolean) => void
}

export const useFakeData = (mockData: any): UseFakeDataProps => {
  const [isLoading, setIsLoading] = React.useState(true)
  const [data, setData] = React.useState()

  React.useEffect(() => {
    function fakeFetchData() {
      if (!data) {
        setTimeout(() => {
          setData(mockData)
          setIsLoading(false)
        }, 1000)
      } else {
        setData(mockData)
      }
    }

    fakeFetchData()
  }, [mockData, data])

  return { data, isLoading, setIsLoading }
}
