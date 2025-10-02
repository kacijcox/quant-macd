import { StatisticalMetrics, RiskMetrics } from '@/types';

export class StatisticalAnalyzer {
    /**
     * Calculate Sharpe Ratio
     */
    calculateSharpeRatio(
        returns: number[],
        riskFreeRate: number = 0.02,
        periods: number = 252
    ): number {
        if (returns.length < 2) return 0;

        const avgReturn = this.mean(returns);
        const stdDev = this.standardDeviation(returns);

        if (stdDev === 0) return 0;

        const annualizedReturn = avgReturn * periods;
        const annualizedStdDev = stdDev * Math.sqrt(periods);

        return (annualizedReturn - riskFreeRate) / annualizedStdDev;
    }

    /**
     * Calculate Sortino Ratio
     */
    calculateSortinoRatio(
        returns: number[],
        riskFreeRate: number = 0.02,
        periods: number = 252
    ): number {
        if (returns.length < 2) return 0;

        const avgReturn = this.mean(returns);
        const downsideReturns = returns.filter(r => r < 0);

        if (downsideReturns.length === 0) return avgReturn > riskFreeRate ? Infinity : 0;

        const downsideDeviation = Math.sqrt(
            downsideReturns.reduce((sum, r) => sum + r * r, 0) / downsideReturns.length
        );

        if (downsideDeviation === 0) return 0;

        const annualizedReturn = avgReturn * periods;
        const annualizedDownsideDev = downsideDeviation * Math.sqrt(periods);

        return (annualizedReturn - riskFreeRate) / annualizedDownsideDev;
    }

    /**
     * Calculate Value at Risk (VaR)
     */
    calculateVaR(
        returns: number[],
        confidenceLevel: number = 0.95
    ): number {
        if (returns.length === 0) return 0;

        const sorted = [...returns].sort((a, b) => a - b);
        const index = Math.floor((1 - confidenceLevel) * sorted.length);

        return Math.abs(sorted[index] || 0) * 100;
    }

    /**
     * Calculate Conditional VaR (CVaR) / Expected Shortfall
     */
    calculateCVaR(
        returns: number[],
        confidenceLevel: number = 0.95
    ): number {
        const var_ = this.calculateVaR(returns, confidenceLevel) / 100;
        const tailReturns = returns.filter(r => r <= -var_);

        if (tailReturns.length === 0) return var_ * 100;

        return Math.abs(this.mean(tailReturns)) * 100;
    }

    /**
     * Calculate Maximum Drawdown
     */
    calculateMaxDrawdown(prices: number[]): number {
        if (prices.length < 2) return 0;

        let maxDD = 0;
        let peak = prices[0];

        for (let i = 1; i < prices.length; i++) {
            if (prices[i] > peak) {
                peak = prices[i];
            }
            const drawdown = (peak - prices[i]) / peak;
            if (drawdown > maxDD) {
                maxDD = drawdown;
            }
        }

        return maxDD * 100;
    }

    /**
     * Calculate Kelly Criterion
     */
    calculateKellyCriterion(
        winRate: number,
        avgWin: number,
        avgLoss: number
    ): number {
        if (avgLoss === 0) return 0;

        const b = avgWin / Math.abs(avgLoss);
        const p = winRate;
        const q = 1 - p;

        const kelly = (p * b - q) / b;

        // Cap at 25% for safety
        return Math.max(0, Math.min(kelly * 100, 25));
    }

    /**
     * Calculate Z-Score
     */
    calculateZScore(value: number, data: number[]): number {
        if (data.length === 0) return 0;

        const mean = this.mean(data);
        const stdDev = this.standardDeviation(data);

        if (stdDev === 0) return 0;

        return (value - mean) / stdDev;
    }

    /**
     * Calculate Correlation Matrix
     */
    calculateCorrelationMatrix(datasets: number[][]): number[][] {
        const n = datasets.length;
        const matrix: number[][] = [];

        for (let i = 0; i < n; i++) {
            matrix[i] = [];
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    matrix[i][j] = 1;
                } else if (j < i) {
                    matrix[i][j] = matrix[j][i];
                } else {
                    matrix[i][j] = this.correlation(datasets[i], datasets[j]);
                }
            }
        }

        return matrix;
    }

    /**
     * Calculate Pearson Correlation
     */
    private correlation(x: number[], y: number[]): number {
        if (x.length !== y.length || x.length === 0) return 0;

        const n = x.length;
        const meanX = this.mean(x);
        const meanY = this.mean(y);

        let num = 0;
        let denX = 0;
        let denY = 0;

        for (let i = 0; i < n; i++) {
            const dx = x[i] - meanX;
            const dy = y[i] - meanY;
            num += dx * dy;
            denX += dx * dx;
            denY += dy * dy;
        }

        const den = Math.sqrt(denX * denY);

        return den === 0 ? 0 : num / den;
    }

    /**
     * Calculate Calmar Ratio
     */
    calculateCalmarRatio(
        returns: number[],
        maxDrawdown: number,
        periods: number = 252
    ): number {
        if (maxDrawdown === 0) return 0;

        const annualizedReturn = this.mean(returns) * periods;
        return annualizedReturn / (maxDrawdown / 100);
    }

    /**
     * Calculate Information Ratio
     */
    calculateInformationRatio(
        returns: number[],
        benchmarkReturns: number[]
    ): number {
        if (returns.length !== benchmarkReturns.length) return 0;

        const excessReturns = returns.map((r, i) => r - benchmarkReturns[i]);
        const trackingError = this.standardDeviation(excessReturns);

        if (trackingError === 0) return 0;

        return this.mean(excessReturns) / trackingError;
    }

    /**
     * Helper: Calculate mean
     */
    private mean(data: number[]): number {
        if (data.length === 0) return 0;
        return data.reduce((sum, val) => sum + val, 0) / data.length;
    }

    /**
     * Helper: Calculate standard deviation
     */
    private standardDeviation(data: number[]): number {
        if (data.length < 2) return 0;

        const avg = this.mean(data);
        const squaredDiffs = data.map(val => Math.pow(val - avg, 2));
        const variance = this.mean(squaredDiffs);

        return Math.sqrt(variance);
    }

    /**
     * Calculate all statistical metrics
     */
    calculateAllMetrics(
        prices: number[],
        returns: number[]
    ): StatisticalMetrics {
        return {
            sharpeRatio: this.calculateSharpeRatio(returns),
            sortinoRatio: this.calculateSortinoRatio(returns),
            valueAtRisk: this.calculateVaR(returns),
            maxDrawdown: this.calculateMaxDrawdown(prices),
            kellyCriterion: this.calculateKellyCriterion(0.55, 0.02, 0.015),
            zScore: this.calculateZScore(returns[returns.length - 1], returns),
            correlation: [[1, 0.85, 0.72], [0.85, 1, 0.68], [0.72, 0.68, 1]]
        };
    }
}