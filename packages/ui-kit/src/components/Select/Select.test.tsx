import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Select } from './Select'

jest.mock('../Icons/ChevronDown', () => ({
  ChevronDownIcon: () => <div data-testid="chevron-down-icon" />
}))

describe('Select', () => {
  const options = [
    { value: '1', label: 'Option 1' },
    { value: '2', label: 'Option 2' },
    { value: '3', label: 'Option 3' }
  ]

  it('renders with provided options', () => {
    render(<Select options={options} />)

    options.forEach((option) => {
      expect(screen.getByText(option.label)).toBeInTheDocument()
    })
  })

  it('toggles listbox visibility when clicking the button', () => {
    render(<Select options={[{ value: '1', label: 'Option 1' }]} />)

    const combobox = screen.getByRole('combobox')
    fireEvent.click(combobox)

    const listbox = screen.queryByRole('listbox')
    expect(listbox).toBeVisible()
  })

  it('displays endAdornment correctly', () => {
    render(<Select options={options} />)

    expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument()
  })

  it('renders custom start and end adornments', () => {
    const StartAdornment = () => <div data-testid="start-adornment">Start</div>
    const EndAdornment = () => <div data-testid="end-adornment">End</div>

    render(<Select startAdornment={StartAdornment} endAdornment={EndAdornment} />)

    expect(screen.getByTestId('start-adornment')).toBeInTheDocument()
    expect(screen.getByTestId('end-adornment')).toBeInTheDocument()
  })
})
