import { MACDResult, PriceData, PerformanceMetrics } from '@/types';
import { MACDCalculator } from '../indicators/macd';
import { StatisticalAnalyzer } from '../statistics';

export interface BacktestConfig {
    initialCapital: number;
    positionSize: number;
    stopLoss?: number;
    takeProfit?: number;
    commission: number;
    slippage: number;
}

export interface Trade {
    entryTime: number;
    exitTime?: number;
    entryPrice: number;
    exitPrice?: number;
    position: 'LONG' | 'SHORT';
    size: number;
    pnl?: number;
    pnlPercent?: number;
    isOpen: boolean;
}

export class BacktestEngine {
    private config: BacktestConfig;
    private macdCalculator: MACDCalculator;
    private statsAnalyzer: StatisticalAnalyzer;

    constructor(config: BacktestConfig) {
        this.config = config;
        this.macdCalculator = new MACDCalculator();
        this.statsAnalyzer = new StatisticalAnalyzer();
    }

    /**
     * Run backtest on historical data
     */
    runBacktest(
        priceData: PriceData[],
        strategy: (macd: MACDResult, price: number) => 'BUY' | 'SELL' | 'HOLD'
    ): {
        trades: Trade[],
        metrics: PerformanceMetrics,
        equity: number[]
    } {
        const trades: Trade[] = [];
        const equity: number[] = [this.config.initialCapital];
        let currentCapital = this.config.initialCapital;
        let currentPosition: Trade | null = null;

        const prices = priceData.map(d => d.close);

        for (let i = 30; i < priceData.length; i++) {
            const priceSlice = prices.slice(0, i + 1);
            const macd = this.macdCalculator.calculate(priceSlice);
            const currentPrice = priceData[i].close;
            const signal = strategy(macd, currentPrice);

            // Handle position management
            if (signal === 'BUY' && !currentPosition) {
                // Open long position
                const size = (currentCapital * this.config.positionSize) / currentPrice;
                const entryPrice = currentPrice * (1 + this.config.slippage);
                const commission = size * entryPrice * this.config.commission;

                currentPosition = {
                    entryTime: priceData[i].timestamp,
                    entryPrice,
                    position: 'LONG',
                    size,
                    isOpen: true
                };

                currentCapital -= commission;
                trades.push(currentPosition);
            }
            else if (signal === 'SELL' && currentPosition && currentPosition.position === 'LONG') {
                // Close long position
                const exitPrice = currentPrice * (1 - this.config.slippage);
                const commission = currentPosition.size * exitPrice * this.config.commission;
                const pnl = (exitPrice - currentPosition.entryPrice) * currentPosition.size - commission;

                currentPosition.exitTime = priceData[i].timestamp;
                currentPosition.exitPrice = exitPrice;
                currentPosition.pnl = pnl;
                currentPosition.pnlPercent = (pnl / (currentPosition.entryPrice * currentPosition.size)) * 100;
                currentPosition.isOpen = false;

                currentCapital += pnl;
                currentPosition = null;
            }

            // Check stop loss and take profit
            if (currentPosition && this.config.stopLoss) {
                const currentPnL = (currentPrice - currentPosition.entryPrice) / currentPosition.entryPrice;

                if (currentPnL <= -this.config.stopLoss) {
                    // Stop loss hit
                    const exitPrice = currentPosition.entryPrice * (1 - this.config.stopLoss);
                    const pnl = (exitPrice - currentPosition.entryPrice) * currentPosition.size;

                    currentPosition.exitTime = priceData[i].timestamp;
                    currentPosition.exitPrice = exitPrice;
                    currentPosition.pnl = pnl;
                    currentPosition.pnlPercent = -this.config.stopLoss * 100;
                    currentPosition.isOpen = false;

                    currentCapital += pnl;
                    currentPosition = null;
                }
            }

            equity.push(currentCapital);
        }

        // Close any open positions at the end
        if (currentPosition) {
            const lastPrice = priceData[priceData.length - 1].close;
            currentPosition.exitTime = priceData[priceData.length - 1].timestamp;
            currentPosition.exitPrice = lastPrice;
            currentPosition.pnl = (lastPrice - currentPosition.entryPrice) * currentPosition.size;
            currentPosition.pnlPercent = (currentPosition.pnl / (currentPosition.entryPrice * currentPosition.size)) * 100;
            currentPosition.isOpen = false;
        }

        const metrics = this.calculateMetrics(trades, equity);

        return { trades, metrics, equity };
    }

