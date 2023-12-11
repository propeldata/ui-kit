import { render, screen } from '@testing-library/react'
import React from 'react'
import { ValueBar } from './ValueBar'

describe('ValueBar', () => {
  it('renders the ValueBar with the correct width based on value and maxValue', () => {
    render(<ValueBar value={50} maxValue={100} />)

    expect(screen.getByTestId('value-bar').style.width).toBe('50%')
  })
})
