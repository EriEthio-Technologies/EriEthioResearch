'use client';

import { Component, ErrorInfo, ReactNode } from 'react';
import { logSecurityEvent } from '@/lib/audit';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    logSecurityEvent('component_error', {
      error: error.toString(),
      stack: info.componentStack
    });
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
} 