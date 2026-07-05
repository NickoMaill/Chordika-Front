import React, { ReactNode } from 'react';
import { AppError, ErrorTypeEnum } from './appError';
import ErrorHandler from './ErrorHandler';

interface ErrorBoundaryState {
    hasError: boolean;
    error: AppError | Error | null;
    type: 'App' | 'JS' | 'unknown' | null;
    resetKeys?: number;
}

class AppErrorBoundary extends React.Component<React.PropsWithChildren<unknown>, ErrorBoundaryState> {
    constructor(props: React.PropsWithChildren<unknown>) {
        super(props);
        this.state = { hasError: false, error: null, resetKeys: 0, type: null };
    }

    static getDerivedStateFromError(error: unknown): ErrorBoundaryState {
        if (error instanceof AppError) {
            const isBlocking = error.type !== ErrorTypeEnum.Functional;
            return { hasError: isBlocking, error, type: 'App' };
        }

        if (error instanceof Error) {
            return { hasError: true, error, type: 'JS' };
        }

        return { hasError: true, error: new Error('Unknown application error'), type: 'unknown' };
    }

    componentDidCatch(error: unknown, errorInfo: React.ErrorInfo): void {
        console.error('Erreur capturée :', error, errorInfo);
        const err = AppErrorBoundary.getDerivedStateFromError(error);
        this.setState((prevState) => ({
            hasError: err.hasError,
            error: err.error,
            type: err.type,
            resetKeys: prevState.resetKeys,
        }));
    }

    handleRestart = (): void => {
        window.location.reload(); // Recharge l'application
    };

    handleBackNavigation = (): void => {
        this.setState((prevState) => ({
            hasError: false,
            error: null,
            type: null,
            resetKeys: (prevState.resetKeys ?? 0) + 1,
        }));
    };

    componentDidMount(): void {
        window.addEventListener('popstate', this.handleBackNavigation);
    }

    componentWillUnmount(): void {
        window.removeEventListener('popstate', this.handleBackNavigation);
    }

    render(): ReactNode {
        if (this.state.hasError && this.state.error) {
            return <ErrorHandler error={this.state.error} resetErrorBoundary={this.handleRestart} />;
        }

        return this.props.children;
    }
}

export default AppErrorBoundary;
