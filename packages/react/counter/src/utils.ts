import { gql } from 'graphql-request'

import { Position } from './types'

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

export const getTextAlignByPosition = (position: Position) => {
  return {
    [Position.Center]: 'center',
    [Position.CenterLeft]: 'left',
    [Position.CenterRight]: 'right',
    [Position.TopCenter]: 'center',
    [Position.TopLeft]: 'left',
    [Position.TopRight]: 'right',
    [Position.BottomCenter]: 'center',
    [Position.BottomLeft]: 'left',
    [Position.BottomRight]: 'right'
  }[position]
}

export const getJustifyContentByPosition = (position: Position) => {
  return {
    [Position.Center]: 'center',
    [Position.CenterLeft]: 'flex-start',
    [Position.CenterRight]: 'flex-end',
    [Position.TopCenter]: 'center',
    [Position.TopLeft]: 'flex-start',
    [Position.TopRight]: 'flex-end',
    [Position.BottomCenter]: 'center',
    [Position.BottomLeft]: 'flex-start',
    [Position.BottomRight]: 'flex-end'
  }[position]
}

export const getAlignItemsByPosition = (position: Position) => {
  return {
    [Position.Center]: 'center',
    [Position.CenterLeft]: 'center',
    [Position.CenterRight]: 'center',
    [Position.TopCenter]: 'flex-start',
    [Position.TopLeft]: 'flex-start',
    [Position.TopRight]: 'flex-start',
    [Position.BottomCenter]: 'flex-end',
    [Position.BottomLeft]: 'flex-end',
    [Position.BottomRight]: 'flex-end'
  }[position]
}

export const getValueWithPrefixAndSufix = (params: { prefix?: string; value: string; sufix?: string }) => {
  const { prefix, value, sufix } = params

  return (prefix ? prefix + ' ' : '') + value + (sufix ? ' ' + sufix : '')
}
