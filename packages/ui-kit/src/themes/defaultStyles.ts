import { ChartStyles } from './default.types'

export const defaultChartHeight = 200

export const defaultStyles: ChartStyles = {
  bar: {
    thickness: 20,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#94A3B8',
    hoverBorderColor: '#64748B',
    backgroundColor: '#CBD5E1',
    hoverBackgroundColor: '#64748B'
  },
  canvas: {
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: '0px',
    hideGridLines: false
  },
  line: {
    tension: 0.4,
    borderColor: '#000',
    borderWidth: 2,
    stepped: false,
    backgroundColor: '#CBD5E1',
    hoverBorderColor: '#64748B',
    hoverBackgroundColor: '#64748B'
  },
  point: {
    style: 'circle',
    radius: 3,
    backgroundColor: '#ffffff',
    borderColor: '#000',
    borderWidth: 1,
    hoverBorderColor: '#000',
    hoverBackgroundColor: '#000'
  },
  font: {
    color: '#000',
    family: 'inherit',
    size: 'inherit',
    weight: 'inherit',
    style: 'inherit',
    lineHeight: 'inherit',
    stretch: 'inherit',
    variant: 'inherit'
  },
  tooltip: {
    display: true,
    backgroundColor: 'white',
    borderRadius: 6,
    borderColor: '#94A3B8',
    borderWidth: 2,
    color: '#94A3B8',
    padding: 8,
    alignContent: 'left',
    caretSize: 2
  },
  table: {
    width: '100%',
    height: 'inherit',
    isOrdered: false,
    hasValueBar: false,
    stickyHeader: false,
    backgroundColor: '#FFFFFF',
    padding: '5px',
    header: {
      backgroundColor: '#FFFFFF',
      align: 'left',
      font: {
        color: '#64748B',
        weight: '400',
        family: 'inherit',
        size: 'inherit',
        style: 'inherit',
        lineHeight: 'inherit'
      }
    },
    columns: {
      align: 'left',
      font: {
        color: '#1E293B',
        weight: '500',
        family: 'inherit',
        size: 'inherit',
        style: 'inherit',
        lineHeight: 'inherit'
      }
    },
    valueColumn: {
      localize: false,
      align: 'right',
      backgroundColor: '#ffffff',
      font: {
        color: '#475569',
        weight: '700',
        family: 'inherit',
        size: 'inherit',
        style: 'inherit',
        lineHeight: 'inherit'
      }
    },
    valueBar: {
      color: '#334155',
      backgroundColor: '#F1F5F9'
    }
  },
  yAxis: {
    beginAtZero: false,
    scale: 'linear'
  }
}

export const serverErrorMessage = {
  title: 'Unable to connect',
  body: 'Sorry we are not able to connect at this time due to a technical error.'
}

export const defaultAriaLabel = ''
