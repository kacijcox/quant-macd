export class CorrelationAnalyzer {
    /**
     * Calculate Pearson correlation coefficient
     */
    calculatePearson(x: number[], y: number[]): number {
        if (x.length !== y.length || x.length === 0) return 0;

        const n = x.length;
        const meanX = this.mean(x);
        const meanY = this.mean(y);

        let numerator = 0;
        let denominatorX = 0;
        let denominatorY = 0;

        for (let i = 0; i < n; i++) {
            const dx = x[i] - meanX;
            const dy = y[i] - meanY;
            numerator += dx * dy;
            denominatorX += dx * dx;
            denominatorY += dy * dy;
        }

        const denominator = Math.sqrt(denominatorX * denominatorY);

        return denominator === 0 ? 0 : numerator / denominator;
    }

    /**
     * Calculate Spearman rank correlation
     */
    calculateSpearman(x: number[], y: number[]): number {
        if (x.length !== y.length || x.length === 0) return 0;

        const xRanks = this.rankData(x);
        const yRanks = this.rankData(y);

        return this.calculatePearson(xRanks, yRanks);
    }

    /**
     * Calculate correlation matrix for multiple datasets
     */
    calculateMatrix(datasets: number[][], labels?: string[]): {
        matrix: number[][],
        labels: string[]
    } {
        const n = datasets.length;
        const matrix: number[][] = [];
        const finalLabels = labels || datasets.map((_, i) => `Series ${i + 1}`);

        for (let i = 0; i < n; i++) {
            matrix[i] = [];
            for (let j = 0; j < n; j++) {
                if (i === j) {
                    matrix[i][j] = 1;
                } else if (j < i) {
                    matrix[i][j] = matrix[j][i]; // Symmetric matrix
                } else {
                    matrix[i][j] = this.calculatePearson(datasets[i], datasets[j]);
                }
            }
        }

        return { matrix, labels: finalLabels };
    }

    /**
     * Calculate rolling correlation
     */
    calculateRollingCorrelation(
        x: number[],
        y: number[],
        window: number
    ): number[] {
        if (x.length !== y.length || x.length < window) return [];

        const correlations: number[] = [];

        for (let i = window; i <= x.length; i++) {
            const xWindow = x.slice(i - window, i);
            const yWindow = y.slice(i - window, i);
            correlations.push(this.calculatePearson(xWindow, yWindow));
        }

        return correlations;
    }

    /**
     * Detect correlation regime changes
     */
    detectRegimeChange(
        correlations: number[],
        threshold: number = 0.3
    ): {
        changes: number[],
        currentRegime: 'HIGH' | 'LOW' | 'NEUTRAL'
    } {
        const changes: number[] = [];

        for (let i = 1; i < correlations.length; i++) {
            const prev = Math.abs(correlations[i - 1]);
            const curr = Math.abs(correlations[i]);

            if ((prev < threshold && curr >= threshold) ||
                (prev >= threshold && curr < threshold)) {
                changes.push(i);
            }
        }

        const lastCorr = Math.abs(correlations[correlations.length - 1]);
        const currentRegime = lastCorr > 0.7 ? 'HIGH' :
            lastCorr < 0.3 ? 'LOW' : 'NEUTRAL';

        return { changes, currentRegime };
    }

    /**
     * Calculate partial correlation
     */
    calculatePartialCorrelation(
        x: number[],
        y: number[],
        z: number[]
    ): number {
        const rxy = this.calculatePearson(x, y);
        const rxz = this.calculatePearson(x, z);
        const ryz = this.calculatePearson(y, z);

        const denominator = Math.sqrt((1 - rxz * rxz) * (1 - ryz * ryz));

        if (denominator === 0) return 0;

        return (rxy - rxz * ryz) / denominator;
    }

    /**
     * Helper: Calculate mean
     */
    private mean(data: number[]): number {
        return data.reduce((sum, val) => sum + val, 0) / data.length;
    }

    /**
     * Helper: Rank data for Spearman correlation
     */
    private rankData(data: number[]): number[] {
        const sorted = [...data].map((val, idx) => ({ val, idx }))
            .sort((a, b) => a.val - b.val);

        const ranks = new Array(data.length);

        for (let i = 0; i < sorted.length; i++) {
            ranks[sorted[i].idx] = i + 1;
        }

        return ranks;
    }

    /**
     * Calculate autocorrelation
     */
    calculateAutocorrelation(data: number[], maxLag: number = 20): number[] {
        const autocorrelations: number[] = [];

        for (let lag = 0; lag <= maxLag; lag++) {
            if (lag >= data.length) break;

            const x = data.slice(0, data.length - lag);
            const y = data.slice(lag);

            autocorrelations.push(this.calculatePearson(x, y));
        }

        return autocorrelations;
    }
}