import React from 'react';
import { TimeframeSignal } from '@/types';
import './SignalMatrix.styles.css';

interface SignalMatrixProps {
    timeframeSignals: TimeframeSignal[];
}

const SignalMatrix: React.FC<SignalMatrixProps> = ({ timeframeSignals }) => {
    const getSignalColor = (signal: string) => {
        switch (signal) {
            case 'BULL': return '#0f0';
            case 'BEAR': return '#f00';
            default: return '#ff0';
        }
    };

    const getSignalClass = (signal: string) => {
        switch (signal) {
            case 'BULL': return 'signal-bull';
            case 'BEAR': return 'signal-bear';
            default: return 'signal-neutral';
        }
    };

    // Static signals for display
    const staticSignals = [
        { label: 'DIVERGENCE', value: 'SCANNING', active: true },
        { label: 'MOMENTUM', value: '45%', active: false },
        { label: 'VOLATILITY', value: '12.5%', active: false }
    ];

    return (
        <div className="signal-matrix">
            <div className="matrix-title">MULTI-TIMEFRAME SIGNAL MATRIX</div>
            <div className="signal-grid">
                {timeframeSignals.map((tf, index) => (
                    <div
                        key={tf.timeframe}
                        className={`signal-cell ${tf.strength > 70 ? 'active' : ''}`}
                    >
                        <div className="signal-label">{tf.timeframe.toUpperCase()}</div>
                        <div
                            className={`signal-value ${getSignalClass(tf.signal)}`}
                            style={{ color: getSignalColor(tf.signal) }}
                        >
                            {tf.signal}
                        </div>
                        <div className="signal-strength">{tf.strength.toFixed(0)}%</div>
                    </div>
                ))}

                {/* Fill empty cells if less than 6 timeframes */}
                {timeframeSignals.length < 6 &&
                    Array(6 - timeframeSignals.length).fill(0).map((_, i) => (
                        <div key={`empty-${i}`} className="signal-cell">
                            <div className="signal-label">--</div>
                            <div className="signal-value">--</div>
                        </div>
                    ))
                }

                {/* Static signals */}
                {staticSignals.map((signal, index) => (
                    <div
                        key={signal.label}
                        className={`signal-cell ${signal.active ? 'active' : ''}`}
                    >
                        <div className="signal-label">{signal.label}</div>
                        <div className="signal-value">{signal.value}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SignalMatrix;