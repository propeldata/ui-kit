import classNames from 'classnames'
import React from 'react'
import { Typography } from '../Typography'
import componentStyles from './FormField.module.scss'

export interface FormFieldProps extends React.ComponentPropsWithoutRef<'fieldset'> {
  label: string
  children: React.ReactNode
}

export const FormField = ({ label, children, ...rest }: FormFieldProps) => (
  <fieldset data-testid="form-field" {...rest} className={classNames(componentStyles.rootFormField, rest.className)}>
    <Typography size={1} as="label">
      {label}
    </Typography>
    {children}
  </fieldset>
)
