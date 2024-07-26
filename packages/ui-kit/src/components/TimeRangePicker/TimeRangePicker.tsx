import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import { Popper } from '@mui/base/Popper'
import classNames from 'classnames'
import { intlFormat, startOfDay } from 'date-fns'
import React from 'react'
import { ClassNames, DateRange, DayPicker } from 'react-day-picker'
import styles from 'react-day-picker/dist/style.module.css'
import { getDateTimeFormatPattern, getLocale, useForwardedRefCallback } from '../../helpers'
import { useParsedComponentProps } from '../../themes'
import { Button } from '../Button'
import { Divider } from '../Divider'
import { CalendarIcon } from '../Icons/Calendar'
import { Input } from '../Input'
import { Select } from '../Select'
import { Option, OptionValue } from '../Select/Option'
import { useSetupTheme } from '../ThemeProvider'
import { Typography } from '../Typography'
import { DateTimeField } from './DateTimeField'
import {
  CUSTOM_DATE_RANGE,
  CUSTOM_RANGE_FORMAT_OPTIONS,
  DATE_FORMAT_OPTIONS,
  defaultOptions,
  FROM_DATE_UNTIL_NOW,
  lastNOptions
} from './TimeRangePicker.const'
import componentStyles from './TimeRangePicker.module.scss'
import { DateRangeOptionsProps, TimeRangePickerProps } from './TimeRangePicker.types'

const formatDateTime = (value: Date | undefined, locale: string, valueFormat?: Intl.DateTimeFormatOptions) => {
  try {
    return value
      ? intlFormat(value, valueFormat ?? DATE_FORMAT_OPTIONS, { locale })
      : getDateTimeFormatPattern({
          locale,
          options: valueFormat ?? DATE_FORMAT_OPTIONS
        })
  } catch (e) {
    console.error(e)
    return ''
  }
}

