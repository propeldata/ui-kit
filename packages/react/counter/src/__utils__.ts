import { gql } from 'graphql-request'

export const DEFAULT_PROPEL_API = 'https://api.us-east-2.dev.propeldata.com/graphql'

export const QUERY = gql`
  query Counter($counterInput: CounterInput!, $uniqueName: String!) {
    metricByName(uniqueName: $uniqueName) {
      counter(input: $counterInput) {
        value
      }
    }
  }
`

export const getValueWithPrefixAndSufix = (params: { prefix?: string; value: string; sufix?: string }) => {
  const { prefix, value, sufix } = params

  return (prefix ? prefix + ' ' : '') + value + (sufix ? ' ' + sufix : '')
}
