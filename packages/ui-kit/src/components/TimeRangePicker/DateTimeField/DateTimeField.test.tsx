import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { DateTimeField } from './DateTimeField'

jest.mock('./DateTimeField.module.scss', () => ({
  rootDateTimeField: 'rootDateTimeField',
  formField: 'formField',
  error: 'error'
}))

describe('DateTimeField', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with provided date and time', () => {
    const dateRange = { from: new Date(2022, 3, 15, 10, 30), to: new Date(2022, 3, 20, 15, 45) }
    render(<DateTimeField dateRange={dateRange} rangeRole="from" onChange={mockOnChange} />)

    const dateInput = screen.getByTestId('date-input') as HTMLInputElement
    const timeInput = screen.getByTestId('time-input') as HTMLInputElement

    expect(dateInput.value).toBe('04/15/2022')
    expect(timeInput.value).toBe('10:30:00 AM')
  })

  it('updates date on ArrowUp and on ArrowDown key press and triggers onChange', () => {
    const dateRange = { from: new Date(2022, 3, 15, 10, 30), to: undefined }

    render(<DateTimeField dateRange={dateRange} rangeRole="from" onChange={mockOnChange} />)

    const dateInput = screen.getByTestId('date-input') as HTMLInputElement

    fireEvent.keyDown(dateInput, { key: 'ArrowUp' })
    expect(dateInput.value).toBe('04/16/2022')

    fireEvent.keyDown(dateInput, { key: 'ArrowDown' })
    expect(dateInput.value).toBe('04/15/2022')

    const timeInput = screen.getByTestId('time-input') as HTMLInputElement

    fireEvent.keyDown(timeInput, { key: 'ArrowUp' })
    expect(timeInput.value).toBe('10:31:00 AM')

    fireEvent.keyDown(timeInput, { key: 'ArrowDown' })
    expect(timeInput.value).toBe('10:30:00 AM')

    fireEvent.blur(timeInput)
    expect(mockOnChange).toHaveBeenCalledWith(expect.anything())
  })

  it('validates the date on blur and sets an error for invalid dates', async () => {
    const mockOnChange = jest.fn()

    render(<DateTimeField rangeRole="from" onChange={mockOnChange} />)

    const dateInput = screen.getByTestId('date-input') as HTMLInputElement

    fireEvent.change(dateInput, { target: { value: 'invalid date' } })
    fireEvent.blur(dateInput)

    await waitFor(() => expect(dateInput.parentElement).toHaveClass('error'))
  })

  it('clears the date error on blur with a valid date after an error state', async () => {
    const mockOnChange = jest.fn()

    render(<DateTimeField rangeRole="from" onChange={mockOnChange} />)

    const dateInput = screen.getByTestId('date-input') as HTMLInputElement

    fireEvent.change(dateInput, { target: { value: 'invalid date' } })
    fireEvent.blur(dateInput)

    await waitFor(() => expect(dateInput.parentElement).toHaveClass('error'))

    fireEvent.change(dateInput, { target: { value: '04/15/2022' } })
    fireEvent.blur(dateInput)

    await waitFor(() => expect(dateInput.parentElement).not.toHaveClass('error'))
  })

  it('updates time on blur and triggers onChange with the new time', async () => {
    const mockOnChange = jest.fn()

    render(
      <DateTimeField dateRange={{ from: new Date(2022, 3, 15, 10, 30) }} rangeRole="from" onChange={mockOnChange} />
    )

    const timeInput = screen.getByTestId('time-input') as HTMLInputElement

    fireEvent.change(timeInput, { target: { value: '11:00:00 AM' } })
    fireEvent.blur(timeInput)

    await waitFor(() => expect(mockOnChange).toHaveBeenCalledTimes(1))
  })

  it('handles date and time errors separately', async () => {
    render(<DateTimeField rangeRole="from" onChange={() => {}} />)

    const dateInput = screen.getByTestId('date-input') as HTMLInputElement
    const timeInput = screen.getByTestId('time-input') as HTMLInputElement

    fireEvent.change(dateInput, { target: { value: 'invalid date' } })
    fireEvent.change(timeInput, { target: { value: 'invalid time' } })
    fireEvent.blur(dateInput)
    fireEvent.blur(timeInput)

    await waitFor(() => expect(dateInput.parentElement).toHaveClass('error'))
    await waitFor(() => expect(timeInput.parentElement).toHaveClass('error'))

    fireEvent.change(dateInput, { target: { value: '04/16/2022' } })
    fireEvent.blur(dateInput)

    await waitFor(() => expect(dateInput.parentElement).not.toHaveClass('error'))
    await waitFor(() => expect(timeInput.parentElement).toHaveClass('error'))

    fireEvent.change(timeInput, { target: { value: '10:30:00 AM' } })
    fireEvent.blur(timeInput)

    await waitFor(() => expect(dateInput.parentElement).not.toHaveClass('error'))
    await waitFor(() => expect(timeInput.parentElement).not.toHaveClass('error'))
  })
})
