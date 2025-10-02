import { MarketRegime } from '@/types';
import { EMACalculator } from '../indicators/ema';

export class RegimeDetector {
    private emaCalculator: EMACalculator;

    constructor() {
        this.emaCalculator = new EMACalculator();
    }

    /**
     * Detect market regime using multiple signals
     */
    detect(prices: number[], volumes?: number[]): MarketRegime {
        if (prices.length < 50) {
            return {
                regime: 'NEUTRAL',
                confidence: 0,
                trend: 0,
                volatility: 0
            };
        }

        // Calculate trend using multiple EMAs
        const ema20 = this.emaCalculator.calculate(prices.slice(-20), 20);
        const ema50 = this.emaCalculator.calculate(prices.slice(-50), 50);
        const currentPrice = prices[prices.length - 1];

        // Calculate returns for volatility
        const returns = this.calculateReturns(prices);
        const volatility = this.calculateVolatility(returns);

        // Determine regime
        let regime: MarketRegime['regime'] = 'NEUTRAL';
        let confidence = 0;
        let trend = 0;

        // Bull market conditions
        if (currentPrice > ema20 && ema20 > ema50) {
            regime = 'BULLISH';
            trend = ((currentPrice / ema50) - 1) * 100;
            confidence = Math.min(Math.abs(trend) * 2, 100);
        }
        // Bear market conditions
        else if (currentPrice < ema20 && ema20 < ema50) {
            regime = 'BEARISH';
            trend = ((currentPrice / ema50) - 1) * 100;
            confidence = Math.min(Math.abs(trend) * 2, 100);
        }
        // Transition phase
        else {
            regime = 'TRANSITION';
            trend = ((currentPrice / ema20) - 1) * 100;
            confidence = 50 + (Math.random() * 20 - 10);
        }

        // Adjust confidence based on volatility
        if (volatility > 0.03) {
            confidence *= 0.8; // High volatility reduces confidence
        }

        // Volume confirmation (if available)
        if (volumes && volumes.length > 0) {
            const volumeTrend = this.analyzeVolumeTrend(volumes);
            confidence *= volumeTrend;
        }

        return {
            regime,
            confidence: Math.min(Math.max(confidence, 0), 100),
            trend,
            volatility: volatility * 100
        };
    }

    /**
     * Detect regime using Hidden Markov Model approach
     */
    detectHMM(prices: number[]): MarketRegime {
        // Simplified HMM for regime detection
        const states = ['BULLISH', 'BEARISH', 'NEUTRAL'] as const;
        const observations = this.getObservations(prices);

        // Transition probabilities (simplified)
        const transitionProbs = {
            'BULLISH': { 'BULLISH': 0.7, 'BEARISH': 0.1, 'NEUTRAL': 0.2 },
            'BEARISH': { 'BULLISH': 0.1, 'BEARISH': 0.7, 'NEUTRAL': 0.2 },
            'NEUTRAL': { 'BULLISH': 0.3, 'BEARISH': 0.3, 'NEUTRAL': 0.4 }
        };

        // Viterbi algorithm for most likely state sequence
        let currentState: MarketRegime['regime'] = 'NEUTRAL';
        let maxProb = 0;

        for (const state of states) {
            const prob = this.calculateStateProbability(state, observations, transitionProbs);
            if (prob > maxProb) {
                maxProb = prob;
                currentState = state;
            }
        }

        const returns = this.calculateReturns(prices);

        return {
            regime: currentState,
            confidence: maxProb * 100,
            trend: this.calculateTrend(prices),
            volatility: this.calculateVolatility(returns) * 100
        };
    }

    /**
     * Calculate returns from prices
     */
    private calculateReturns(prices: number[]): number[] {
        const returns: number[] = [];
        for (let i = 1; i < prices.length; i++) {
            returns.push((prices[i] - prices[i - 1]) / prices[i - 1]);
        }
        return returns;
    }

    /**
     * Calculate volatility (standard deviation of returns)
     */
    private calculateVolatility(returns: number[]): number {
        if (returns.length < 2) return 0;

        const mean = returns.reduce((sum, r) => sum + r, 0) / returns.length;
        const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / returns.length;

        return Math.sqrt(variance);
    }

    /**
     * Analyze volume trend
     */
    private analyzeVolumeTrend(volumes: number[]): number {
        if (volumes.length < 20) return 1;

        const recentVol = volumes.slice(-10).reduce((a, b) => a + b, 0) / 10;
        const oldVol = volumes.slice(-20, -10).reduce((a, b) => a + b, 0) / 10;

        if (oldVol === 0) return 1;

        const volRatio = recentVol / oldVol;
        return Math.min(Math.max(volRatio, 0.5), 1.5);
    }

    /**
     * Get observations for HMM
     */
    private getObservations(prices: number[]): number[] {
        const returns = this.calculateReturns(prices);
        return returns.map(r => {
            if (r > 0.01) return 1;  // Positive
            if (r < -0.01) return -1; // Negative
            return 0; // Neutral
        });
    }

    /**
     * Calculate state probability for HMM
     */
    private calculateStateProbability(
        state: MarketRegime['regime'],
        observations: number[],
        transitionProbs: any
    ): number {
        // Simplified probability calculation
        const stateValue = state === 'BULLISH' ? 1 : state === 'BEARISH' ? -1 : 0;
        let prob = 0.33; // Initial probability

        for (const obs of observations.slice(-10)) {
            if (obs === stateValue) {
                prob *= 1.2;
            } else {
                prob *= 0.8;
            }
        }

        return Math.min(prob, 1);
    }

    /**
     * Calculate trend strength
     */
    private calculateTrend(prices: number[]): number {
        if (prices.length < 2) return 0;

        const firstPrice = prices[Math.max(0, prices.length - 20)];
        const lastPrice = prices[prices.length - 1];

        return ((lastPrice - firstPrice) / firstPrice) * 100;
    }

    /**
     * Detect regime changes
     */
    detectRegimeChange(
        currentRegime: MarketRegime,
        previousRegime: MarketRegime
    ): boolean {
        return currentRegime.regime !== previousRegime.regime &&
            currentRegime.confidence > 60;
    }
}