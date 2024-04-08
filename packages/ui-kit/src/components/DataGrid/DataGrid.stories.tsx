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

export const Basic: Story = {
  args: {
    query: {
      dataPool: {
        id: 'DPO01HB9W3DCA1756WT6CJ6BV9H48'
      },
      columns: ['taco_name', 'sauce_name', 'tortilla_name', 'restaurant_name']
    },
    cellProps: {
      style: {
        textOverflow: 'ellipsis',
        overflow: 'auto',
        whiteSpace: 'nowrap',
        textWrap: 'nowrap'
      }
    },
    tableProps: {
      style: {
        width: 'max-content'
      }
    },
    resizable: true
  },
  render: (args) => <DataGrid {...args} />
}
