// src/core/statistics/statistics.types.ts

export interface RiskMetrics {
    var95: number;
    var99: number;
    cvar: number;
    maxDrawdown: number;
    drawdownDuration: number;
    recoveryTime: number;
    kellyCriterion: number;
    optimalLeverage: number;
}

export interface PerformanceMetrics {
    totalReturn: number;
    annualizedReturn: number;
    winRate: number;
    profitFactor: number;
    avgWin: number;
    avgLoss: number;
    maxWin: number;
    maxLoss: number;
    calmarRatio: number;
    signalsToday: number;
}

export interface DistributionStats {
    mean: number;
    median: number;
    mode: number;
    variance: number;
    stdDev: number;
    skewness: number;
    kurtosis: number;
}

export interface CorrelationResult {
    pearson: number;
    spearman: number;
    kendall: number;
}

export type StatisticalTest = 'ttest' | 'anova' | 'chisquare' | 'kolmogorov';