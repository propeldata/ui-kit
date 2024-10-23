import React from 'react'
import { Meta, StoryObj } from '@storybook/react'

import axiosInstance from '../../../../../app/storybook/src/axios'
import { storybookCodeTemplate, useStorybookAccessToken } from '../../helpers'

import { DataGridComponent, DataGrid as DataGridSource } from './DataGrid'
import { ThemeProvider } from '../ThemeProvider'

const DataGrid = (args: Story['args']) => {
  const { accessToken } = useStorybookAccessToken(axiosInstance)
  const ref = React.useRef(null)

  if (!accessToken && args?.query) {
    return null
  }

  return (
    <ThemeProvider>
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
    </ThemeProvider>
  )
}

const meta: Meta<typeof DataGridComponent> = {
  title: 'Components/DataGrid',
  component: DataGridComponent,
  argTypes: {},
  parameters: {
    controls: { sort: 'alpha' },
    codeTemplate: storybookCodeTemplate
  }
}

type Story = StoryObj<typeof DataGridComponent>

export default meta

export const Basic: Story = {
  args: {
    query: {
      dataPool: {
        name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1 ?? ''
      },
      columns: ['taco_name', 'restaurant_name', 'tortilla_name', 'restaurant_id', 'sauce_id']
    },
    paginationProps: {
      defaultPageSize: 50
    },
    card: true,
    style: { maxHeight: 400 },
    resizable: false,
    slotProps: {}
  },
  render: (args) => <DataGrid {...args} />
}

export const Vertical: Story = {
  args: {
    query: {
      dataPool: {
        name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1 ?? ''
      },
      columns: ['taco_name', 'restaurant_name', 'tortilla_name', 'restaurant_id', 'sauce_id']
    },
    paginationProps: {
      defaultPageSize: 50
    },
    resizable: false,
    card: true,
    style: { maxHeight: 400 },
    tableLinesLayout: 'vertical'
  },
  render: (args) => <DataGrid {...args} />
}

export const Horizontal: Story = {
  args: {
    query: {
      dataPool: {
        name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1 ?? ''
      },
      columns: ['taco_name', 'restaurant_name', 'tortilla_name', 'restaurant_id', 'sauce_id']
    },
    paginationProps: {
      defaultPageSize: 50
    },
    resizable: false,
    card: true,
    style: { maxHeight: 400 },
    tableLinesLayout: 'horizontal'
  },
  render: (args) => <DataGrid {...args} />
}

export const NoLines: Story = {
  args: {
    ...Vertical.args,
    tableLinesLayout: 'none'
  },
  render: (args) => <DataGrid {...args} />
}

export const HideBorder: Story = {
  args: {
    ...Vertical.args,
    tableLinesLayout: 'both',
    hideBorder: true
  },
  render: (args) => <DataGrid {...args} />
}

export const Resizable: Story = {
  args: {
    query: {
      dataPool: {
        name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1 ?? ''
      },
      columns: ['taco_name', 'restaurant_name', 'tortilla_name', 'restaurant_id', 'sauce_id']
    },
    paginationProps: {
      defaultPageSize: 50
    },
    resizable: true,
    card: true,
    style: { maxHeight: 400 }
  },
  render: (args) => <DataGrid {...args} />
}

export const CustomPaginationOptions: Story = {
  args: {
    query: {
      dataPool: {
        name: process.env.STORYBOOK_DATA_POOL_UNIQUE_NAME_1 ?? ''
      },
      columns: ['taco_name', 'restaurant_name', 'tortilla_name', 'restaurant_id', 'sauce_id']
    },
    paginationProps: {
      defaultPageSize: 25,
      pageSizeOptions: [5, 10, 25, 30]
    },
    resizable: true,
    card: true,
    style: { maxHeight: 400 }
  },
  render: (args) => <DataGrid {...args} />
}

export const Static: Story = {
  args: {
    headers: ['taco_name', 'restaurant_name', 'tortilla_name', 'restaurant_id', 'sauce_id'],
    rows: [
      [
        'Breakfast',
        'Los Compadres',
        'Spinach',
        '605cf627-794e-47f6-9f23-19c8dda7c24a',
        '25cdef0f-c358-4788-9645-f9625b9a219f'
      ],
      [
        'Veggie',
        'Los Compadres',
        'Whole Wheat',
        '605cf627-794e-47f6-9f23-19c8dda7c24a',
        'a37d3001-f953-47e3-b1ed-149f8897d094'
      ],
      [
        'Al Pastor',
        'Taqueria Cancun',
        'Corn',
        '9bdde1f8-cbe2-4dba-bca1-14352a152173',
        '25cdef0f-c358-4788-9645-f9625b9a219f'
      ],
      [
        'Breakfast',
        'Los Compadres',
        'Flour',
        '605cf627-794e-47f6-9f23-19c8dda7c24a',
        'eb08c249-6855-4074-a476-75ecce863a7c'
      ],
      [
        'Shrimp',
        'Los Compadres',
        'Corn',
        '605cf627-794e-47f6-9f23-19c8dda7c24a',
        'a37d3001-f953-47e3-b1ed-149f8897d094'
      ],
      [
        'Veggie',
        'Los Compadres',
        'Corn',
        '605cf627-794e-47f6-9f23-19c8dda7c24a',
        '2374b5f8-b939-49f1-b7d9-3001c37096b8'
      ],
      [
        'Shrimp',
        'Los Compadres',
        'Corn',
        '605cf627-794e-47f6-9f23-19c8dda7c24a',
        '6c8f7f6a-25d9-4bdc-ae3b-6b92b808c1d3'
      ],
      [
        'Chorizo',
        'La Taqueria',
        'Nopal',
        'f38ed454-a907-43b4-b362-cd4dd197dd03',
        'a37d3001-f953-47e3-b1ed-149f8897d094'
      ],
      [
        'Shrimp',
        'La Taqueria',
        'Whole Wheat',
        'f38ed454-a907-43b4-b362-cd4dd197dd03',
        '2374b5f8-b939-49f1-b7d9-3001c37096b8'
      ],
      ['Veggie', 'La Taqueria', 'Corn', 'f38ed454-a907-43b4-b362-cd4dd197dd03', 'a37d3001-f953-47e3-b1ed-149f8897d094']
    ],
    paginationProps: {
      defaultPageSize: 5,
      pageSizeOptions: [5]
    }
  },
  render: (args) => <DataGrid {...args} />
}

export const JSON: Story = {
  args: {
    headers: ['tacosoft'],
    rows: [
      [
        `{
          "taco_name": "Shrimp",
          "restaurant_name": "Los Compadres",
          "tortilla_name": "Corn",
          "restaurant_id": "605cf627-794e-47f6-9f23-19c8dda7c24a",
          "sauce_id": "25cdef0f-c358-4788-9645-f9625b9a219f"
        }`
      ]
    ],
    paginationProps: {
      defaultPageSize: 5,
      pageSizeOptions: [5]
    },
    disablePagination: true,
    resizable: true
  },
  render: (args) => <DataGrid {...args} />
}

export const Custom: Story = {
  args: {
    ...Static.args,
    slotProps: {
      header: {
        style: {
          backgroundColor: 'var(--propel-gray-3)'
        }
      },
      cell: {
        style: {
          backgroundColor: 'var(--propel-gray-1)'
        }
      }
    }
  },
  render: (args) => <DataGrid {...args} />
}
