import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import './index.css';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
            <button
              onClick={() => window.location.reload()}
              className="btn-primary"
            >
              Reload page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#1F2937',
            color: '#F3F4F6',
            border: '1px solid rgba(75, 85, 99, 0.3)',
          },
          success: {
            iconTheme: {
              primary: '#F59E0B',
              secondary: '#1F2937',
            },
          },
        }}
      />
    </ErrorBoundary>
  </StrictMode>
);