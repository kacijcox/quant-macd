import React from 'react';
import Terminal from '../Terminal/Terminal';
import Controls from '../Controls/Controls';
import MetricsGrid from '../Metrics/MetricsGrid';
import SignalMatrix from '../Analysis/SignalMatrix';
import CorrelationMatrix from '../Analysis/CorrelationMatrix';
import RiskPanel from '../Analysis/RiskPanel';
import Console from '../Terminal/Console';
import MatrixRain from '../Terminal/MatrixRain';
import {
    MACDResult,
    StatisticalMetrics,
    MarketRegime,
    TimeframeSignal
} from '@/types';
import './Dashboard.styles.css';

interface DashboardProps {
    tokenAddress: string;
    setTokenAddress: (address: string) => void;
    timeframe: string;
    setTimeframe: (tf: string) => void;
    mode: 'STANDARD' | 'ADAPTIVE' | 'ML_ENHANCED';
    setMode: (mode: 'STANDARD' | 'ADAPTIVE' | 'ML_ENHANCED') => void;
    loading: boolean;
    onExecute: () => void;
    macdResult: MACDResult | null;
    statistics: StatisticalMetrics | null;
    regime: MarketRegime | null;
    timeframeSignals: TimeframeSignal[];
    consoleMessages: string[];
}

const Dashboard: React.FC<DashboardProps> = ({
                                                 tokenAddress,
                                                 setTokenAddress,
                                                 timeframe,
                                                 setTimeframe,
                                                 mode,
                                                 setMode,
                                                 loading,
                                                 onExecute,
                                                 macdResult,
                                                 statistics,
                                                 regime,
                                                 timeframeSignals,
                                                 consoleMessages
                                             }) => {
    return (
        <div className="dashboard">
            <MatrixRain />

            <div className="dashboard-container">
                <Terminal />

                <Controls
                    tokenAddress={tokenAddress}
                    setTokenAddress={setTokenAddress}
                    timeframe={timeframe}
                    setTimeframe={setTimeframe}
                    mode={mode}
                    setMode={setMode}
                    onExecute={onExecute}
                    loading={loading}
                />

                <MetricsGrid
                    macdResult={macdResult}
                    statistics={statistics}
                    regime={regime}
                />

                <div className="analysis-grid">
                    <SignalMatrix timeframeSignals={timeframeSignals} />
                    <CorrelationMatrix correlation={statistics?.correlation} />
                </div>

                <RiskPanel statistics={statistics} />

                <Console messages={consoleMessages} />
            </div>

            {loading && (
                <div className="loading-overlay">
                    <div className="loading-text">PROCESSING QUANTUM STATE...</div>
                </div>
            )}
        </div>
    );
};

export default Dashboard;