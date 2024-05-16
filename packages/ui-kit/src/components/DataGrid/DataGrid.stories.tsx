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
    defaultPageSize: 10,
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

export const Static: Story = {
  args: {
    defaultPageSize: 10,
    headers: ['taco_name', 'restaurant_name', 'tortilla_name', 'restaurant_id', 'sauce_id'],
    rows: [
      [
        'Al Pastor',
        'La Taqueria',
        'Spinach',
        'f38ed454-a907-43b4-b362-cd4dd197dd03',
        'a37d3001-f953-47e3-b1ed-149f8897d094'
      ],
      [
        'Breakfast',
        'La Taqueria',
        'Corn',
        'f38ed454-a907-43b4-b362-cd4dd197dd03',
        'e3643b7e-c287-45b2-80c3-b93c82840b46'
      ],
      [
        'Pollo',
        'Taqueria Cancun',
        'Flour',
        '9bdde1f8-cbe2-4dba-bca1-14352a152173',
        '9f940297-3ba7-4389-86af-f63c6416c405'
      ],
      [
        'Al Pastor',
        'Taqueria Cancun',
        'Whole Wheat',
        '9bdde1f8-cbe2-4dba-bca1-14352a152173',
        'a3b1f97d-b4cc-479c-9a7e-cc3751747f97'
      ],
      [
        'Veggie',
        'Taqueria Cancun',
        'Spinach',
        '9bdde1f8-cbe2-4dba-bca1-14352a152173',
        'a3b1f97d-b4cc-479c-9a7e-cc3751747f97'
      ],
      [
        'Chorizo',
        'Taqueria Cancun',
        'Whole Wheat',
        '9bdde1f8-cbe2-4dba-bca1-14352a152173',
        '25cdef0f-c358-4788-9645-f9625b9a219f'
      ],
      [
        'Barbacoa',
        'Taqueria Cancun',
        'Whole Wheat',
        '9bdde1f8-cbe2-4dba-bca1-14352a152173',
        'a3b1f97d-b4cc-479c-9a7e-cc3751747f97'
      ],
      [
        'Breakfast',
        'Taqueria Cancun',
        'Flour',
        '9bdde1f8-cbe2-4dba-bca1-14352a152173',
        '9f940297-3ba7-4389-86af-f63c6416c405'
      ],
      [
        'Fish',
        'Taqueria Cancun',
        'Nopal',
        '9bdde1f8-cbe2-4dba-bca1-14352a152173',
        'eb08c249-6855-4074-a476-75ecce863a7c'
      ],
      [
        'Carnitas',
        'Taqueria Cancun',
        'Nopal',
        '9bdde1f8-cbe2-4dba-bca1-14352a152173',
        'a3b1f97d-b4cc-479c-9a7e-cc3751747f97'
      ],
      [
        'Barbacoa',
        'Taqueria Cancun',
        'Whole Wheat',
        '9bdde1f8-cbe2-4dba-bca1-14352a152173',
        'a3b1f97d-b4cc-479c-9a7e-cc3751747f97'
      ],
      [
        'Breakfast',
        'Taqueria Cancun',
        'Flour',
        '9bdde1f8-cbe2-4dba-bca1-14352a152173',
        '9f940297-3ba7-4389-86af-f63c6416c405'
      ],
      [
        'Fish',
        'Taqueria Cancun',
        'Nopal',
        '9bdde1f8-cbe2-4dba-bca1-14352a152173',
        'eb08c249-6855-4074-a476-75ecce863a7c'
      ],
      [
        'Carnitas',
        'Taqueria Cancun',
        'Nopal',
        '9bdde1f8-cbe2-4dba-bca1-14352a152173',
        'a3b1f97d-b4cc-479c-9a7e-cc3751747f97'
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
