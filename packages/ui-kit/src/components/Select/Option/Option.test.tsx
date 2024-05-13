import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Select } from '../Select'
import { Option } from './Option'

jest.mock('./Option.module.scss', () => ({
  rootOption: 'rootOption'
}))

const OPTION = {
  value: '1',
  label: 'Option 1'
}

describe('Option', () => {
  it('renders children correctly', () => {
    render(
      <Select>
        <Option value={OPTION}>{OPTION.label}</Option>
      </Select>
    )

    fireEvent.click(screen.getByRole('combobox'))

    screen.getByRole('option')

    expect(screen.getByRole('option')).toHaveTextContent(OPTION.label)
  })

  it('handles disabled prop', () => {
    render(
      <Select>
        <Option value={OPTION} disabled>
          {OPTION.label}
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
        <Option value={OPTION} className={customClass}>
          {OPTION.label}
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
        <Option value={OPTION} data-testid={testId}>
          {OPTION.label}
        </Option>
      </Select>
    )

    fireEvent.click(screen.getByRole('combobox'))

    expect(screen.getByTestId(testId)).toBeInTheDocument()
  })
})
