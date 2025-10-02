// src/core/statistics/sharpe.ts

export function calculateSharpeRatio(
    returns: number[],
    riskFreeRate: number = 0.02,
    periods: number = 252
): number {
    if (returns.length < 2) return 0;

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return 0;

    const annualizedReturn = mean * periods;
    const annualizedStdDev = stdDev * Math.sqrt(periods);

    return (annualizedReturn - riskFreeRate) / annualizedStdDev;
}