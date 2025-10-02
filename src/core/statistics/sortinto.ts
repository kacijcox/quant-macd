// src/core/statistics/sortinto.ts

export function calculateSortinoRatio(
    returns: number[],
    riskFreeRate: number = 0.02,
    periods: number = 252
): number {
    if (returns.length < 2) return 0;

    const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
    const downsideReturns = returns.filter(r => r < 0);

    if (downsideReturns.length === 0) {
        return mean > riskFreeRate ? Infinity : 0;
    }

    const downsideVariance = downsideReturns.reduce((sum, r) => sum + r * r, 0) / downsideReturns.length;
    const downsideDeviation = Math.sqrt(downsideVariance);

    if (downsideDeviation === 0) return 0;

    const annualizedReturn = mean * periods;
    const annualizedDownsideDev = downsideDeviation * Math.sqrt(periods);

    return (annualizedReturn - riskFreeRate) / annualizedDownsideDev;
}