import { Styles } from './types'

export const defaultChartHeight = 200

export const defaultStyles: Styles = {
  bar: {
    thickness: 20,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#94A3B8',
    hoverBorderColor: '#64748B',
    backgroundColor: '#CBD5E1',
    hoverBackgroundColor: '#64748B'
  },
  line: {
    tension: 0.4,
    borderColor: '#94A3B8',
    borderWidth: 2,
    stepped: false
  },
  canvas: {
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: '0px'
  },
  font: {
    color: '#475569',
    family: 'inherit',
    size: 'inherit',
    weight: 'inherit',
    style: 'inherit',
    lineHeight: 'inherit'
  },
  tooltip: {
    display: true,
    backgroundColor: 'white',
    borderRadius: 6,
    borderColor: 'cornflowerblue',
    borderWidth: 2,
    color: 'cornflowerblue',
    padding: 8,
    alignContent: 'left',
    caretSize: 2
  },
  point: {
    style: 'circle',
    radius: 3,
    backgroundColor: '#ffffff',
    borderColor: '#000',
    borderWidth: 1,
    hoverBorderColor: 'rgba(0,0,0,0)',
    hoverBackgroundColor: 'rgba(0,0,0,0)'
  }
}

export const serverErrorMessage = {
  title: 'Unable to connect',
  body: 'Sorry we are not able to connect at this time due to a technical error.'
}
