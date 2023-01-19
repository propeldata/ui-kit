import { Styles } from './types'

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
    family: "'Helvetica Neue', 'Helvetica', 'Arial', sans-serif",
    size: 12,
    weight: '500',
    style: 'normal',
    lineHeight: 1
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
    style: 'circle'
  }
}
