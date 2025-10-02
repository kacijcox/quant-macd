import React from 'react';
import { PerformanceMetrics } from '../../types';
import './PerformanceTicket.css';

interface PerformanceTicketProps {
  metrics: PerformanceMetrics;
  tokenSymbol: string;
  timeframe: string;
  loading?: boolean;
}

const PerformanceTicket: React.FC<PerformanceTicketProps> = ({
  metrics,
  tokenSymbol,
  timeframe,
  loading = false
}) => {
  const formatPercentage = (value: number): string => {
    return `${(value * 100).toFixed(2)}%`;
  };

  const formatDecimal = (value: number, decimals: number = 4): string => {
    return value.toFixed(decimals);
  };

  const getMetricClass = (value: number, isPositiveBetter: boolean = true): string => {
    if (value > 0) {
      return isPositiveBetter ? 'positive' : 'negative';
    } else if (value < 0) {
      return isPositiveBetter ? 'negative' : 'positive';
    }
    return 'neutral';
  };

  if (loading) {
    return (
      <div className="performance-ticket loading">
        <div className="ticket-header">
          <div className="loading-spinner"></div>
          <span>Calculating Performance...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="performance-ticket">
      <div className="ticket-header">
        <h3>📊 Performance Analysis</h3>
        <div className="ticket-meta">
          <span className="token-symbol">{tokenSymbol}</span>
          <span className="timeframe">{timeframe}</span>
        </div>
      </div>

      <div className="metrics-grid">
        {/* Returns Section */}
        <div className="metric-section">
          <h4>📈 Returns</h4>
          <div className="metric-row">
            <span className="metric-label">Total Return</span>
            <span className={`metric-value ${getMetricClass(metrics.totalReturn)}`}>
              {formatPercentage(metrics.totalReturn)}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Annualized Return</span>
            <span className={`metric-value ${getMetricClass(metrics.annualizedReturn)}`}>
              {formatPercentage(metrics.annualizedReturn)}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Max Drawdown</span>
            <span className={`metric-value ${getMetricClass(metrics.maxDrawdown, false)}`}>
              {formatPercentage(metrics.maxDrawdown)}
            </span>
          </div>
        </div>

        {/* Risk Metrics Section */}
        <div className="metric-section">
          <h4>⚡ Risk Metrics</h4>
          <div className="metric-row">
            <span className="metric-label">Sharpe Ratio</span>
            <span className={`metric-value ${getMetricClass(metrics.sharpeRatio)}`}>
              {formatDecimal(metrics.sharpeRatio, 2)}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Sortino Ratio</span>
            <span className={`metric-value ${getMetricClass(metrics.sortinoRatio)}`}>
              {formatDecimal(metrics.sortinoRatio, 2)}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Volatility</span>
            <span className={`metric-value ${getMetricClass(metrics.volatility, false)}`}>
              {formatPercentage(metrics.volatility)}
            </span>
          </div>
        </div>

        {/* Value at Risk Section */}
        <div className="metric-section">
          <h4>🎯 Value at Risk</h4>
          <div className="metric-row">
            <span className="metric-label">VaR (95%)</span>
            <span className={`metric-value ${getMetricClass(metrics.var95, false)}`}>
              {formatPercentage(metrics.var95)}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">VaR (99%)</span>
            <span className={`metric-value ${getMetricClass(metrics.var99, false)}`}>
              {formatPercentage(metrics.var99)}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">CVaR (95%)</span>
            <span className={`metric-value ${getMetricClass(metrics.cvar95, false)}`}>
              {formatPercentage(metrics.cvar95)}
            </span>
          </div>
        </div>

        {/* Trading Statistics */}
        <div className="metric-section">
          <h4>📊 Statistics</h4>
          <div className="metric-row">
            <span className="metric-label">Win Rate</span>
            <span className={`metric-value ${getMetricClass(metrics.winRate)}`}>
              {formatPercentage(metrics.winRate)}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Profit Factor</span>
            <span className={`metric-value ${getMetricClass(metrics.profitFactor - 1)}`}>
              {formatDecimal(metrics.profitFactor, 2)}
            </span>
          </div>
          <div className="metric-row">
            <span className="metric-label">Kelly Criterion</span>
            <span className={`metric-value ${getMetricClass(metrics.kellyCriterion)}`}>
              {formatPercentage(metrics.kellyCriterion)}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Rating */}
      <div className="performance-rating">
        <div className="rating-label">Overall Rating:</div>
        <div className={`rating-badge ${getRatingClass(metrics.sharpeRatio)}`}>
          {getPerformanceRating(metrics.sharpeRatio)}
        </div>
      </div>

      <div className="ticket-footer">
        <small>⚠️ Past performance does not guarantee future results</small>
      </div>
    </div>
  );
};

const getRatingClass = (sharpeRatio: number): string => {
  if (sharpeRatio > 2) return 'excellent';
  if (sharpeRatio > 1) return 'good';
  if (sharpeRatio > 0) return 'fair';
  return 'poor';
};

const getPerformanceRating = (sharpeRatio: number): string => {
  if (sharpeRatio > 2) return 'EXCELLENT';
  if (sharpeRatio > 1) return 'GOOD';
  if (sharpeRatio > 0) return 'FAIR';
  return 'POOR';
};

export default PerformanceTicket;