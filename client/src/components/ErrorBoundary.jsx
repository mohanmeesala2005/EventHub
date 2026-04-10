import React from 'react';
import { Link } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled rendering error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-4">
          <div className="max-w-xl w-full bg-slate-900/95 border border-slate-700 rounded-3xl p-8 shadow-2xl">
            <div className="mb-6 text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-pink-400">Something went wrong</p>
              <h1 className="text-3xl font-bold mt-4">Unexpected error</h1>
              <p className="mt-3 text-slate-300">
                An unexpected rendering error occurred. Try refreshing or return to the home page.
              </p>
            </div>
            <div className="space-y-4">
              <pre className="whitespace-pre-wrap break-words text-xs text-slate-300 bg-slate-950 border border-slate-700 rounded-xl p-4 max-h-48 overflow-auto">
                {String(this.state.error || 'Unknown error')}
              </pre>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="w-full inline-flex justify-center rounded-xl bg-purple-500 hover:bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition"
                >
                  Try again
                </button>
                <Link
                  to="/"
                  className="w-full inline-flex justify-center rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-sm font-semibold text-white hover:border-slate-500 transition"
                >
                  Go home
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
