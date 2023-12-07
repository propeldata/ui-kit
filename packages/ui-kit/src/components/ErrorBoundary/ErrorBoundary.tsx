import React, { Component } from 'react'

interface Props {
  children: React.ReactNode
  fallback: React.ReactNode
}

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  // Will add logs later
  static getDerivedStateFromError(_error: Error) {
    return { hasError: true }
  }

  componentDidCatch(error: Error, _errorInfo: React.ErrorInfo) {
    // console.error(error, errorInfo) we will set logs as a feature later
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback
    }
    return this.props.children
  }
}
