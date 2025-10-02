import { MACDResult, PriceData } from '@/types';
import { EMACalculator } from './ema';

export class MACDCalculator {
    private emaCalculator: EMACalculator;
    private fastPeriod: number;
    private slowPeriod: number;
    private signalPeriod: number;

    constructor(
        fastPeriod: number = 12,
        slowPeriod: number = 26,
        signalPeriod: number = 9
    ) {
        this.fastPeriod = fastPeriod;
        this.slowPeriod = slowPeriod;
        this.signalPeriod = signalPeriod;
        this.emaCalculator = new EMACalculator();
    }

    /**
     * Calculate MACD from price array
     */
    calculate(prices: number[]): MACDResult {
        if (prices.length < this.slowPeriod + this.signalPeriod) {
            return {
                macd: 0,
                signal: 0,
                histogram: 0,
                timestamp: Date.now(),
                macdHistory: [],
                signalHistory: [],
                histogramHistory: []
            };
        }

        const macdLine: number[] = [];
        const signalLine: number[] = [];
        const histogram: number[] = [];

        // Calculate MACD line for each valid point
        for (let i = this.slowPeriod - 1; i < prices.length; i++) {
            const slice = prices.slice(0, i + 1);
            const emaFast = this.emaCalculator.calculate(slice, this.fastPeriod);
            const emaSlow = this.emaCalculator.calculate(slice, this.slowPeriod);
            macdLine.push(emaFast - emaSlow);
        }

        // Calculate Signal line (EMA of MACD)
        if (macdLine.length >= this.signalPeriod) {
            for (let i = this.signalPeriod - 1; i < macdLine.length; i++) {
                const macdSlice = macdLine.slice(0, i + 1);
                const signal = this.emaCalculator.calculate(macdSlice, this.signalPeriod);
                signalLine.push(signal);
                histogram.push(macdLine[i] - signal);
            }
        }

        return {
            macd: macdLine[macdLine.length - 1] || 0,
            signal: signalLine[signalLine.length - 1] || 0,
            histogram: histogram[histogram.length - 1] || 0,
            timestamp: Date.now(),
            macdHistory: macdLine,
            signalHistory: signalLine,
            histogramHistory: histogram
        };
    }

    /**
     * Calculate MACD from OHLCV data
     */
    calculateFromOHLCV(data: PriceData[]): MACDResult {
        const closePrices = data.map(d => d.close);
        return this.calculate(closePrices);
    }

    /**
     * Calculate MACD with adaptive periods based on volatility
     */
    calculateAdaptive(
        prices: number[],
        volatility: number
    ): MACDResult {
        // Adjust periods based on volatility
        const volMultiplier = Math.min(Math.max(volatility, 0.5), 2);
        const adaptiveFast = Math.round(this.fastPeriod * volMultiplier);
        const adaptiveSlow = Math.round(this.slowPeriod * volMultiplier);

        const tempCalculator = new MACDCalculator(
            adaptiveFast,
            adaptiveSlow,
            this.signalPeriod
        );

        return tempCalculator.calculate(prices);
    }

    /**
     * Detect MACD crossovers
     */
    detectCrossover(
        current: MACDResult,
        previous: MACDResult
    ): 'BULLISH' | 'BEARISH' | 'NONE' {
        if (!previous || !current) return 'NONE';

        const prevDiff = previous.macd - previous.signal;
        const currDiff = current.macd - current.signal;

        if (prevDiff < 0 && currDiff > 0) {
            return 'BULLISH'; // MACD crossed above signal
        } else if (prevDiff > 0 && currDiff < 0) {
            return 'BEARISH'; // MACD crossed below signal
        }

        return 'NONE';
    }

    /**
     * Calculate MACD momentum
     */
    calculateMomentum(macdHistory: number[]): number {
        if (macdHistory.length < 2) return 0;

        const recentMACD = macdHistory.slice(-10);
        const oldMACD = macdHistory.slice(-20, -10);

        const recentAvg = recentMACD.reduce((a, b) => a + b, 0) / recentMACD.length;
        const oldAvg = oldMACD.reduce((a, b) => a + b, 0) / oldMACD.length;

        return ((recentAvg - oldAvg) / Math.abs(oldAvg)) * 100;
    }

    /**
     * Validate MACD signal strength
     */
    validateSignalStrength(result: MACDResult): number {
        const { macd, signal, histogram } = result;

        // Calculate signal strength (0-100)
        const histogramStrength = Math.min(Math.abs(histogram) * 1000, 50);
        const macdStrength = Math.min(Math.abs(macd) * 100, 30);
        const divergenceStrength = Math.min(Math.abs(macd - signal) * 100, 20);

        return Math.min(histogramStrength + macdStrength + divergenceStrength, 100);
    }
}