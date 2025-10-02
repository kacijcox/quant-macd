// src/core/statistics/kelly.ts

export function calculateKellyCriterion(
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

export function calculateFractionalKelly(
    winRate: number,
    avgWin: number,
    avgLoss: number,
    fraction: number = 0.5
): number {
    return calculateKellyCriterion(winRate, avgWin, avgLoss) * fraction;
}