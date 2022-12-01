import { css } from 'lit'

export const stylesInitialState = {
  variant: 'bar',
  border: {
    width: 10,
    radius: 2,
    color: '#94A3B8',
    hoverColor: '#64748B'
  },
  background: {
    color: '#CBD5E1',
    hoverColor: '#64748B'
  },
  canvas: {
    width: '100%',
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
  }
} as const

export const scopedStyles = css`
  .chart-container {
    height: 100%;
    width: 100%;
  }
`
