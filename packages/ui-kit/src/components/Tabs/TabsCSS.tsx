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
  position: relative !important;
  border-radius: var(--propel-radius-5);
}

.rt-BaseTabList:has(.propel-Card) .rt-TabsTrigger::before {
  display: block;
  position: absolute;
  bottom: 0;
  border-radius: var(--propel-radius-5);
  z-index: 1;
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
