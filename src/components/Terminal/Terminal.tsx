// src/components/Terminal/Terminal.tsx
import React, { useState, useEffect } from 'react';
import './Terminal.styles.css';

const Terminal: React.FC = () => {
    const [displayText, setDisplayText] = useState('');
    const fullText = 'QUANTUM MACD SCANNER v1.0 // SOLANA STATISTICAL ARBITRAGE ENGINE';

    useEffect(() => {
        let currentIndex = 0;
        const interval = setInterval(() => {
            if (currentIndex <= fullText.length) {
                setDisplayText(fullText.substring(0, currentIndex));
                currentIndex++;
            } else {
                clearInterval(interval);
            }
        }, 50);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="terminal-header">
            <div className="terminal-title">{displayText}<span className="cursor">_</span></div>
            <div className="terminal-status">
                <span className="status-item">
                    <span className="status-dot active"></span> MAINNET
                </span>
                <span className="status-item">
                    <span className="status-dot active"></span> RPC CONNECTED
                </span>
                <span className="status-item">
                    <span className="status-dot active"></span> SYSTEM READY
                </span>
            </div>
        </div>
    );
};

export default Terminal;