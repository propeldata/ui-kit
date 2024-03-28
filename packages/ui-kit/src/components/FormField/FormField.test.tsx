import { render, screen } from '@testing-library/react'
import React from 'react'
import { FormField } from './FormField'

jest.mock('./FormField.module.scss', () => ({
  formField: 'formField'
}))

describe('FormField', () => {
  const label = 'Test Label'
  const childText = 'Child content'

  it('renders the label and children', () => {
    render(
      <FormField label={label}>
        <div>{childText}</div>
      </FormField>
    )

    const labelElement = screen.getByTestId('typography')
    expect(labelElement).toHaveTextContent(label)

    const childElement = screen.getByText(childText)
    expect(childElement).toBeInTheDocument()
  })

  it('applies additional class names', () => {
    const additionalClass = 'my-custom-class'

    render(
      <FormField label={label} className={additionalClass}>
        <div>{childText}</div>
      </FormField>
    )

    const formFieldElement = screen.getByTestId('form-field')
    expect(formFieldElement).toHaveClass('formField')
    expect(formFieldElement).toHaveClass(additionalClass)
  })
})
