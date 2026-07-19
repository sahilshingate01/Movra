import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

// A component that throws an error to test the Error Boundary
function ProblematicComponent(): React.JSX.Element {
  throw new Error('Test rendering error');
  return <div />;
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <div>Safe Content</div>
      </ErrorBoundary>
    );
    expect(screen.getByText('Safe Content')).toBeTruthy();
  });

  it('renders standard fallback UI when an error is caught', () => {
    // Suppress console.error output during this test to keep test logs clean
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeTruthy();
    expect(screen.getByText('Something went wrong')).toBeTruthy();
    expect(screen.getByText(/An unexpected error occurred/)).toBeTruthy();

    consoleErrorSpy.mockRestore();
  });

  it('renders custom fallback UI when provided', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    render(
      <ErrorBoundary fallback={<div>Custom Fail UI</div>}>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Custom Fail UI')).toBeTruthy();
    expect(screen.queryByText('Something went wrong')).toBeNull();

    consoleErrorSpy.mockRestore();
  });
});
