import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import { Popper } from '@mui/base/Popper'
import classNames from 'classnames'
import { format, startOfDay } from 'date-fns'
import React from 'react'
import { ClassNames, DateRange, DayPicker } from 'react-day-picker'
import styles from 'react-day-picker/dist/style.module.css'
import { useForwardedRefCallback } from '../../helpers'
import { Button } from '../Button'
import { Divider } from '../Divider'
import { CalendarIcon } from '../Icons/Calendar'
import { CloseIcon } from '../Icons/Close'
import { Input } from '../Input'
import { Select } from '../Select'
import { Option } from '../Select/Option'
import { useSetupTheme } from '../ThemeProvider'
import { Typography } from '../Typography'
import { DateTimeField } from './DateTimeField'
import {
  CUSTOM_DATE_RANGE,
  CUSTOM_RANGE_FORMAT,
  DATE_FORMAT,
  defaultOptions,
  FROM_DATE_UNTIL_NOW,
  lastNOptions
} from './TimeRangePicker.const'
import componentStyles from './TimeRangePicker.module.scss'
import { DateRangeOptionsProps, TimeRangePickerProps } from './TimeRangePicker.types'

export const TimeRangePicker = React.forwardRef<HTMLDivElement, TimeRangePickerProps>(
  (
    {
      baseTheme,
      disableDateUntilNow = false,
      disableCustomRange = false,
      disableCustomRelative = false,
      disableOptions = false,
      disabled = false,
      options: optionsProp,
      defaultValue: defaultValueProp,
      value,
      onChange
    },
    forwardedRef
  ) => {
    const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
    const { theme } = useSetupTheme({
      baseTheme,
      componentContainer
    })

    const options = React.useMemo(() => (optionsProp ? optionsProp(defaultOptions) : defaultOptions), [optionsProp])
    const [defaultValue] = React.useState(defaultValueProp)

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [selectOpen, setSelectOpen] = React.useState(false)

    const [lastN, setLastN] = React.useState(30)
    const [lastNOption, setLastNOption] = React.useState('days')

    const [selectedOptionLabel, setSelectedOptionLabel] = React.useState<string | null>(null)
    const [selectedOption, setSelectedOption] = React.useState<DateRangeOptionsProps | undefined>(defaultValue)
    const [datepickerRange, setDatepickerRange] = React.useState<DateRange | null>(null)
    const [selectedRange, setSelectedRange] = React.useState<DateRange | null>(null)

    const [datepickerMode, setDatepickerMode] = React.useState<typeof FROM_DATE_UNTIL_NOW | typeof CUSTOM_DATE_RANGE>(
      FROM_DATE_UNTIL_NOW
    )
    const popupOpen = Boolean(anchorEl)

    const timeoutRef = React.useRef<NodeJS.Timeout | null>(null)

    const getLastNOption = React.useCallback(() => {
      const relativeOption = lastNOptions.find((option) => option.label === lastNOption)
      return {
        uid: 'last-n',
        label: `Last ${lastN} ${lastNOption}`,
        value: {
          relative: relativeOption?.value ?? lastNOptions[0].value,
          n: lastN
        }
      }
    }, [lastN, lastNOption])

    React.useEffect(() => {
      if (value) {
        setSelectedOption(value)
      }
    }, [value])

    React.useEffect(() => {
      let label: string | undefined

      if (selectedOption?.uid === 'last-n') {
        label = `Last ${lastN} ${lastNOption}`
      } else if (selectedOption?.uid === FROM_DATE_UNTIL_NOW) {
        label = `${format(datepickerRange?.from ?? '', DATE_FORMAT)} - Now`
      } else if (selectedOption?.uid === CUSTOM_DATE_RANGE) {
        label = `${format(datepickerRange?.from ?? '', DATE_FORMAT)} - ${format(
          datepickerRange?.to ?? '',
          DATE_FORMAT
        )}`
      } else if (selectedOption) {
        label = options?.find((option) => option.uid === selectedOption.uid)?.label
      }

      if (!label) {
        return
      }

      setSelectedOptionLabel(label)
    }, [options, selectedOption, lastN, lastNOption, datepickerRange])

    // Init selected option if defaultValue is set
    React.useEffect(() => {
      if (selectedOption === undefined || selectedOption.value) {
        return
      }

      if (
        datepickerRange &&
        (selectedOption?.uid === CUSTOM_DATE_RANGE || selectedOption?.uid === FROM_DATE_UNTIL_NOW)
      ) {
        selectedOption.value = {
          from: datepickerRange.from,
          to: datepickerRange.to
        }
      } else if (selectedOption?.uid === 'last-n') {
        selectedOption.value = getLastNOption()?.value
      } else {
        selectedOption.value = options?.find((option) => option.uid === selectedOption.uid)?.value
      }
    }, [selectedOption, datepickerRange, options, getLastNOption])

    React.useEffect(() => {
      if (!(selectedOption && selectedOption.value && onChange)) {
        return
      }

      onChange(selectedOption)
    }, [selectedOption, onChange])

    const debouncedUpdate = React.useCallback(() => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }

      timeoutRef.current = setTimeout(() => {
        const newOption = getLastNOption()
        setSelectedOption(newOption)
      }, 500)
    }, [getLastNOption, setSelectedOption])

    const onLastNChange = React.useCallback(
      (event: React.ChangeEvent<HTMLInputElement>) => {
        setLastN(Number(event.currentTarget.value))
        debouncedUpdate()
      },
      [debouncedUpdate]
    )

    const onLastNOption = React.useCallback(
      (
        _:
          | React.MouseEvent<Element, MouseEvent>
          | React.KeyboardEvent<Element>
          | React.FocusEvent<Element, Element>
          | null,
        value: string | null
      ) => {
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
        uid: datepickerMode === CUSTOM_DATE_RANGE ? CUSTOM_DATE_RANGE : FROM_DATE_UNTIL_NOW,
        label:
          datepickerMode === CUSTOM_DATE_RANGE
            ? `${format(datepickerRange?.from ?? '', DATE_FORMAT)} - ${format(datepickerRange?.to ?? '', DATE_FORMAT)}`
            : `${format(datepickerRange?.from ?? '', DATE_FORMAT)} - Now`,
        value: {
          from: datepickerRange.from,
          to: datepickerRange.to
        }
      }

      setSelectedOption(option)

      setAnchorEl(null)
    }, [datepickerMode, datepickerRange])

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
      <div ref={setRef}>
        <Select
          disabled={disabled || (disableOptions && disableCustomRelative && disableCustomRange && disableDateUntilNow)}
          startAdornment={() => <CalendarIcon size={16} />}
          value={selectedOptionLabel}
          placeholder="Date Range"
          onListboxOpenChange={setSelectOpen}
          listboxOpen={selectOpen}
          size="small"
          slotProps={{
            popper: { className: componentStyles.timeRangePickerPopper }
          }}
          onChange={(event, value) => {
            if (value === FROM_DATE_UNTIL_NOW || value === 'custom-fixed-date-range') {
              setDatepickerRange({ from: undefined, to: new Date() })
              event?.stopPropagation()
              setSelectOpen(false)
              setAnchorEl(componentContainer)
            }

            if (value === FROM_DATE_UNTIL_NOW) {
              const now = new Date()
              setDatepickerMode(FROM_DATE_UNTIL_NOW)
              setSelectedRange({ from: startOfDay(now), to: now })
              return
            }

            if (value === 'custom-fixed-date-range') {
              setDatepickerMode(CUSTOM_DATE_RANGE)
              return
            }

            if (value === 'last-n') {
              event?.stopPropagation()
              setSelectedOption(getLastNOption())
              return
            }

            setSelectedOption(options?.find((option) => option.uid === value))
          }}
        >
          {!disableOptions &&
            options?.map((option) => (
              <Option key={option.uid} value={option.uid}>
                {option.label}
              </Option>
            ))}
          {!disableCustomRelative && (
            <Option value="last-n" className={componentStyles.lastN}>
              In the last
              {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events */}
              <div onClick={(event) => event.stopPropagation()}>
                <Input
                  type="number"
                  value={lastN}
                  size="small"
                  role="spinbutton"
                  onChange={onLastNChange}
                  style={{ width: 50, padding: `${theme?.spacingXs} ${theme?.spacingMd}` }}
                />{' '}
                <Select
                  value={lastNOption}
                  size="small"
                  onChange={onLastNOption}
                  style={{ padding: `${theme?.spacingXs} ${theme?.spacingMd}` }}
                >
                  {lastNOptions.map(({ label }) => (
                    <Option key={label} value={label}>
                      {label}
                    </Option>
                  ))}
                </Select>
              </div>
            </Option>
          )}
          {(!disableDateUntilNow || !disableCustomRange) && <Divider />}
          {!disableDateUntilNow && <Option value={FROM_DATE_UNTIL_NOW}>From custom date until now...</Option>}
          {!disableCustomRange && <Option value={CUSTOM_DATE_RANGE}>Custom fixed date range</Option>}
        </Select>
        <Popper
          open={popupOpen}
          anchorEl={anchorEl}
          placement="bottom-start"
          slots={{
            root: 'div'
          }}
          modifiers={[
            { name: 'flip', enabled: false },
            { name: 'preventOverflow', enabled: false }
          ]}
          disablePortal
        >
          <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
            <div className={componentStyles.timeRangePicker}>
              <div className={componentStyles.timeRangePickerHeader}>
                <Typography variant="textMdSemibold">
                  Select a {datepickerMode === FROM_DATE_UNTIL_NOW ? 'start date' : 'date range'}
                </Typography>
                <CloseIcon
                  style={{ cursor: 'pointer', padding: theme?.spacingSm, margin: `-${theme?.spacing3xl}` }}
                  onClick={onCancel}
                />
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
                onSelect={(value) => {
                  if (value && datepickerMode === FROM_DATE_UNTIL_NOW) {
                    setDatepickerRange({ from: value.from, to: new Date() })
                    return
                  }
                  setDatepickerRange(value ?? null)
                }}
              />
              <div
                className={componentStyles.timeRangePickerInputs}
                style={{ width: datepickerMode === CUSTOM_DATE_RANGE ? 576 : 264 }}
              >
                <DateTimeField rangeRole="from" dateRange={datepickerRange} onChange={setDatepickerRange} />
                {datepickerMode === CUSTOM_DATE_RANGE && (
                  <DateTimeField rangeRole="to" dateRange={datepickerRange} onChange={setDatepickerRange} />
                )}
              </div>
              {datepickerRange?.from && datepickerRange?.to && (
                <>
                  <Divider as="div" />
                  <div className={componentStyles[datepickerMode]}>
                    <Typography variant="textXsRegular">
                      <span style={{ color: theme?.textQuarterary }}>Start:</span>{' '}
                      {format(datepickerRange.from, CUSTOM_RANGE_FORMAT)}
                    </Typography>
                    <Typography variant="textXsRegular">
                      <span style={{ color: theme?.textQuarterary }}>End:</span>{' '}
                      {datepickerMode === FROM_DATE_UNTIL_NOW
                        ? `Now ${format(datepickerRange.to, 'MMMM dd, yyyy')}`
                        : format(datepickerRange.to, CUSTOM_RANGE_FORMAT)}
                    </Typography>
                  </div>
                </>
              )}
              <Divider as="div" />
              <div className={componentStyles.timeRangePickerActions}>
                {datepickerMode === CUSTOM_DATE_RANGE && (
                  <div style={{ flex: 4, display: 'flex' }}>
                    <Button size="small" style={{ flex: 0.25 }} overridable onClick={onClear}>
                      Clear
                    </Button>
                  </div>
                )}
                <Button size="small" overridable style={{ flex: 1 }} onClick={onCancel}>
                  Cancel
                </Button>
                <Button size="small" overridable variant="primary" style={{ flex: 1 }} onClick={onApply}>
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
