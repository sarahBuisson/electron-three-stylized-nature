import { Component, type ErrorInfo, type ReactNode } from 'react'

interface CanvasErrorBoundaryProps {
  children: ReactNode
  onRetry: () => void
}

interface CanvasErrorBoundaryState {
  error: Error | null
  errorInfo: ErrorInfo | null
}

export class CanvasErrorBoundary extends Component<CanvasErrorBoundaryProps, CanvasErrorBoundaryState> {
  state: CanvasErrorBoundaryState = { error: null, errorInfo: null }

  static getDerivedStateFromError(error: Error): CanvasErrorBoundaryState {
    return { error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Erreur dans le canvas Three Fiber', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  handleRetry = () => {
    this.setState({ error: null, errorInfo: null })
    this.props.onRetry()
  }

  render() {
    const { error, errorInfo } = this.state
    if (error) {
      return (
        <div className="gameplay-canvas-error" role="alert" aria-live="assertive">
          <div className="gameplay-canvas-error__panel">
            <h2>Erreur Canvas / React Three Fiber</h2>
            <p>Une erreur a ete detectee dans la scene 3D. Voici les details pour le debug :</p>
            <div className="gameplay-canvas-error__section">
              <h3>Message</h3>
              <pre>{error.message}</pre>
            </div>
            {error.stack && (
              <div className="gameplay-canvas-error__section">
                <h3>Stack</h3>
                <pre>{error.stack}</pre>
              </div>
            )}
            {errorInfo?.componentStack && (
              <div className="gameplay-canvas-error__section">
                <h3>Component stack</h3>
                <pre>{errorInfo.componentStack}</pre>
              </div>
            )}
            <div className="gameplay-canvas-error__tips">
              <strong>Pistes rapides :</strong>
              <ul>
                <li>Verifier les imports de composants Drei / Fiber</li>
                <li>Contrôler le shader et ses uniforms</li>
                <li>Inspecter les colliders Rapier ou la texture Canvas</li>
              </ul>
            </div>
            <button type="button" className="gameplay-canvas-error__retry" onClick={this.handleRetry}>
              Recharger le canvas
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

