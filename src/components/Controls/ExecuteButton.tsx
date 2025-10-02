import React, { useState, useCallback } from 'react';
import { TimeframeInterval, AnalysisMode } from '../../types';

interface ExecuteButtonProps {
    onExecute: () => Promise<void>;
    disabled?: boolean;
    loading?: boolean;
    tokenAddress: string;
    timeframe: TimeframeInterval;
    mode: AnalysisMode;
    className?: string;
}

const ExecuteButton: React.FC<ExecuteButtonProps> = ({
                                                         onExecute,
                                                         disabled = false,
                                                         loading = false,
                                                         tokenAddress,
                                                         timeframe,
                                                         mode,
                                                         className = ''
                                                     }) => {
    const [isExecuting, setIsExecuting] = useState(false);
    const [lastExecutionTime, setLastExecutionTime] = useState<number | null>(null);
    const [executionCount, setExecutionCount] = useState(0);

    const handleExecute = useCallback(async () => {
        if (disabled || loading || isExecuting) return;

        setIsExecuting(true);
        const startTime = Date.now();

        try {
            await onExecute();
            setExecutionCount(prev => prev + 1);
            setLastExecutionTime(Date.now() - startTime);
        } catch (error) {
            console.error('Execution failed:', error);
            // Could add error toast notification here
        } finally {
            setIsExecuting(false);
        }
    }, [onExecute, disabled, loading, isExecuting]);

    const getButtonText = () => {
        if (isExecuting || loading) {
            return '⚡ Executing Quantum Scan...';
        }

        if (!tokenAddress) {
            return '🔍 Enter Token Address';
        }

        return `🚀 Execute MACD Scan`;
    };

    const getButtonClass = () => {
        let classes = 'execute-button';

        if (className) classes += ` ${className}`;
        if (disabled || !tokenAddress) classes += ' disabled';
        if (isExecuting || loading) classes += ' executing';
        if (executionCount > 0) classes += ' has-executed';

        return classes;
    };

    const isButtonDisabled = disabled || !tokenAddress || isExecuting || loading;

    const formatExecutionTime = (ms: number): string => {
        if (ms < 1000) return `${ms}ms`;
        return `${(ms / 1000).toFixed(2)}s`;
    };

    return (
        <div className="execute-button-container">
            <button
                onClick={handleExecute}
                disabled={isButtonDisabled}
                className={getButtonClass()}
                type="button"
            >
        <span className="button-content">
          {(isExecuting || loading) && (
              <span className="loading-spinner">
              <div className="spinner-ring"></div>
            </span>
          )}
            <span className="button-text">
            {getButtonText()}
          </span>
        </span>

                {(isExecuting || loading) && (
                    <div className="execution-progress">
                        <div className="progress-bar">
                            <div className="progress-fill"></div>
                        </div>
                    </div>
                )}
            </button>

            {/* Execution Info */}
            <div className="execution-info">
                <div className="scan-parameters">
          <span className="param-item">
            <span className="param-label">Mode:</span>
            <span className="param-value mode">{mode}</span>
          </span>
                    <span className="param-item">
            <span className="param-label">Timeframe:</span>
            <span className="param-value timeframe">{timeframe}</span>
          </span>
                    {tokenAddress && (
                        <span className="param-item">
              <span className="param-label">Token:</span>
              <span className="param-value token">
                {tokenAddress.slice(0, 8)}...{tokenAddress.slice(-6)}
              </span>
            </span>
                    )}
                </div>

                {executionCount > 0 && (
                    <div className="execution-stats">
            <span className="stat-item">
              <span className="stat-label">Executions:</span>
              <span className="stat-value">{executionCount}</span>
            </span>
                        {lastExecutionTime && (
                            <span className="stat-item">
                <span className="stat-label">Last Duration:</span>
                <span className="stat-value">{formatExecutionTime(lastExecutionTime)}</span>
              </span>
                        )}
                    </div>
                )}
            </div>

            {/* Validation Messages */}
            {!tokenAddress && (
                <div className="validation-message">
                    ⚠️ Please enter a valid Solana token address
                </div>
            )}

            {tokenAddress && tokenAddress.length !== 44 && (
                <div className="validation-message">
                    ⚠️ Invalid token address format (must be 44 characters)
                </div>
            )}

            {/* Quick Actions */}
            {tokenAddress && !isExecuting && !loading && (
                <div className="quick-actions">
                    <button
                        onClick={() => handleExecute()}
                        className="quick-action-btn"
                        disabled={isButtonDisabled}
                    >
                        ⚡ Quick Scan
                    </button>
                    <button
                        onClick={() => {
                            // Could implement deep analysis mode
                            console.log('Deep analysis not yet implemented');
                        }}
                        className="quick-action-btn secondary"
                        disabled={isButtonDisabled}
                    >
                        🔬 Deep Analysis
                    </button>
                </div>
            )}
        </div>
    );
};

export default ExecuteButton;