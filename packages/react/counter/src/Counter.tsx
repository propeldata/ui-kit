import React from 'react'

interface Props {
  /** If passed, the component will ignore the built-in graphql operations */
  value: string
}

export default function Counter(props: Props) {
  const { value } = props

  return <div>Counter</div>
}
