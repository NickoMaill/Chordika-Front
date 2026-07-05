import React, { ReactNode } from 'react';
import { AppError, ErrorTypeEnum } from './appError';

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
            // Marquer comme une erreur bloquante si ce n'est pas une erreur fonctionnelle
            const isBlocking = error.type !== ErrorTypeEnum.Functional;
            return { hasError: isBlocking, error, type: 'App' };
        }
        if (error instanceof Error) {
            throw new Error(error.message);
            //.return { hasError: true, error: error, type: "JS" }; // Erreur inconnue ou non AppError
        }

        return { hasError: true, error: null, type: 'unknown' }; // Erreur inconnue ou non AppError
    }

    componentDidCatch(error: unknown, errorInfo: React.ErrorInfo): void {
        console.error('Erreur capturée :', error, errorInfo);
        const err = AppErrorBoundary.getDerivedStateFromError(error);
        this.setState({ hasError: err.hasError, error: err.error, resetKeys: this.state.resetKeys });
    }

    handleRestart = (): void => {
        window.location.reload(); // Recharge l'application
    };

    handleBackNavigation = (): void => {
        this.setState({ ...this.state, resetKeys: this.state.resetKeys + 1 });
        this.setState({ ...this.state, hasError: false });
    };

    componentDidMount(): void {
        window.addEventListener('popstate', this.handleBackNavigation);
    }

    componentWillUnmount(): void {
        window.removeEventListener('popstate', this.handleBackNavigation);
    }

    render(): ReactNode {
        // if (this.state.hasError) {
        //     const { error } = this.state;

        //     // Afficher un message spécifique si l'erreur est une AppError
        //     if (error) {
        //         if (this.state.type !== "unknown") {
        //             return <ErrorHandler error={this.state.error} resetErrorBoundary={() => null} />
        //         }
        //         // return (
        //         //     <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        //         //         <h1>Erreur Bloquante</h1>
        //         //         <p>Type : {ErrorTypeEnum[error.type]}</p>
        //         //         <p>Code : {error.code}</p>
        //         //         <p>{error.message}</p>
        //         //         {error.data && <pre>{JSON.stringify(error.data, null, 2)}</pre>}
        //         //         <button onClick={this.handleRestart}>Redémarrer l'application</button>
        //         //     </div>
        //         // );
        //     }

        //     // Message générique pour les erreurs inconnues
        //     return (
        //         <div style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>
        //             <h1>Erreur inconnue</h1>
        //             <button onClick={this.handleRestart}>Redémarrer l'application</button>
        //         </div>
        //     );
        // }

        return this.props.children;
    }
}

export default AppErrorBoundary;
