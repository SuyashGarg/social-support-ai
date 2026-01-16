import type { ReactNode } from 'react'
import React from 'react'

type Props = {
    children: ReactNode
}

type State = {
    hasError: boolean
}

export default class ErrorBoundary extends React.Component<Props, State> {
    state: State = { hasError: false }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: unknown, info: unknown) {
        console.error('App crashed', error, info)
    }

    render() {
        if (this.state.hasError) {
            return (
                <div role="alert" style={{ padding: 24 }}>
                    Something went wrong.
                </div>
            )
        }

        return this.props.children
    }
}
