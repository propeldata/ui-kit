export const defaultChartHeight = 200

export const defaultStyles = {
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
    borderRadius: '0px'
  },
  font: {
    color: 'inherit',
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
      locale: false,
      align: 'right',
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
  }
}

export const serverErrorMessage = {
  title: 'Unable to connect',
  body: 'Sorry we are not able to connect at this time due to a technical error.'
}
