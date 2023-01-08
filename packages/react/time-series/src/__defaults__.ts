import { BarStyles } from './__types__'

export const stylesInitialState: BarStyles = {
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
}
