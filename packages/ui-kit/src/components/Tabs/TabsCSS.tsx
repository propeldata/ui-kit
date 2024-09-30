'use client'

import React, { useEffect } from 'react'
import styleInject from 'style-inject'

export const TabsCSS = () => {
  useEffect(() => {
    if (typeof window !== 'undefined') {
      styleInject(`.rt-BaseTabList:has(.propel-Card) {
  all: unset;
  width: 100%;
}

.rt-BaseTabList:has(.propel-Card) .rt-TabsTrigger {
  all: unset !important;
  display: block !important;
  box-sizing: border-box;
  inline-size: 100% !important;
}

.rt-BaseTabList:has(.propel-Card) .rt-TabsTrigger::before {
  display: none !important;
}

.rt-BaseTabList:has(.propel-Card) .rt-TabsTrigger > .rt-TabsTriggerInner {
  all: unset !important;
  display: block !important;
}

.rt-BaseTabList:has(.propel-Card) .rt-TabsTrigger > .rt-TabsTriggerInnerHidden {
  display: none;
}
      `)
    }
  }, [])

  return <></>
}
