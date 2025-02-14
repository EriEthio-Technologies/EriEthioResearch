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

export default function ErrorBoundary({ children, fallback }: ErrorBoundaryProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = (error: Error, info: ErrorInfo) => {
    logSecurityEvent('component_error', {
      error: error.toString(),
      stack: info.componentStack
    });
    setHasError(true);
  };

  return hasError ? fallback : children;
} 