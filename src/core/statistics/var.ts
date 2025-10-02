// src/core/statistics/var.ts

export function calculateVaR(
    returns: number[],
    confidenceLevel: number = 0.95
): number {
    if (returns.length === 0) return 0;

    const sorted = [...returns].sort((a, b) => a - b);
    const index = Math.floor((1 - confidenceLevel) * sorted.length);

    return Math.abs(sorted[index] || 0) * 100;
}

export function calculateCVaR(
    returns: number[],
    confidenceLevel: number = 0.95
): number {
    const var95 = calculateVaR(returns, confidenceLevel) / 100;
    const tailReturns = returns.filter(r => r <= -var95);

    if (tailReturns.length === 0) return var95 * 100;

    const mean = tailReturns.reduce((sum, r) => sum + r, 0) / tailReturns.length;
    return Math.abs(mean) * 100;
}