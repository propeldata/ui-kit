import React from 'react'
import '@propeldata/wc-counter'

export default {
  title: 'wc-counter'
}

const Template = () => (
  <wc-counter value="1,283" prefixValue="$" styles={JSON.stringify({ position: 'center-right' })}></wc-counter>
)

export const Basic = Template.bind({})
