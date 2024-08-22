'use client'

import classNames from 'classnames'
import React from 'react'
import { ThemeSettingProps, useParsedComponentProps } from '../../themes'
import { useForwardedRefCallback } from '../../helpers'
import { Typography } from '../Typography'
import componentStyles from './FormField.module.scss'
import { useSetupTheme } from '../ThemeProvider'

export interface FormFieldProps extends ThemeSettingProps, React.ComponentPropsWithoutRef<'fieldset'> {
  label: string
  children: React.ReactNode
}

export const FormField = React.forwardRef<HTMLFieldSetElement, FormFieldProps>(
  ({ label, children, ...rest }, forwardedRef) => {
    const { themeSettings, parsedProps } = useParsedComponentProps(rest)
    const { componentContainer, setRef } = useForwardedRefCallback(forwardedRef)
    useSetupTheme({ componentContainer, ...themeSettings })

    return (
      <fieldset
        ref={setRef}
        data-testid="form-field"
        {...parsedProps}
        className={classNames(componentStyles.rootFormField, rest.className)}
      >
        <Typography size={1} as="label">
          {label}
        </Typography>
        {children}
      </fieldset>
    )
  }
)

FormField.displayName = 'FormField'
