import React from 'react';
import MetricCard from './MetricCard';
import { MACDResult, StatisticalMetrics, MarketRegime } from '@/types';
import './MetricsGrid.styles.css';

interface MetricsGridProps {
    macdResult: MACDResult | null;
    statistics: StatisticalMetrics | null;
    regime: MarketRegime | null;
}

const MetricsGrid: React.FC<MetricsGridProps> = ({
                                                     macdResult,
                                                     statistics,
                                                     regime
                                                 }) => {
    return (
        <div className="metrics-container">
            <MetricCard
                title="MACD VALUE"
                value={macdResult?.macd || 0}
                delta={0}
                trend={macdResult && macdResult.macd > macdResult.signal ? 'positive' : 'negative'}
                history={macdResult?.macdHistory}
            />

            <MetricCard
                title="SIGNAL LINE"
                value={macdResult?.signal || 0}
                delta={0}
                trend={macdResult && macdResult.signal > 0 ? 'positive' : 'negative'}
                history={macdResult?.signalHistory}
            />

            <MetricCard
                title="HISTOGRAM"
                value={macdResult?.histogram || 0}
                delta={0}
                trend={macdResult && macdResult.histogram > 0 ? 'positive' :
                    macdResult && macdResult.histogram < 0 ? 'negative' : 'neutral'}
                history={macdResult?.histogramHistory}
            />

            <MetricCard
                title="Z-SCORE"
                value={statistics?.zScore || 0}
                delta={Math.abs(statistics?.zScore || 0)}
                trend={statistics && Math.abs(statistics.zScore) < 1 ? 'positive' :
                    statistics && Math.abs(statistics.zScore) > 2 ? 'negative' : 'neutral'}
                suffix="σ"
            />

            <MetricCard
                title="SHARPE RATIO"
                value={statistics?.sharpeRatio || 0}
                delta={0}
                trend={statistics && statistics.sharpeRatio > 1 ? 'positive' :
                    statistics && statistics.sharpeRatio < 0 ? 'negative' : 'neutral'}
            />

            <MetricCard
                title="REGIME"
                value={regime?.regime || 'NEUTRAL'}
                delta={regime?.confidence || 0}
                trend={regime?.regime === 'BULLISH' ? 'positive' :
                    regime?.regime === 'BEARISH' ? 'negative' : 'neutral'}
                suffix="% confidence"
                isText={true}
            />
        </div>
    );
};

export default MetricsGrid;