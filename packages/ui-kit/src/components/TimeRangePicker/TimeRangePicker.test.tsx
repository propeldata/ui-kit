import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import React from 'react'
import { RelativeTimeRange } from '../../helpers'
import { TimeRangePicker } from './TimeRangePicker'

jest.mock('./TimeRangePicker.module.scss', () => ({
  rootTimeRangePicker: 'rootTimeRangePicker',
  formField: 'formField',
  error: 'error'
}))

describe('TimeRangePicker', () => {
  const mockOnChange = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('initializes with default values correctly', async () => {
    const defaultValue = {
      value: 'last-30-days',
      label: 'Last 30 days',
      params: { relative: RelativeTimeRange.LastNDays, n: 30 }
    }

    render(<TimeRangePicker defaultValue={defaultValue} onChange={jest.fn()} />)

    const selectedOption = await screen.findByRole('combobox')

    expect(selectedOption).toBeInTheDocument()
    expect(selectedOption.textContent).toBe('Last 30 days')
  })

  it('selects predefined date ranges correctly', async () => {
    render(<TimeRangePicker onChange={mockOnChange} />)

    fireEvent.mouseDown(screen.getByText('Date Range'))
    fireEvent.click(screen.getByText('This month'))

    await waitFor(() =>
      expect(mockOnChange).toHaveBeenCalledWith({
        value: 'this-month',
        label: 'This month',
        params: { relative: RelativeTimeRange.ThisMonth }
      })
    )
  })

  it('toggles the dropdown correctly', () => {
    render(<TimeRangePicker onChange={jest.fn()} />)

    const dropdownButton = screen.getByRole('combobox')

    fireEvent.click(dropdownButton)
    expect(screen.getByText('Today')).toBeVisible()

    fireEvent.click(dropdownButton)
    expect(screen.queryByText('Today')).not.toBeVisible()
  })

  it('handles dynamic inputs for last N selections', async () => {
    render(<TimeRangePicker onChange={jest.fn()} />)

    fireEvent.click(await screen.findByText('Date Range'))

    const spinButton = await screen.findByRole('spinbutton')
    fireEvent.change(spinButton, { target: { value: '60' } })
    fireEvent.click(await screen.findByText('weeks'))

    expect(await screen.findByText('Last 60 weeks')).toBeInTheDocument()
  })

  it('closes the popper when clicking away from the component', async () => {
    const { baseElement } = render(<TimeRangePicker onChange={jest.fn()} />)

    fireEvent.mouseDown(screen.getByText('Date Range'))
    fireEvent.mouseDown(baseElement)

    await waitFor(() => expect(screen.queryByText('Today')).not.toBeVisible())
  })

  it('applies a custom date range correctly', async () => {
    render(<TimeRangePicker onChange={mockOnChange} />)

    fireEvent.click(await screen.findByText('Custom date range'))

    const allDateInputs = await screen.getAllByTestId('date-input')
    const allTimeInputs = await screen.getAllByTestId('time-input')

    const startInput = allDateInputs[0]
    const endInput = allDateInputs[1]
    const startTimeInput = allTimeInputs[0]
    const endTimeInput = allTimeInputs[1]

    fireEvent.change(startInput, { target: { value: '04/01/2022' } })
    fireEvent.blur(startInput)

    fireEvent.change(endInput, { target: { value: '04/15/2022' } })
    fireEvent.blur(endInput)

    fireEvent.change(startTimeInput, { target: { value: '08:00:00 AM' } })
    fireEvent.blur(startTimeInput)

    fireEvent.change(endTimeInput, { target: { value: '05:00:00 PM' } })
    fireEvent.blur(endTimeInput)

    fireEvent.click(await screen.findByText('Apply'))

    const fromDateTime = new Date('2022-04-01T08:00:00')
    const toDateTime = new Date('2022-04-15T17:00:00')

    expect(mockOnChange).toHaveBeenCalledWith({
      value: 'custom-date-range',
      label: '04/01/2022 – 04/15/2022',
      params: { start: fromDateTime, stop: toDateTime }
    })
  })

  it('applies the "From date until now" range correctly', async () => {
    const now = new Date('2024-04-18T08:58:01.733Z')
    jest.useFakeTimers().setSystemTime(now)

    render(<TimeRangePicker onChange={mockOnChange} />)

    fireEvent.click(await screen.findByText('From date until now'))

    const dateInput = await screen.getByTestId('date-input')
    const timeInput = await screen.getByTestId('time-input')

    fireEvent.change(dateInput, { target: { value: '01/04/2022' } })
    fireEvent.blur(dateInput)

    fireEvent.change(timeInput, { target: { value: '08:00:00 AM' } })
    fireEvent.blur(timeInput)

    fireEvent.click(await screen.findByText('Apply'))

    const fromDateTime = new Date('2022-01-04T08:00:00')

    expect(mockOnChange).toHaveBeenCalledWith({
      value: 'from-date-until-now',
      label: `01/04/2022 – Now`,
      params: { start: fromDateTime, stop: now }
    })

    jest.useRealTimers()
  })

  it('validates date and time entries correctly', async () => {
    render(<TimeRangePicker onChange={jest.fn()} />)

    fireEvent.click(await screen.findByText('Custom date range'))

    const allDateInputs = await screen.getAllByTestId('date-input')
    const allTimeInputs = await screen.getAllByTestId('time-input')

    const startInput = allDateInputs[0]
    const startTimeInput = allTimeInputs[0]

    fireEvent.change(startInput, { target: { value: 'invalid date' } })
    fireEvent.blur(startInput)

    fireEvent.change(startTimeInput, { target: { value: 'invalid time' } })
    fireEvent.blur(startTimeInput)

    await waitFor(() => expect(startInput.parentElement).toHaveClass('error'))
    await waitFor(() => expect(startTimeInput.parentElement).toHaveClass('error'))
  })
})
