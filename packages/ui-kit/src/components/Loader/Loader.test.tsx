import React from 'react'
import { render } from '@testing-library/react'
import { Loader } from './Loader'

describe('Loader', () => {
  it('renders the Loader', () => {
    const { getByRole } = render(<Loader />)
    const loader = getByRole('alert')

    expect(loader).toBeInTheDocument()
  })

  it('renders loader animation correctly', () => {
    const { getByTestId } = render(<Loader />)
    const loaderAnimation = getByTestId('loader-animation')

    expect(loaderAnimation).toBeInTheDocument()
  })

  it('renders text when isText is true', () => {
    const { container } = render(<Loader isText />)
    const loaderAnimation = container.querySelector('p')

    expect(loaderAnimation?.textContent).toBe('Loading...')
  })
})
