// src/components/Controls/Controls.tsx
import React from 'react';
import './Controls.styles.css';

interface ControlsProps {
    tokenAddress: string;
    setTokenAddress: (address: string) => void;
    timeframe: string;
    setTimeframe: (tf: string) => void;
    mode: 'STANDARD' | 'ADAPTIVE' | 'ML_ENHANCED';
    setMode: (mode: 'STANDARD' | 'ADAPTIVE' | 'ML_ENHANCED') => void;
    onExecute: () => void;
    loading: boolean;
}

const Controls: React.FC<ControlsProps> = ({
                                               tokenAddress,
                                               setTokenAddress,
                                               timeframe,
                                               setTimeframe,
                                               mode,
                                               setMode,
                                               onExecute,
                                               loading
                                           }) => {
    const timeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];
    const modes: Array<'STANDARD' | 'ADAPTIVE' | 'ML_ENHANCED'> = ['STANDARD', 'ADAPTIVE', 'ML_ENHANCED'];

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && !loading) {
            onExecute();
        }
    };

    return (
        <div className="controls-container">
            <div className="control-group">
                <label className="control-label">TOKEN ADDRESS</label>
                <input
                    type="text"
                    className="control-input"
                    placeholder="Enter Solana token address..."
                    value={tokenAddress}
                    onChange={(e) => setTokenAddress(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                />
            </div>

            <div className="control-row">
                <div className="control-group">
                    <label className="control-label">TIMEFRAME</label>
                    <select
                        className="control-select"
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        disabled={loading}
                    >
                        {timeframes.map((tf) => (
                            <option key={tf} value={tf}>{tf.toUpperCase()}</option>
                        ))}
                    </select>
                </div>

                <div className="control-group">
                    <label className="control-label">MODE</label>
                    <select
                        className="control-select"
                        value={mode}
                        onChange={(e) => setMode(e.target.value as 'STANDARD' | 'ADAPTIVE' | 'ML_ENHANCED')}
                        disabled={loading}
                    >
                        {modes.map((m) => (
                            <option key={m} value={m}>{m.replace('_', ' ')}</option>
                        ))}
                    </select>
                </div>

                <button
                    className={`execute-button ${loading ? 'loading' : ''}`}
                    onClick={onExecute}
                    disabled={loading || !tokenAddress}
                >
                    {loading ? 'PROCESSING...' : 'EXECUTE SCAN'}
                </button>
            </div>
        </div>
    );
};

export default Controls;