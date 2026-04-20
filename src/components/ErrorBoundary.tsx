import { Component, type ErrorInfo, type ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center space-y-6">
          <div className="w-20 h-20 bg-danger/20 rounded-3xl flex items-center justify-center text-danger">
            <AlertTriangle className="w-10 h-10" />
          </div>
          <div>
            <h2 className="text-2xl font-black tracking-tighter">Something went wrong</h2>
            <p className="text-text-secondary mt-2 max-w-xs mx-auto">
              BeatTheCrowd encountered a dashboard error. We are using cached stadium data for now.
            </p>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 bg-primary px-6 py-3 rounded-2xl font-bold text-white shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all"
          >
            <RefreshCcw className="w-4 h-4" />
            Reload Dashboard
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
