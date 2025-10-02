import React from 'react';
import { StatisticalMetrics } from '@/types';
import './RiskPanel.styles.css';

interface RiskPanelProps {
    statistics: StatisticalMetrics | null;
}

const RiskPanel: React.FC<RiskPanelProps> = ({ statistics }) => {
    const riskMetrics = [
        {
            label: 'VAR (95%)',
            value: statistics?.valueAtRisk || 0,
            suffix: '%'
        },
        {
            label: 'MAX DRAWDOWN',
            value: statistics?.maxDrawdown || 0,
            suffix: '%'
        },
        {
            label: 'KELLY CRITERION',
            value: statistics?.kellyCriterion || 0,
            suffix: '%'
        },
        {
            label: 'SORTINO RATIO',
            value: statistics?.sortinoRatio || 0,
            suffix: ''
        }
    ];

    return (
        <div className="risk-panel">
            <div className="matrix-title">RISK METRICS</div>
            <div className="risk-grid">
                {riskMetrics.map((metric, index) => (
                    <div key={index} className="risk-item">
                        <div className="risk-label">{metric.label}</div>
                        <div className="risk-value">
                            {metric.value.toFixed(2)}{metric.suffix}
                        </div>
                    </div>
                ))}
            </div>

            <div className="performance-ticker">
                <div className="ticker-content">
          <span className="ticker-item">
            SIGNALS TODAY: <span className="ticker-value">12</span>
          </span>
                    <span className="ticker-item">
            WIN RATE: <span className="ticker-value">67.5%</span>
          </span>
                    <span className="ticker-item">
            AVG RETURN: <span className="ticker-value">2.34%</span>
          </span>
                    <span className="ticker-item">
            PROFIT FACTOR: <span className="ticker-value">2.15</span>
          </span>
                    <span className="ticker-item">
            CALMAR RATIO: <span className="ticker-value">1.82</span>
          </span>
                </div>
            </div>
        </div>
    );
};

export default RiskPanel;