import classNames from 'classnames'
import React from 'react'
import { Typography } from '../Typography'
import componentStyles from './FormField.module.scss'

export interface FormFieldProps extends React.ComponentPropsWithoutRef<'fieldset'> {
  label: string
  children: React.ReactNode
}

export const FormField = ({ label, children, ...rest }: FormFieldProps) => (
  <fieldset {...rest} className={classNames(componentStyles.rootFormField, rest.className)} data-testid="form-field">
    <Typography variant="textXsRegular" as="label">
      {label}
    </Typography>
    {children}
  </fieldset>
)