    /**
     * Calculate performance metrics
     */
    private calculateMetrics(trades: Trade[], equity: number[]): PerformanceMetrics {
        const closedTrades = trades.filter(t => !t.isOpen);
        const winningTrades = closedTrades.filter(t => (t.pnl || 0) > 0);
        const losingTrades = closedTrades.filter(t => (t.pnl || 0) < 0);

        const totalReturn = ((equity[equity.length - 1] - this.config.initialCapital) /
            this.config.initialCapital) * 100;

        const returns = [];
        for (let i = 1; i < equity.length; i++) {
            returns.push((equity[i] - equity[i - 1]) / equity[i - 1]);
        }

        const winRate = closedTrades.length > 0 ?
            (winningTrades.length / closedTrades.length) * 100 : 0;

        const avgWin = winningTrades.length > 0 ?
            winningTrades.reduce((sum, t) => sum + (t.pnlPercent || 0), 0) / winningTrades.length : 0;

        const avgLoss = losingTrades.length > 0 ?
            Math.abs(losingTrades.reduce((sum, t) => sum + (t.pnlPercent || 0), 0) / losingTrades.length) : 0;

        const profitFactor = avgLoss > 0 ? avgWin / avgLoss : 0;

        const maxDrawdown = this.calculateMaxDrawdown(equity);
        const calmarRatio = maxDrawdown > 0 ? totalReturn / maxDrawdown : 0;  // ADD THIS LINE

        const sharpeRatio = this.statsAnalyzer.calculateSharpeRatio(returns);

        return {
            totalReturn,
            annualizedReturn: totalReturn * (252 / equity.length),
            maxDrawdown,
            sharpeRatio,
            sortinoRatio: this.statsAnalyzer.calculateSortinoRatio(returns),
            volatility: this.statsAnalyzer['standardDeviation'](returns) * 100,
            var95: this.statsAnalyzer.calculateVaR(returns, 0.95),
            var99: this.statsAnalyzer.calculateVaR(returns, 0.99),
            cvar95: this.statsAnalyzer.calculateCVaR(returns, 0.95),
            winRate,
            profitFactor,
            kellyCriterion: this.statsAnalyzer.calculateKellyCriterion(winRate / 100, avgWin, avgLoss),
            avgWin,
            avgLoss,
            maxWin: winningTrades.length > 0 ?
                Math.max(...winningTrades.map(t => t.pnlPercent || 0)) : 0,
            maxLoss: losingTrades.length > 0 ?
                Math.abs(Math.min(...losingTrades.map(t => t.pnlPercent || 0))) : 0,
            calmarRatio,  // Now this shorthand works
            signalsToday: closedTrades.length
        };
    }

    /**
     * Calculate maximum drawdown
     */
    private calculateMaxDrawdown(equity: number[]): number {
        let maxDD = 0;
        let peak = equity[0];

        for (let i = 1; i < equity.length; i++) {
            if (equity[i] > peak) {
                peak = equity[i];
            }
            const drawdown = ((peak - equity[i]) / peak) * 100;
            if (drawdown > maxDD) {
                maxDD = drawdown;
            }
        }

        return maxDD;
    }

    /**
     * Run walk-forward analysis
     */
    runWalkForwardAnalysis(
        priceData: PriceData[],
        strategy: (macd: MACDResult, price: number) => 'BUY' | 'SELL' | 'HOLD',
        windowSize: number = 100,
        stepSize: number = 20
    ): {
        inSample: PerformanceMetrics[],
        outOfSample: PerformanceMetrics[]
    } {
        const inSampleResults: PerformanceMetrics[] = [];
        const outOfSampleResults: PerformanceMetrics[] = [];

        for (let i = 0; i < priceData.length - windowSize - stepSize; i += stepSize) {
            // In-sample period
            const inSampleData = priceData.slice(i, i + windowSize);
            const inSampleTest = this.runBacktest(inSampleData, strategy);
            inSampleResults.push(inSampleTest.metrics);

            // Out-of-sample period
            const outOfSampleData = priceData.slice(i + windowSize, i + windowSize + stepSize);
            const outOfSampleTest = this.runBacktest(outOfSampleData, strategy);
            outOfSampleResults.push(outOfSampleTest.metrics);
        }

        return {
            inSample: inSampleResults,
            outOfSample: outOfSampleResults
        };
    }
}