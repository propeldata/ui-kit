// import { Button } from '@mui/base/Button'
import { ClickAwayListener } from '@mui/base/ClickAwayListener'
import { Popper } from '@mui/base/Popper'
// import { Select } from '@mui/base/Select'
import React from 'react'
import { DayPicker } from 'react-day-picker'
import styles from 'react-day-picker/dist/style.module.css'
import { ChevronDownIcon } from '../Icons/ChevronDown'
import { ChevronUpIcon } from '../Icons/ChevronUp'
import { DefaultThemes } from '../ThemeProvider'
import { Select } from '../Select'
import componentStyles from './TimeRangePicker.module.scss'

export interface TimeRangePickerProps extends React.ComponentPropsWithoutRef<'div'> {
  baseTheme?: DefaultThemes
}

export const TimeRangePicker = React.forwardRef<HTMLDivElement, TimeRangePickerProps>(
  ({ baseTheme, ...rest }, forwardedRef) => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [selectedDay, setSelectedDay] = React.useState<Date>()
    const popupOpen = Boolean(anchorEl)

    const openDatePicker = (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(anchorEl ? null : event.currentTarget)
    }

    const closeDatePicker = () => {
      setAnchorEl(null)
    }

    return (
      <div ref={forwardedRef}>
        {/* <Select placeholder="Time Range">{popupOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}</Select> */}
        <Select placeholder="Time Range" options={[{ value: 'aaa', label: 'AAA' }]} />
        {/* <Button onClick={openDatePicker} style={{ display: 'block' }}>
          Time Range
          {popupOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
        </Button> */}
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
          // style={{
          //   width: anchorEl?.clientWidth,
          //   zIndex: 9999
          // }}
          disablePortal
        >
          <ClickAwayListener onClickAway={closeDatePicker}>
            <div className={componentStyles.rootTimeRangePicker}>
              <DayPicker
                mode="single"
                selected={selectedDay}
                classNames={{ ...styles }}
                modifiersClassNames={{
                  today: componentStyles.today
                }}
                onSelect={setSelectedDay}
                // {...timeRangeProps}
              />
            </div>
          </ClickAwayListener>
        </Popper>
      </div>
    )
  }
)
