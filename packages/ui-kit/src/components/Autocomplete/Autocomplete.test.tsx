import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

import { Dom } from 'src/testing'
import { Autocomplete } from './Autocomplete'

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

describe('Autocomplete', () => {
  let dom: Dom

  it('should enable selecting an option', async () => {
    const onChange = jest.fn()

    dom = render(<Autocomplete options={options} placeholder="Select or type" onChange={onChange} />)

    const button = dom.getByRole('button', { name: 'dropdown-button' })
    fireEvent.click(button)
    await waitFor(async () => {
      dom.debug()
      fireEvent.click(await dom.findByText('Option 1'))
    })

    expect(onChange).toHaveBeenCalled()
  })
})
