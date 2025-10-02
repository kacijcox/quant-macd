export class EMACalculator {
    /**
     * Calculate Exponential Moving Average
     */
    calculate(data: number[], period: number): number {
        if (data.length < period) return 0;

        const k = 2 / (period + 1);

        // Start with SMA for initial EMA
        let ema = this.calculateSMA(data.slice(0, period));

        // Calculate EMA for remaining values
        for (let i = period; i < data.length; i++) {
            ema = data[i] * k + ema * (1 - k);
        }

        return ema;
    }

    /**
     * Calculate Simple Moving Average
     */
    private calculateSMA(data: number[]): number {
        if (data.length === 0) return 0;
        return data.reduce((sum, val) => sum + val, 0) / data.length;
    }

    /**
     * Calculate EMA with custom smoothing factor
     */
    calculateWithAlpha(data: number[], alpha: number): number {
        if (data.length === 0) return 0;

        let ema = data[0];
        for (let i = 1; i < data.length; i++) {
            ema = data[i] * alpha + ema * (1 - alpha);
        }

        return ema;
    }

    /**
     * Calculate multiple EMAs efficiently
     */
    calculateMultiple(data: number[], periods: number[]): Map<number, number> {
        const results = new Map<number, number>();

        for (const period of periods) {
            results.set(period, this.calculate(data, period));
        }

        return results;
    }

    /**
     * Calculate EMA incrementally (for real-time updates)
     */
    calculateIncremental(
        previousEMA: number,
        currentPrice: number,
        period: number
    ): number {
        const k = 2 / (period + 1);
        return currentPrice * k + previousEMA * (1 - k);
    }

    /**
     * Calculate Double EMA (DEMA)
     */
    calculateDEMA(data: number[], period: number): number {
        const ema1 = this.calculate(data, period);
        const emaOfEma = this.calculate(
            data.map((_, i) => this.calculate(data.slice(0, i + 1), period)),
            period
        );

        return 2 * ema1 - emaOfEma;
    }

    /**
     * Calculate Triple EMA (TEMA)
     */
    calculateTEMA(data: number[], period: number): number {
        const ema1 = this.calculate(data, period);
        const ema2 = this.calculate(
            data.map((_, i) => this.calculate(data.slice(0, i + 1), period)),
            period
        );
        const ema3 = this.calculate(
            data.map((_, i) => this.calculate(
                data.slice(0, i + 1).map((_, j) =>
                    this.calculate(data.slice(0, j + 1), period)
                ),
                period
            )),
            period
        );

        return 3 * ema1 - 3 * ema2 + ema3;
    }
}