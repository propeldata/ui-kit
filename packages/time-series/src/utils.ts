import { gql } from 'graphql-request'

import { stylesInitialState } from './styles'

export const DEFAULT_PROPEL_API = 'https://api.us-east-2.dev.propeldata.com/graphql'

export const QUERY = gql`
  query TimeSeries($uniqueName: String!, $timeSeriesInput: TimeSeriesInput!) {
    metricByName(uniqueName: $uniqueName) {
      timeSeries(input: $timeSeriesInput) {
        labels
        values
      }
    }
  }
`

export const chartStylesConverter = (receivedValue: string | null) => {
  const parsedValue = receivedValue ? JSON.parse(receivedValue) : {}

  return {
    ...stylesInitialState,
    ...parsedValue
  }
}
