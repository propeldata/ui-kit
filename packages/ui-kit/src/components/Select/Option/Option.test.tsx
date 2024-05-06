import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Select } from '../Select'
import { Option } from './Option'

jest.mock('./Option.module.scss', () => ({
  rootOption: 'rootOption'
}))

describe('Option', () => {
  it('renders children correctly', () => {
    const childText = 'Option 1'

    render(
      <Select>
        <Option value="1">{childText}</Option>
      </Select>
    )

    fireEvent.click(screen.getByRole('combobox'))

    screen.getByRole('option')

    expect(screen.getByRole('option')).toHaveTextContent(childText)
  })

  it('handles disabled prop', () => {
    render(
      <Select>
        <Option value="1" disabled>
          Disabled Option
        </Option>
      </Select>
    )

    fireEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('option')).toHaveAttribute('aria-disabled', 'true')
  })

  it('applies custom className', () => {
    const customClass = 'myCustomClass'

    render(
      <Select>
        <Option value="1" className={customClass}>
          Option with custom class
        </Option>
      </Select>
    )

    fireEvent.click(screen.getByRole('combobox'))

    expect(screen.getByRole('option')).toHaveClass('rootOption', customClass)
  })

  it('passes unrecognized props to the li element', () => {
    const testId = 'test-id'

    render(
      <Select>
        <Option value="1" data-testid={testId}>
          Option with data-testid
        </Option>
      </Select>
    )

    fireEvent.click(screen.getByRole('combobox'))

    expect(screen.getByTestId(testId)).toBeInTheDocument()
  })
})
