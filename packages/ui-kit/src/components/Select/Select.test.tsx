import React, { SyntheticEvent } from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

import { Dom } from 'src/testing'

import { Option, Select } from './Select'

const options = [
  {
    label: 'Option 1'
  },
  {
    label: 'Option 2'
  },
  {
    label: 'Option 3'
  }
]

describe('Select', () => {
  let dom: Dom

  it('should enable selecting an option', async () => {
    const onChangeValue = jest.fn()

    const onChange = (_: SyntheticEvent | null, value: string[] | string | null) => {
      onChangeValue(value)
    }

    dom = render(
      <Select placeholder="Select or type" onChange={onChange}>
        {options.map((option) => (
          <Option key={option.label} value={option.label}>
            {option.label}
          </Option>
        ))}
      </Select>
    )

    const button = dom.getByRole('button')
    fireEvent.click(button)
    await waitFor(async () => {
      fireEvent.click(await dom.findByText('Option 1'))
    })

    expect(onChangeValue).toHaveBeenCalledWith('Option 1')
  })
})
