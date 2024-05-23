import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import axiosInstance from '../../../../../app/storybook/src/axios'
import { storybookCodeTemplate, useStorybookAccessToken } from '../../helpers'

import { DataGridComponent, DataGrid as DataGridSource } from './DataGrid'

const DataGrid = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)
  const ref = React.useRef(null)

  if (!accessToken && args?.query) {
    return null
  }

  return (
    <DataGridSource
      ref={ref}
      {...{
        ...args,
        query: args?.query
          ? {
              ...args?.query,
              accessToken
            }
          : undefined
      }}
    />
  )
}

const meta: Meta<typeof DataGridComponent> = {
  title: 'Components/DataGrid',
  component: DataGridComponent,
  argTypes: {
    baseTheme: {
      table: {
        disable: true
      }
    }
  },
  parameters: {
    controls: { sort: 'alpha' },
    // imports: 'Leaderboard, RelativeTimeRange',
    // transformBody: (body: string) => body.replace(quotedStringRegex('LAST_N_DAYS'), 'RelativeTimeRange.LastNDays'),
    codeTemplate: storybookCodeTemplate
  }
}

type Story = StoryObj<typeof DataGridComponent>

export default meta

export const Connected: Story = {
  args: {
    query: {
      dataPool: {
        id: 'DPO01HB9W3DCA1756WT6CJ6BV9H48'
      },
      columns: ['taco_name']
    },
    paginationProps: {
      defaultPageSize: 10
    },
    // cellProps: {
    //   style: {
    //     textOverflow: 'ellipsis',
    //     overflow: 'auto',
    //     whiteSpace: 'nowrap',
    //     textWrap: 'nowrap'
    //   }
    // },
    // tableProps: {
    //   style: {
    //     width: 'max-content'
    //   }
    // },
    resizable: false
  },
  render: (args) => (
    <div style={{ width: '100%', maxHeight: '600px' }}>
      <DataGrid {...args} />
    </div>
  )
}

export const Static: Story = {
  args: {
    paginationProps: {
      defaultPageSize: 10
    },
    headers: ['taco_name', 'restaurant_name', 'tortilla_name', 'restaurant_id', 'sauce_id'],
    rows: [
      [
        'Al Pastor',
        'La Taqueria',
        'Spinach',
        'f38ed454-a907-43b4-b362-cd4dd197dd03',
        'a37d3001-f953-47e3-b1ed-149f8897d094'
      ]
    ],

    // cellProps: {
    //   style: {
    //     textOverflow: 'ellipsis',
    //     overflow: 'auto',
    //     whiteSpace: 'nowrap',
    //     textWrap: 'nowrap'
    //   }
    // },
    // tableProps: {
    //   style: {
    //     width: 'max-content'
    //   }
    // },
    resizable: true
  },
  render: (args) => (
    <div style={{ width: '100%', maxHeight: '600px' }}>
      <DataGrid {...args} />
    </div>
  )
}
