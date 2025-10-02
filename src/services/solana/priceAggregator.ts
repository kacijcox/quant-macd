// src/services/solana/priceAggregator.ts
import { PriceData } from '@/types';

export class PriceAggregator {
    /**
     * Aggregate price data from multiple sources
     */
    aggregate(sources: PriceData[][]): PriceData[] {
        if (sources.length === 0) return [];
        if (sources.length === 1) return sources[0];

        // Combine all data points
        const allPrices: PriceData[] = sources.flat();

        // Group by timestamp intervals (5 minutes)
        const interval = 300000; // 5 minutes in ms
        const grouped = new Map<number, PriceData[]>();

        for (const price of allPrices) {
            const bucket = Math.floor(price.timestamp / interval) * interval;
            if (!grouped.has(bucket)) {
                grouped.set(bucket, []);
            }
            grouped.get(bucket)!.push(price);
        }

        // Calculate weighted average for each bucket
        const aggregated: PriceData[] = [];

        for (const [timestamp, prices] of grouped.entries()) {
            const totalVolume = prices.reduce((sum, p) => sum + p.volume, 0);

            if (totalVolume === 0) {
                // Simple average if no volume data
                aggregated.push({
                    timestamp,
                    open: this.average(prices.map(p => p.open)),
                    high: Math.max(...prices.map(p => p.high)),
                    low: Math.min(...prices.map(p => p.low)),
                    close: this.average(prices.map(p => p.close)),
                    volume: 0
                });
            } else {
                // Volume-weighted average
                aggregated.push({
                    timestamp,
                    open: this.weightedAverage(prices.map(p => ({ value: p.open, weight: p.volume }))),
                    high: Math.max(...prices.map(p => p.high)),
                    low: Math.min(...prices.map(p => p.low)),
                    close: this.weightedAverage(prices.map(p => ({ value: p.close, weight: p.volume }))),
                    volume: totalVolume
                });
            }
        }

        return aggregated.sort((a, b) => a.timestamp - b.timestamp);
    }

    /**
     * Calculate simple average
     */
    private average(values: number[]): number {
        return values.reduce((sum, v) => sum + v, 0) / values.length;
    }

    /**
     * Calculate weighted average
     */
    private weightedAverage(items: { value: number; weight: number }[]): number {
        const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
        if (totalWeight === 0) return 0;

        const weightedSum = items.reduce((sum, item) => sum + (item.value * item.weight), 0);
        return weightedSum / totalWeight;
    }

    /**
     * Remove outliers using IQR method
     */
    removeOutliers(data: PriceData[]): PriceData[] {
        if (data.length < 4) return data;

        const closes = data.map(d => d.close).sort((a, b) => a - b);
        const q1Index = Math.floor(closes.length * 0.25);
        const q3Index = Math.floor(closes.length * 0.75);

        const q1 = closes[q1Index];
        const q3 = closes[q3Index];
        const iqr = q3 - q1;

        const lowerBound = q1 - 1.5 * iqr;
        const upperBound = q3 + 1.5 * iqr;

        return data.filter(d => d.close >= lowerBound && d.close <= upperBound);
    }

    /**
     * Fill missing data points
     */
    fillGaps(data: PriceData[], interval: number = 300000): PriceData[] {
        if (data.length === 0) return [];

        const filled: PriceData[] = [data[0]];

        for (let i = 1; i < data.length; i++) {
            const prev = data[i - 1];
            const curr = data[i];
            const gap = curr.timestamp - prev.timestamp;

            if (gap > interval * 1.5) {
                // Fill gap with interpolated values
                const steps = Math.floor(gap / interval);
                for (let j = 1; j < steps; j++) {
                    const ratio = j / steps;
                    filled.push({
                        timestamp: prev.timestamp + (interval * j),
                        open: prev.close,
                        high: prev.close + (curr.close - prev.close) * ratio,
                        low: prev.close + (curr.close - prev.close) * ratio,
                        close: prev.close + (curr.close - prev.close) * ratio,
                        volume: 0
                    });
                }
            }

            filled.push(curr);
        }

        return filled;
    }
}