import { render, screen, fireEvent } from '@testing-library/react'
import React from 'react'
import { Input } from './Input'

jest.mock('./Input.module.scss', () => ({
  rootInput: 'rootInput',
  small: 'small',
  default: 'default',
  error: 'error',
  focus: 'focus',
  disabled: 'disabled'
}))

describe('Input', () => {
  it('renders input with default props', () => {
    render(<Input />)

    const inputElement = screen.getByRole('textbox')
    expect(inputElement).toBeInTheDocument()
    expect(inputElement.parentElement).toHaveClass('rootInput')
  })

  it('renders input with size small', () => {
    render(<Input size="small" />)

    const inputElement = screen.getByRole('textbox')
    expect(inputElement.parentElement).toHaveClass('small')
  })

  it('renders input with error state', () => {
    render(<Input error />)

    const inputElement = screen.getByRole('textbox')
    expect(inputElement.parentElement).toHaveClass('error')
  })

  it('renders start and end adornments when provided', () => {
    const StartAdornment = () => <span>Start</span>
    const EndAdornment = () => <span>End</span>

    render(<Input startAdornment={StartAdornment} endAdornment={EndAdornment} />)

    expect(screen.getByText('Start')).toBeInTheDocument()
    expect(screen.getByText('End')).toBeInTheDocument()
  })

  it('applies disabled class when disabled', () => {
    render(<Input disabled />)

    const inputElement = screen.getByRole('textbox')
    expect(inputElement.parentElement).toHaveClass('disabled')
  })

  it('forwards ref to the input element', () => {
    const ref = React.createRef<HTMLInputElement>()

    render(<Input ref={ref} />)

    expect(ref.current).toBeInstanceOf(HTMLInputElement)
  })

  it('focuses input when container div is clicked', () => {
    const onFocus = jest.fn()
    render(<Input onFocus={onFocus} />)

    const inputElement = screen.getByRole('textbox')

    if (inputElement.parentElement) {
      fireEvent.click(inputElement.parentElement)
    }

    expect(onFocus).toHaveBeenCalled()
  })
})
