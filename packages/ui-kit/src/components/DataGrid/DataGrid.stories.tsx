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
    resizable: false
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