export const TimeRangePicker = React.forwardRef<HTMLDivElement, TimeRangePickerProps>(
  (
    {
      disableDateUntilNow = false,
      disableCustomRange = false,
      disableCustomRelative = false,
      disableOptions = false,
      disabled = false,
      locale: localeProp,
      options: optionsProp,
      defaultValue = null,
      size = 'default',
      value,
      onChange,
      ...rest
    },
    forwardedRef
  ) => {
    const { themeSettings, parsedProps } = useParsedComponentProps(rest)
    const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
    const selectRef = React.useRef<HTMLButtonElement | null>(null)
    const { theme } = useSetupTheme({
      componentContainer,
      ...themeSettings
    })

    const locale = localeProp || getLocale()
    const options = React.useMemo(() => (optionsProp ? optionsProp(defaultOptions) : defaultOptions), [optionsProp])

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [selectOpen, setSelectOpen] = React.useState(false)

    const [lastN, setLastN] = React.useState(30)
    const [lastNOption, setLastNOption] = React.useState<OptionValue | null>(
      lastNOptions.find((option) => option.label === 'days') ?? null
    )

    const lastNRef = React.useRef(lastN)
    const lastNOptionRef = React.useRef(lastNOption)

    const [selectedOption, setSelectedOption] = React.useState<DateRangeOptionsProps | null>(
      options?.find((option) => option.value === defaultValue?.value) ?? null
    )

    const [datepickerRange, setDatepickerRange] = React.useState<DateRange | null>(null)
    const [selectedRange, setSelectedRange] = React.useState<DateRange | null>(null)

    const [datepickerMode, setDatepickerMode] = React.useState<typeof FROM_DATE_UNTIL_NOW | typeof CUSTOM_DATE_RANGE>(
      FROM_DATE_UNTIL_NOW
    )
    const popupOpen = Boolean(anchorEl)

    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    const getLastNOption = React.useCallback(() => {
      const relativeOption = lastNOptions.find((option) => option.label === lastNOptionRef.current?.label)

      return {
        value: 'last-n',
        label: `Last ${lastNRef.current} ${lastNOptionRef.current?.label}`,
        params: {
          relative: relativeOption?.value ?? lastNOptions[0].value,
          n: lastNRef.current
        }
      }
    }, [])

    const [lastNOptionValue, setLastNOptionValue] = React.useState<DateRangeOptionsProps>(getLastNOption())
    const [fromDateUntilNow, setFromDateUntilNow] = React.useState<DateRangeOptionsProps>({
      value: FROM_DATE_UNTIL_NOW
    })
    const [customDateRange, setCustomDateRange] = React.useState<DateRangeOptionsProps>({ value: CUSTOM_DATE_RANGE })

    React.useEffect(() => {
      setLastNOptionValue(getLastNOption())
    }, [getLastNOption])

    React.useEffect(() => {
      if (value) {
        const option = options?.find((option) => option.value === value?.value)
        setSelectedOption(option ?? null)

        if (!value.params && option && onChange) {
          onChange(option)
        }
      }
    }, [options, onChange, value])

    React.useEffect(() => {
      lastNRef.current = lastN
      lastNOptionRef.current = lastNOption
    }, [lastN, lastNOption])

    // Init selected option if defaultValue is set
    React.useEffect(() => {
      if (selectedOption === null || selectedOption?.params) {
        return
      }

      let initSelectedOption: DateRangeOptionsProps | null = { ...selectedOption }

      if (
        datepickerRange &&
        (selectedOption?.value === CUSTOM_DATE_RANGE || selectedOption?.value === FROM_DATE_UNTIL_NOW)
      ) {
        initSelectedOption.params = {
          start: datepickerRange.from,
          stop: datepickerRange.to
        }
      } else if (selectedOption?.value === 'last-n') {
        initSelectedOption = lastNOptionValue
      } else if (selectedOption) {
        initSelectedOption = options?.find((option) => option.value === selectedOption.value) ?? null
      }

      setSelectedOption({ ...initSelectedOption } as DateRangeOptionsProps)
    }, [selectedOption, datepickerRange, options, lastNOptionValue])

    React.useEffect(() => {
      if (value?.value === selectedOption?.value) {
        return
      }

      if (selectedOption && onChange) {
        onChange({ ...selectedOption })
      }
    }, [selectedOption, value, onChange])

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setAnchorEl(null)
      }
    }

    React.useEffect(() => {
      document.addEventListener('keydown', handleEscape)

      return () => {
        document.removeEventListener('keydown', handleEscape)
      }
    }, [])

    const debouncedUpdate = React.useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        setLastN(lastNRef.current)
        setLastNOption(lastNOptionRef.current)

        const newValue = getLastNOption()
        setLastNOptionValue(newValue)
        setSelectedOption(newValue)
      }, 500)

      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current)
        }
      }
    }, [getLastNOption])

    const onLastNChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastN(Number(event.currentTarget.value))
        debouncedUpdate()
      },
      [debouncedUpdate]
    )

    const onLastNOption = React.useCallback(
      (value: typeof lastNOption) => {
        if (value !== null) {
          setLastNOption(value)
          debouncedUpdate()
        }
      },
      [debouncedUpdate]
    )

    const onCancel = React.useCallback(() => {
      setDatepickerRange(selectedRange)
      setAnchorEl(null)
      setTimeout(() => {
        if (selectRef.current) {
          selectRef.current.click()
        }
      }, 10)
    }, [selectedRange])

    const onClear = React.useCallback(() => {
      setDatepickerRange(null)
    }, [])

    const onApply = React.useCallback(() => {
      setSelectedRange(datepickerRange)

      if (!datepickerRange) {
        return
      }

      const option = {
        value: datepickerMode === CUSTOM_DATE_RANGE ? CUSTOM_DATE_RANGE : FROM_DATE_UNTIL_NOW,
        label:
          datepickerMode === CUSTOM_DATE_RANGE
            ? `${formatDateTime(datepickerRange?.from, locale)} – ${formatDateTime(datepickerRange?.to, locale)}`
            : `${formatDateTime(datepickerRange?.from, locale)} – Now`,
        params: {
          start: datepickerRange.from,
          stop: datepickerRange.to
        }
      }

      if (datepickerMode === FROM_DATE_UNTIL_NOW) {
        setFromDateUntilNow(option)
      }

      if (datepickerMode === CUSTOM_DATE_RANGE) {
        setCustomDateRange(option)
      }

      setSelectedOption(option)

      setAnchorEl(null)
    }, [locale, datepickerMode, datepickerRange])

    const onFromDateUntilNow = React.useCallback(
      (event: React.MouseEvent<HTMLLIElement>) => {
        event.stopPropagation()
        const now = new Date()
        setSelectedRange({ from: startOfDay(now), to: now })
        setDatepickerRange({ from: datepickerRange?.from, to: now })
        setDatepickerMode(FROM_DATE_UNTIL_NOW)
        setSelectOpen(false)
        setAnchorEl(componentContainer)
      },
      [datepickerRange, componentContainer]
    )

    const onCustomDateRange = React.useCallback(
      (event: React.MouseEvent<HTMLLIElement>) => {
        event.stopPropagation()
        setDatepickerMode(CUSTOM_DATE_RANGE)
        setSelectOpen(false)
        setAnchorEl(componentContainer)
      },
      [componentContainer]
    )

    const datePickerClassNames: ClassNames = {
      ...styles,
      root: classNames(styles.root, componentStyles.root),
      caption: classNames(styles.caption, componentStyles.caption),
      nav: classNames(styles.nav, componentStyles.nav),
      nav_button: classNames(styles.nav_button, componentStyles.nav_button),
      caption_label: classNames(styles.caption_label, componentStyles.caption_label),
      caption_end: classNames(styles.caption_end, componentStyles.caption_end),
      caption_start: classNames(styles.caption_start, componentStyles.caption_start),
      head_cell: classNames(styles.head_cell, componentStyles.head_cell),
      cell: classNames(styles.cell, componentStyles.cell),
      button: classNames(styles.button, componentStyles.button),
      day_today: classNames(styles.day_today, componentStyles.day_today),
      day_selected: classNames(styles.day_selected, componentStyles.day_selected),
      day_range_start: classNames(styles.day_range_start, componentStyles.day_range_start),
      day_range_end: classNames(styles.day_range_end, componentStyles.day_range_end),
      day_range_middle: classNames(styles.day_range_middle, componentStyles.day_range_middle),
      multiple_months: classNames(styles.multiple_months, componentStyles.multiple_months)
    }

    return (
      <div ref={setRef} {...parsedProps}>
        <Select<DateRangeOptionsProps>
          ref={selectRef}
          disabled={disabled || (disableOptions && disableCustomRelative && disableCustomRange && disableDateUntilNow)}
          startAdornment={() => <CalendarIcon size={16} />}
          value={selectedOption}
          placeholder="Date Range"
          onListboxOpenChange={(listboxOpen) => {
            if (!popupOpen) {
              setSelectOpen(listboxOpen)
            }
          }}
          listboxOpen={selectOpen}
          size={size}
          slotProps={{
            popper: { className: componentStyles.timeRangePickerPopper }
          }}
          onChange={(event, newValue) => {
            if (newValue === null) {
              return
            }

            if (newValue?.value === FROM_DATE_UNTIL_NOW || newValue?.value === CUSTOM_DATE_RANGE) {
              return
            }

            if (newValue?.value === 'last-n') {
              event?.stopPropagation()
              setSelectedOption(newValue)
              setSelectOpen(false)
              return
            }

            setSelectedOption(options?.find((option) => option.value === newValue?.value) ?? null)
          }}
        >
          {!disableOptions &&
            options?.map((option) => (
              <Option key={option.value} value={option}>
                {option.label}
              </Option>
            ))}
          {!disableCustomRelative && (
            <Option value={lastNOptionValue} className={componentStyles.lastN}>
              In the last
              {/* This prevents the parent Option component from executing logic handling when the user interacts with nested inputs. */}
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
              <div onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
                <Input
                  type="number"
                  value={lastN}
                  size={size}
                  role="spinbutton"
                  onChange={onLastNChange}
                  style={{
                    width: 56,
                    padding: `${theme?.getVar('--propel-space-1')} ${theme?.getVar('--propel-space-2')}`
                  }}
                />{' '}
                <Select
                  value={lastNOption}
                  size={size}
                  onChange={(_, value) => onLastNOption(value)}
                  style={{ padding: `${theme?.getVar('--propel-space-1')} ${theme?.getVar('--propel-space-2')}` }}
                >
                  {lastNOptions.map((option) => (
                    <Option key={option.label} value={option}>
                      {option.label}
                    </Option>
                  ))}
                </Select>
              </div>
            </Option>
          )}
          {(!disableDateUntilNow || !disableCustomRange) && <Divider />}
          {!disableDateUntilNow && (
            <Option value={fromDateUntilNow} onClick={onFromDateUntilNow}>
              From date until now
            </Option>
          )}
          {!disableCustomRange && (
            <Option value={customDateRange} onClick={onCustomDateRange}>
              Custom date range
            </Option>
          )}
        </Select>
        <Popper
          open={popupOpen}
          anchorEl={anchorEl}
          placement="bottom-start"
          className={componentStyles.timeRangePickerPopper}
          slots={{
            root: 'div'
          }}
          popperOptions={{ placement: 'bottom-start' }}
          modifiers={[
            {
              name: 'flip',
              enabled: true,
              options: {
                fallbackPlacements: ['bottom-end', 'top-start', 'top-end'],
                rootBoundary: 'viewport'
              }
            },
            {
              name: 'preventOverflow',
              enabled: true,
              options: {
                mainAxis: true,
                altAxis: true,
                tether: true,
                boundary: 'viewport',
                rootBoundary: 'document'
              }
            }
          ]}
          disablePortal
        >
          <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <div className={componentStyles.timeRangePicker}>
              <div className={componentStyles.timeRangePickerHeader}>
                <Typography size={3} weight="bold">
                  Select a {datepickerMode === FROM_DATE_UNTIL_NOW ? 'start date' : 'date range'}
                </Typography>
              </div>
              <Divider as="div" />
              <DayPicker
                classNames={datePickerClassNames}
                mode="range"
                selected={datepickerRange ?? undefined}
                numberOfMonths={datepickerMode === CUSTOM_DATE_RANGE ? 2 : 1}
                modifiersClassNames={{
                  today: componentStyles.today,
                  root: componentStyles.root
                }}
                toDate={datepickerMode === FROM_DATE_UNTIL_NOW ? new Date() : undefined}
                onSelect={(range, selectedDay) => {
                  if (range && datepickerMode === FROM_DATE_UNTIL_NOW) {
                    setDatepickerRange({ from: selectedDay, to: new Date() })
                    return
                  }
                  setDatepickerRange(range ?? null)
                }}
              />
              <div
                className={componentStyles.timeRangePickerInputs}
                style={{ width: datepickerMode === CUSTOM_DATE_RANGE ? 576 : 264 }}
              >
                <DateTimeField
                  rangeRole="from"
                  size={size}
                  dateRange={datepickerRange}
                  locale={locale}
                  onChange={setDatepickerRange}
                />
                {datepickerMode === CUSTOM_DATE_RANGE && (
                  <DateTimeField
                    rangeRole="to"
                    size={size}
                    dateRange={datepickerRange}
                    locale={locale}
                    onChange={setDatepickerRange}
                  />
                )}
              </div>
              <>
                <Divider as="div" />
                <div className={componentStyles[datepickerMode]}>
                  <Typography size={1}>
                    <span style={{ color: theme?.getVar('--propel-gray-10') }}>Start:</span>{' '}
                    {formatDateTime(datepickerRange?.from, locale, CUSTOM_RANGE_FORMAT_OPTIONS)}
                  </Typography>
                  <Typography size={1}>
                    <span style={{ color: theme?.getVar('--propel-gray-10') }}>End:</span>{' '}
                    {datepickerMode === FROM_DATE_UNTIL_NOW
                      ? `Now ${formatDateTime(datepickerRange?.to, locale, {
                          year: 'numeric',
                          month: 'long',
                          day: '2-digit'
                        })}`
                      : formatDateTime(datepickerRange?.to, locale, CUSTOM_RANGE_FORMAT_OPTIONS)}
                  </Typography>
                </div>
              </>
              <Divider as="div" />
              <div className={componentStyles.timeRangePickerActions}>
                {datepickerMode === CUSTOM_DATE_RANGE && (
                  <div style={{ flex: 4, display: 'flex' }}>
                    <Button size={size} style={{ flex: 0.25 }} overridable onClick={onClear}>
                      Clear
                    </Button>
                  </div>
                )}
                <Button size={size} overridable style={{ flex: 1 }} onClick={onCancel}>
                  Cancel
                </Button>
                <Button
                  disabled={!(datepickerRange?.from && datepickerRange?.to)}
                  size={size}
                  overridable
                  variant="primary"
                  style={{ flex: 1 }}
                  onClick={onApply}
                >
                  Apply
                </Button>
              </div>
            </div>
          </ClickAwayListener>
        </Popper>
      </div>
    )
  }
)

TimeRangePicker.displayName = 'TimeRangePicker'
