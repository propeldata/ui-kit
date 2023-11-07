import React from 'react'
import componentStyles from './ValueBar.module.css'

export interface LeaderBoardValueProps {
  value: number
  maxValue: number
}

export function ValueBar({ value, maxValue }: LeaderBoardValueProps) {
  const barWidth = `${Math.max(3, Math.ceil((value * 100) / maxValue))}%`
  return (
    <div className={componentStyles.rootValueBar}>
      <div
        className={componentStyles.bar}
        style={{
          // borderRadius: barWidth === '100%' ? '10px' : '10px 0 0 10px',
          width: barWidth
        }}
      />
    </div>
  )
}
