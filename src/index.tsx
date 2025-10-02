import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Get root element
const rootElement = document.getElementById('root');

if (!rootElement) {
    throw new Error('Failed to find root element');
}

// Create React root
const root = ReactDOM.createRoot(rootElement);

// Render app
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);