// components/ErrorBoundary.tsx

import React from 'react';

interface ErrorBoundaryProps {
    children: React.ReactNode; // Define o tipo de children
}

interface ErrorBoundaryState {
    hasError: boolean;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError() {
        return { hasError: true };
    }

    componentDidCatch(error: Error) {
        console.error("Erro capturado:", error);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Algo deu errado.</h1>;
        }

        return this.props.children; 
    }
}

export default ErrorBoundary;
