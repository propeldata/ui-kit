import React from 'react'
import { Counter, RelativeTimeRange } from '@propeldata/react-counter'

export function CounterConnectedTest() {
  const [fontColor, setFontColor] = React.useState('#000')

  return (
    <div className="p-4 border-2 bg-neutral-100 border-slate-600 rounded m-3">
      <h2 className="text-2xl">Counter Connected</h2>
      <div className="h-60 flex justify-center items-center">
        <Counter
          query={{
            accessToken:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdXRoX3RpbWUiOjE2ODE1MzQ4MTYsImNsaWVudF9pZCI6IjM1cjF1cGlqa2hnam0wOXMxMWhyZDRjMnB1IiwiZXhwIjoxNjgxNTM4NDE2LCJpYXQiOjE2ODE1MzQ4MTYsImlzcyI6Imh0dHBzOi8vYXV0aC51cy1lYXN0LTIucHJvcGVsZGF0YS5jb20iLCJqdGkiOiI1OGJiOTY2ZS1lNjU0LTRhZjEtYjM3ZC0wYWEyMWZjZWNiZWYiLCJwcm9wZWwvdGVuYW50IjoiRU5WMDFGWEpKRlJOSDhKMVJCWDdDQ1YyQVBEMU4iLCJzY29wZSI6Im1ldHJpYzpxdWVyeSIsInN1YiI6IjM1cjF1cGlqa2hnam0wOXMxMWhyZDRjMnB1IiwidG9rZW5fdXNlIjoiYWNjZXNzIiwidmVyc2lvbiI6MX0.iTekHJoOZ_XM7s9HK-9BgJUw3X1dPbNEo-wi_16GBQE',
            metric: 'queryCount',
            timeRange: {
              relative: RelativeTimeRange.LastNDays,
              n: 30
            }
          }}
          styles={{ font: { size: '3rem', color: fontColor } }}
        />
      </div>
      <div className="flex items-center gap-2">
        <input
          className="border-2 bg-white p-1 h-9"
          type="color"
          onChange={(event) => setFontColor(event.target.value)}
        />
      </div>
    </div>
  )
}
