import React from 'react';

const LoadingSpinner = () => (
    <main style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }}>
        <div aria-busy="true">Loading...</div>
    </main>
);

export default LoadingSpinner;