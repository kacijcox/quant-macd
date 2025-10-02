// src/utils/math.ts

/**
 * Calculate percentage change
 */
export const percentChange = (current: number, previous: number): number => {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
};

/**
 * Calculate compound annual growth rate (CAGR)
 */
export const calculateCAGR = (
    beginValue: number,
    endValue: number,
    periods: number
): number => {
    if (beginValue <= 0 || periods <= 0) return 0;
    return (Math.pow(endValue / beginValue, 1 / periods) - 1) * 100;
};

/**
 * Normalize data to 0-1 range
 */
export const normalize = (value: number, min: number, max: number): number => {
    if (max === min) return 0;
    return (value - min) / (max - min);
};

/**
 * Calculate moving average
 */
export const movingAverage = (data: number[], period: number): number[] => {
    const result: number[] = [];

    for (let i = 0; i < data.length; i++) {
        if (i < period - 1) {
            result.push(NaN);
            continue;
        }

        const slice = data.slice(i - period + 1, i + 1);
        const avg = slice.reduce((sum, val) => sum + val, 0) / period;
        result.push(avg);
    }

    return result;
};

/**
 * Calculate standard deviation
 */
export const standardDeviation = (data: number[]): number => {
    if (data.length === 0) return 0;

    const mean = data.reduce((sum, val) => sum + val, 0) / data.length;
    const variance = data.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / data.length;

    return Math.sqrt(variance);
};

/**
 * Calculate percentile
 */
export const percentile = (data: number[], p: number): number => {
    if (data.length === 0) return 0;

    const sorted = [...data].sort((a, b) => a - b);
    const index = (p / 100) * (sorted.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;

    if (lower === upper) return sorted[lower];

    return sorted[lower] * (1 - weight) + sorted[upper] * weight;
};

/**
 * Clamp value between min and max
 */
export const clamp = (value: number, min: number, max: number): number => {
    return Math.min(Math.max(value, min), max);
};

/**
 * Linear interpolation
 */
export const lerp = (a: number, b: number, t: number): number => {
    return a + (b - a) * t;
};

/**
 * Safe division (avoid divide by zero)
 */
export const safeDivide = (numerator: number, denominator: number, fallback: number = 0): number => {
    return denominator !== 0 ? numerator / denominator : fallback;
};