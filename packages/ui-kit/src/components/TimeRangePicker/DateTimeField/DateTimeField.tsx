import classnames from 'classnames'
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
import { useCombinedRefsCallback, getDateTimeFormatPattern } from '../../../helpers'
import { FormField } from '../../FormField'
import { Input } from '../../Input'
import { DefaultThemes, useSetupTheme } from '../../ThemeProvider'
import componentStyles from './DateTimeField.module.scss'

export interface DateTimeFieldProps extends Omit<React.ComponentPropsWithoutRef<'input'>, 'onChange'> {
  baseTheme?: DefaultThemes
  dateRange?: DateRange | null
  rangeRole: 'from' | 'to'
  onChange?: Dispatch<SetStateAction<DateRange | null>>
  locale?: string
}

const validateDateRange = (dateRange: DateRange | null | undefined, rangeRole: 'from' | 'to', parsedValue: Date) =>
  isValid(parsedValue) &&
  (rangeRole === 'from'
    ? isAfter(dateRange?.to ?? addDays(parsedValue, 1), parsedValue)
    : isBefore(dateRange?.from ?? subDays(parsedValue, 1), parsedValue))

export const DateTimeField = React.forwardRef<HTMLDivElement, DateTimeFieldProps>(
  ({ baseTheme, className, dateRange, locale = 'en-US', rangeRole, onChange, ...rest }, forwardedRef) => {
    const innerRef = React.useRef<HTMLDivElement>(null)
    const { componentContainer, setRef } = useCombinedRefsCallback({ forwardedRef, innerRef })
    useSetupTheme({ componentContainer, baseTheme })

    const dateFormatPattern = getDateTimeFormatPattern({
      locale,
      options: { year: 'numeric', month: '2-digit', day: '2-digit' }
    })
    const timeFormatPattern = getDateTimeFormatPattern({
      locale,
      options: { hour: '2-digit', minute: '2-digit', second: '2-digit' }
    })

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
        dateRef.current.value = value ? dateFormat(value, dateFormatPattern) : ''
      }

      if (timeRef.current) {
        timeRef.current.value = value ? dateFormat(value, timeFormatPattern) : ''
      }
    }, [dateFormatPattern, timeFormatPattern, value])

    const getParsedDateTime = React.useCallback(() => {
      const dateParts: string[] = []
      const formatParts: string[] = []

      if (dateRef.current && dateRef.current.value !== '') {
        dateParts.push(dateRef.current?.value.trim())
        formatParts.push(dateFormatPattern)
      }
      if (timeRef.current && timeRef.current.value !== '') {
        dateParts.push(timeRef.current?.value.trim())
        formatParts.push(timeFormatPattern)
      }

      const parsedValue = parse(dateParts.join(' '), formatParts.join(' '), value ?? new Date())

      return {
        parsedValue,
        isDateRangeValid: validateDateRange(dateRange, rangeRole, parsedValue)
      }
    }, [dateFormatPattern, timeFormatPattern, value, dateRange, rangeRole])

    const isDateValid = React.useCallback(
      () => isValid(parse(dateRef.current?.value ?? '', dateFormatPattern, value ?? new Date())),
      [dateFormatPattern, value]
    )
    const isTimeValid = React.useCallback(
      () => isValid(parse(timeRef.current?.value ?? '', timeFormatPattern, value ?? new Date())),
      [timeFormatPattern, value]
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
            newValue = getInputValue(inputValue, dateFormatPattern, addDays)
          }
          if (currentTarget === timeRef.current) {
            newValue = getInputValue(inputValue, timeFormatPattern, addMinutes)
          }
        }
        if (event.key === 'ArrowDown') {
          event.preventDefault()

          if (currentTarget === dateRef.current) {
            newValue = getInputValue(inputValue, dateFormatPattern, subDays)
          }
          if (currentTarget === timeRef.current) {
            newValue = getInputValue(inputValue, timeFormatPattern, subMinutes)
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
      [dateFormatPattern, timeFormatPattern, getInputValue]
    )

    const labelPrefix = rangeRole === 'from' ? 'Start' : 'End'

    return (
      <div ref={setRef} {...rest} className={classnames(componentStyles.rootDateTimeField, className)}>
        <FormField label={`${labelPrefix} Date`} className={componentStyles.formField}>
          <Input
            data-testid="date-input"
            type="text"
            placeholder={dateFormatPattern}
            size="small"
            ref={dateRef}
            error={dateError}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
          />
        </FormField>
        <FormField label={`${labelPrefix} Time`} className={componentStyles.formField}>
          <Input
            data-testid="time-input"
            type="text"
            placeholder={timeFormatPattern}
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
)

DateTimeField.displayName = 'DateTimeField'
