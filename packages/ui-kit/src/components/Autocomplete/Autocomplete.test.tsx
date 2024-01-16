import React, { SyntheticEvent } from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'

import { Dom } from 'src/testing'
import { Autocomplete } from './Autocomplete'
import { AutocompleteOption } from './Autocomplete.types'

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
    const onChangeValue = jest.fn()

    const onChange = (_: SyntheticEvent, value: AutocompleteOption | null) => {
      onChangeValue(value)
    }

    dom = render(<Autocomplete options={options} placeholder="Select or type" onChange={onChange} />)

    const button = dom.getByRole('button', { name: 'dropdown-button' })
    fireEvent.click(button)
    await waitFor(async () => {
      fireEvent.click(await dom.findByText('Option 1'))
    })

    expect(onChangeValue).toHaveBeenCalledWith({ label: 'Option 1' })
  })
})
