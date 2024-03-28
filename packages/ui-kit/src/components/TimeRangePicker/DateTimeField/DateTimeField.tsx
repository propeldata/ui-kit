import {
  addDays,
  addMinutes,
  format as dateFormat,
  isAfter,
  isBefore,
  isValid,
  parse,
  subDays,
  subMinutes
} from 'date-fns'
import React, { Dispatch, SetStateAction } from 'react'
import { DateRange } from 'react-day-picker'
import { FormField } from '../../FormField'
import { Input } from '../../Input'
import componentStyles from './DateTimeField.module.scss'

export type DateTimeFieldProps = {
  dateRange?: DateRange | null
  rangeRole: 'from' | 'to'
  onChange?: Dispatch<SetStateAction<DateRange | null>>
}

const DATE_FORMAT = 'yyyy/MM/dd'
const TIME_FORMAT = 'HH:mm:ss'

const validateDateRange = (dateRange: DateRange | null | undefined, rangeRole: 'from' | 'to', parsedValue: Date) =>
  isValid(parsedValue) &&
  (rangeRole === 'from'
    ? isAfter(dateRange?.to ?? addDays(parsedValue, 1), parsedValue)
    : isBefore(dateRange?.from ?? subDays(parsedValue, 1), parsedValue))

export const DateTimeField = ({ dateRange, rangeRole, onChange }: DateTimeFieldProps) => {
  const dateRef = React.useRef<HTMLInputElement>(null)
  const timeRef = React.useRef<HTMLInputElement>(null)
  const [dateError, setDateError] = React.useState(false)
  const [timeError, setTimeError] = React.useState(false)
  const value = dateRange && rangeRole ? dateRange[rangeRole] : null

  React.useEffect(() => {
    if (!value) {
      setDateError(false)
      setTimeError(false)
    }

    if (dateRef.current) {
      dateRef.current.value = value ? dateFormat(value, DATE_FORMAT) : ''
    }

    if (timeRef.current) {
      timeRef.current.value = value ? dateFormat(value, TIME_FORMAT) : ''
    }
  }, [value])

  const getParsedDateTime = React.useCallback(() => {
    const dateParts: string[] = []
    const formatParts: string[] = []

    if (dateRef.current && dateRef.current.value !== '') {
      dateParts.push(dateRef.current?.value.trim())
      formatParts.push(DATE_FORMAT)
    }
    if (timeRef.current && timeRef.current.value !== '') {
      dateParts.push(timeRef.current?.value.trim())
      formatParts.push(TIME_FORMAT)
    }

    const parsedValue = parse(dateParts.join(' '), formatParts.join(' '), value ?? new Date())

    return {
      parsedValue,
      isDateRangeValid: validateDateRange(dateRange, rangeRole, parsedValue)
    }
  }, [value, dateRange, rangeRole])

  const isDateValid = React.useCallback(
    () => isValid(parse(dateRef.current?.value ?? '', DATE_FORMAT, value ?? new Date())),
    [value]
  )
  const isTimeValid = React.useCallback(
    () => isValid(parse(timeRef.current?.value ?? '', TIME_FORMAT, value ?? new Date())),
    [value]
  )

  const submitValue = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const { currentTarget } = event
      const setError = currentTarget === dateRef.current ? setDateError : setTimeError
      const { parsedValue, isDateRangeValid } = getParsedDateTime()
      const isFieldValid = currentTarget === dateRef.current ? isDateValid() : isTimeValid()

      setError(!isFieldValid)

      if (!isFieldValid) {
        return
      }

      setError(isDateValid() && isTimeValid() && !isDateRangeValid)

      if (isDateRangeValid && onChange) {
        onChange((prevRange) => ({
          ...prevRange,
          from: rangeRole === 'from' ? parsedValue : prevRange?.from,
          to: rangeRole === 'to' ? parsedValue : prevRange?.to
        }))
      }
    },
    [rangeRole, getParsedDateTime, onChange, isDateValid, isTimeValid]
  )

  const onBlur = React.useCallback(
    (event: React.FocusEvent<HTMLInputElement>) => {
      const setError = event.currentTarget === dateRef.current ? setDateError : setTimeError

      if (event.currentTarget?.value === '') {
        setError(false)
        return
      }

      submitValue(event)
    },
    [submitValue]
  )

  React.useEffect(() => {
    if (!value) {
      return
    }

    const { isDateRangeValid } = getParsedDateTime()

    if (isDateRangeValid) {
      setDateError(false)
      setTimeError(false)
    }
  }, [value, dateRange, rangeRole, getParsedDateTime])

  const getInputValue = React.useCallback(
    (inputValue: string, format: string, adjustDate: typeof addDays) => {
      const val = inputValue ? parse(inputValue, format, value ?? new Date()) : new Date()
      if (!isValid(val)) {
        return undefined
      }
      return dateFormat(adjustDate(val, 1), format)
    },
    [value]
  )

  const onKeyDown = React.useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { currentTarget } = event
      const inputValue = currentTarget.value
      let newValue: string | undefined

      if (event.key === 'ArrowUp') {
        event.preventDefault()

        if (currentTarget === dateRef.current) {
          newValue = getInputValue(inputValue, DATE_FORMAT, addDays)
        }
        if (currentTarget === timeRef.current) {
          newValue = getInputValue(inputValue, TIME_FORMAT, addMinutes)
        }
      }
      if (event.key === 'ArrowDown') {
        event.preventDefault()

        if (currentTarget === dateRef.current) {
          newValue = getInputValue(inputValue, DATE_FORMAT, subDays)
        }
        if (currentTarget === timeRef.current) {
          newValue = getInputValue(inputValue, TIME_FORMAT, subMinutes)
        }
      }

      if (event.key === 'Enter') {
        event.preventDefault()
        currentTarget.blur()
      }

      if (newValue) {
        currentTarget.value = newValue
      }
    },
    [getInputValue]
  )

  const labelPrefix = rangeRole === 'from' ? 'Start' : 'End'

  return (
    <div className={componentStyles.rootDateTimeField}>
      <FormField label={`${labelPrefix} Date`} className={componentStyles.formField}>
        <Input
          type="text"
          placeholder="YYYY/MM/DD"
          size="small"
          ref={dateRef}
          error={dateError}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
      </FormField>
      <FormField label={`${labelPrefix} Time`} className={componentStyles.formField}>
        <Input
          type="text"
          placeholder="00:00:00"
          size="small"
          ref={timeRef}
          error={timeError}
          onKeyDown={onKeyDown}
          onBlur={onBlur}
        />
      </FormField>
    </div>
  )
}
