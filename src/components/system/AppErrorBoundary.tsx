import React from 'react'

type State = {
  hasError: boolean
  message: string
}

class AppErrorBoundary extends React.Component<React.PropsWithChildren, State> {
  state: State = {
    hasError: false,
    message: '',
  }

  static getDerivedStateFromError(error: unknown): State {
    return {
      hasError: true,
      message: error instanceof Error ? error.message : 'Unexpected startup error.',
    }
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children
    }

    const isFirebaseEnvError = this.state.message.includes('Missing Firebase env vars')

    return (
      <main className="flex min-h-screen items-center justify-center bg-[color:var(--bg-primary)] px-6">
        <section className="glass-panel-strong w-full max-w-2xl rounded-[2rem] p-7 text-[color:var(--text-primary)] sm:p-9">
          <h1 className="text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">Application startup error</h1>
          <p className="mt-3 text-sm leading-6 text-[color:var(--text-secondary)]">The app hit a runtime error during initialization.</p>

          <div className="mt-5 rounded-2xl border border-rose-500/35 bg-rose-500/10 px-4 py-3 text-sm text-rose-700 dark:text-rose-100">
            {this.state.message}
          </div>

          {isFirebaseEnvError ? (
            <div className="mt-5 rounded-2xl border border-[color:var(--border-color)] bg-[color:var(--card-bg)]/85 p-4 text-sm leading-6 text-[color:var(--text-secondary)]">
              Fix: set all VITE_FIREBASE_* variables in your hosting build environment, rebuild, and redeploy.
            </div>
          ) : null}
        </section>
      </main>
    )
  }
}

export default AppErrorBoundary