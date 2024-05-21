import React from 'react'
import componentStyles from './ValueBar.module.scss'

export interface LeaderBoardValueProps {
  value: number
  maxValue: number
}

export function ValueBar({ value, maxValue }: LeaderBoardValueProps) {
  const barWidth = `${Math.max(3, Math.ceil((value * 100) / maxValue))}%`
  return (
    <div className={componentStyles.rootValueBar} data-testid="value-bar-root">
      <div className={componentStyles.bar} style={{ width: barWidth }} data-testid="value-bar" />
    </div>
  )
}
