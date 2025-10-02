import { DivergenceSignal, MACDResult, PriceData } from '@/types';

export class DivergenceDetector {
    /**
     * Detect MACD divergence with price
     */
    detect(
        prices: number[],
        macdHistory: number[],
        threshold: number = 0.1
    ): DivergenceSignal {
        if (prices.length < 20 || macdHistory.length < 20) {
            return {
                type: 'NONE',
                strength: 0,
                startIndex: 0,
                endIndex: 0,
                priceChange: 0,
                macdChange: 0
            };
        }

        // Find recent peaks and troughs
        const pricePeaks = this.findPeaks(prices);
        const priceTroughs = this.findTroughs(prices);
        const macdPeaks = this.findPeaks(macdHistory);
        const macdTroughs = this.findTroughs(macdHistory);

        // Check for bullish divergence (price lower low, MACD higher low)
        const bullishDiv = this.checkBullishDivergence(
            prices,
            macdHistory,
            priceTroughs,
            macdTroughs,
            threshold
        );

        // Check for bearish divergence (price higher high, MACD lower high)
        const bearishDiv = this.checkBearishDivergence(
            prices,
            macdHistory,
            pricePeaks,
            macdPeaks,
            threshold
        );

        if (bullishDiv.strength > bearishDiv.strength) {
            return bullishDiv;
        } else if (bearishDiv.strength > 0) {
            return bearishDiv;
        }

        return {
            type: 'NONE',
            strength: 0,
            startIndex: 0,
            endIndex: 0,
            priceChange: 0,
            macdChange: 0
        };
    }

    /**
     * Find peaks in data
     */
    private findPeaks(data: number[]): number[] {
        const peaks: number[] = [];

        for (let i = 1; i < data.length - 1; i++) {
            if (data[i] > data[i - 1] && data[i] > data[i + 1]) {
                peaks.push(i);
            }
        }

        return peaks;
    }

    /**
     * Find troughs in data
     */
    private findTroughs(data: number[]): number[] {
        const troughs: number[] = [];

        for (let i = 1; i < data.length - 1; i++) {
            if (data[i] < data[i - 1] && data[i] < data[i + 1]) {
                troughs.push(i);
            }
        }

        return troughs;
    }

    /**
     * Check for bullish divergence
     */
    private checkBullishDivergence(
        prices: number[],
        macd: number[],
        priceTroughs: number[],
        macdTroughs: number[],
        threshold: number
    ): DivergenceSignal {
        if (priceTroughs.length < 2 || macdTroughs.length < 2) {
            return this.createEmptySignal();
        }

        const lastPriceTrough = priceTroughs[priceTroughs.length - 1];
        const prevPriceTrough = priceTroughs[priceTroughs.length - 2];

        const lastMacdTrough = macdTroughs[macdTroughs.length - 1];
        const prevMacdTrough = macdTroughs[macdTroughs.length - 2];

        const priceLowerLow = prices[lastPriceTrough] < prices[prevPriceTrough];
        const macdHigherLow = macd[lastMacdTrough] > macd[prevMacdTrough];

        if (priceLowerLow && macdHigherLow) {
            const priceChange = (prices[lastPriceTrough] - prices[prevPriceTrough]) / prices[prevPriceTrough];
            const macdChange = (macd[lastMacdTrough] - macd[prevMacdTrough]) / Math.abs(macd[prevMacdTrough]);
            const strength = Math.abs(macdChange - priceChange);

            if (strength > threshold) {
                return {
                    type: 'BULLISH',
                    strength: Math.min(strength * 100, 100),
                    startIndex: prevPriceTrough,
                    endIndex: lastPriceTrough,
                    priceChange: priceChange * 100,
                    macdChange: macdChange * 100
                };
            }
        }

        return this.createEmptySignal();
    }

    /**
     * Check for bearish divergence
     */
    private checkBearishDivergence(
        prices: number[],
        macd: number[],
        pricePeaks: number[],
        macdPeaks: number[],
        threshold: number
    ): DivergenceSignal {
        if (pricePeaks.length < 2 || macdPeaks.length < 2) {
            return this.createEmptySignal();
        }

        const lastPricePeak = pricePeaks[pricePeaks.length - 1];
        const prevPricePeak = pricePeaks[pricePeaks.length - 2];

        const lastMacdPeak = macdPeaks[macdPeaks.length - 1];
        const prevMacdPeak = macdPeaks[macdPeaks.length - 2];

        const priceHigherHigh = prices[lastPricePeak] > prices[prevPricePeak];
        const macdLowerHigh = macd[lastMacdPeak] < macd[prevMacdPeak];

        if (priceHigherHigh && macdLowerHigh) {
            const priceChange = (prices[lastPricePeak] - prices[prevPricePeak]) / prices[prevPricePeak];
            const macdChange = (macd[lastMacdPeak] - macd[prevMacdPeak]) / Math.abs(macd[prevMacdPeak]);
            const strength = Math.abs(priceChange - macdChange);

            if (strength > threshold) {
                return {
                    type: 'BEARISH',
                    strength: Math.min(strength * 100, 100),
                    startIndex: prevPricePeak,
                    endIndex: lastPricePeak,
                    priceChange: priceChange * 100,
                    macdChange: macdChange * 100
                };
            }
        }

        return this.createEmptySignal();
    }

    /**
     * Create empty divergence signal
     */
    private createEmptySignal(): DivergenceSignal {
        return {
            type: 'NONE',
            strength: 0,
            startIndex: 0,
            endIndex: 0,
            priceChange: 0,
            macdChange: 0
        };
    }

    /**
     * Calculate divergence score
     */
    calculateDivergenceScore(signal: DivergenceSignal): number {
        if (signal.type === 'NONE') return 0;

        const directionScore = signal.type === 'BULLISH' ? 1 : -1;
        const strengthScore = signal.strength / 100;
        const magnitudeScore = Math.min(Math.abs(signal.priceChange - signal.macdChange) / 10, 1);

        return directionScore * strengthScore * magnitudeScore * 100;
    }
}