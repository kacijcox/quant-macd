import React from 'react';
import MiniChart from './MiniChart';
import './MetricCard.styles.css';

interface MetricCardProps {
    title: string;
    value: number | string;
    delta: number;
    trend: 'positive' | 'negative' | 'neutral';
    history?: number[];
    suffix?: string;
    isText?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({
                                                   title,
                                                   value,
                                                   delta,
                                                   trend,
                                                   history,
                                                   suffix = '',
                                                   isText = false
                                               }) => {
    const getTrendIcon = () => {
        switch (trend) {
            case 'positive': return '⬤';
            case 'negative': return '⬤';
            case 'neutral': return '⬤';
        }
    };

    const getTrendColor = () => {
        switch (trend) {
            case 'positive': return '#0f0';
            case 'negative': return '#f00';
            case 'neutral': return '#ff0';
        }
    };

    return (
        <div className="metric-card">
            <div className="metric-header">
                <span>{title}</span>
                <span style={{ color: getTrendColor() }}>{getTrendIcon()}</span>
            </div>

            <div className={`metric-value ${trend}`}>
                {isText ? value : typeof value === 'number' ? value.toFixed(6) : value}
            </div>

            <div className={`metric-delta ${trend}`}>
                {delta !== 0 ? `Δ ${delta.toFixed(2)}${suffix}` : suffix}
            </div>

            {history && history.length > 0 && (
                <MiniChart data={history} color={getTrendColor()} />
            )}
        </div>
    );
};

export default MetricCard;