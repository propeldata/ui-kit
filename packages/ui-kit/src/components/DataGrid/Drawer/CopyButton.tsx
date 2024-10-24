import React, { useState } from 'react'
import { Tooltip } from '@radix-ui/themes'

import { CopyIcon } from '../../../components/Icons'

import componentStyles from './Drawer.module.scss'

interface Props {
  value: string
}

export function CopyButton(props: Props) {
  const { value } = props
  const [content, setContent] = useState('Copy to clipboard')

  const handleCopy = () => {
    navigator.clipboard.writeText(value)
    setContent('Copied!')
    setTimeout(() => {
      setContent('Copy to clipboard')
    }, 1000)
  }

  return (
    <Tooltip content={content} open={content === 'Copied!' || undefined}>
      <button className={componentStyles.copyButton} type="button" onClick={handleCopy}>
        <CopyIcon />
      </button>
    </Tooltip>
  )
}
