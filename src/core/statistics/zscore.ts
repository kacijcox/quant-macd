// src/core/statistics/zscore.ts

export function calculateZScore(value: number, data: number[]): number {
    if (data.length === 0) return 0;

    const mean = data.reduce((sum, v) => sum + v, 0) / data.length;
    const variance = data.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / data.length;
    const stdDev = Math.sqrt(variance);

    if (stdDev === 0) return 0;

    return (value - mean) / stdDev;
}

export function calculateModifiedZScore(value: number, data: number[]): number {
    if (data.length === 0) return 0;

    const median = calculateMedian(data);
    const mad = calculateMAD(data, median);

    if (mad === 0) return 0;

    return 0.6745 * (value - median) / mad;
}

function calculateMedian(data: number[]): number {
    const sorted = [...data].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);

    return sorted.length % 2 === 0
        ? (sorted[mid - 1] + sorted[mid]) / 2
        : sorted[mid];
}

function calculateMAD(data: number[], median: number): number {
    const deviations = data.map(v => Math.abs(v - median));
    return calculateMedian(deviations);
}