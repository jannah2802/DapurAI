import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error('UI error:', error)
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="mx-auto flex min-h-screen w-full max-w-xl items-center px-4">
          <section className="y2k-shell w-full p-6 text-center">
            <h2 className="font-impact text-2xl uppercase text-iosRed">Ada ralat pada paparan</h2>
            <p className="mt-2 font-ios text-sm">Sila refresh semula halaman ini.</p>
          </section>
        </main>
      )
    }

    return this.props.children
  }
}
