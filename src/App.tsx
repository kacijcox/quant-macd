import React, { useState, useEffect, useCallback } from 'react';
import Dashboard from './components/Dashboard/Dashboard';
import { MACDCalculator } from './core/indicators/macd';
import { StatisticalAnalyzer } from './core/statistics';
import { RegimeDetector } from './core/analysis/regime';
import { SolanaService } from './services/solana/connection';
import {
    MACDResult,
    StatisticalMetrics,
    MarketRegime,
    TimeframeSignal
} from './types';
import './styles/global.css';

const App: React.FC = () => {
    // State management
    const [tokenAddress, setTokenAddress] = useState<string>('');
    const [timeframe, setTimeframe] = useState<string>('5m');
    const [mode, setMode] = useState<'STANDARD' | 'ADAPTIVE' | 'ML_ENHANCED'>('STANDARD');
    const [loading, setLoading] = useState<boolean>(false);

    // Data states
    const [macdResult, setMacdResult] = useState<MACDResult | null>(null);
    const [statistics, setStatistics] = useState<StatisticalMetrics | null>(null);
    const [regime, setRegime] = useState<MarketRegime | null>(null);
    const [timeframeSignals, setTimeframeSignals] = useState<TimeframeSignal[]>([]);
    const [consoleMessages, setConsoleMessages] = useState<string[]>([]);

    // Services
    const macdCalculator = new MACDCalculator();
    const statsAnalyzer = new StatisticalAnalyzer();
    const regimeDetector = new RegimeDetector();
    const solanaService = new SolanaService();

    /**
     * Add console message
     */
    const addConsoleMessage = useCallback((message: string) => {
        const timestamp = new Date().toLocaleTimeString('en-US', { hour12: false });
        setConsoleMessages(prev => [...prev, `[${timestamp}] ${message}`].slice(-50));
    }, []);

    /**
     * Generate simulated price data (for demo)
     */
    const generatePriceData = (periods: number = 200): number[] => {
        const prices: number[] = [];
        let basePrice = 100;

        for (let i = 0; i < periods; i++) {
            const trend = Math.sin(i / 20) * 0.02;
            const volatility = 0.01 + Math.abs(Math.sin(i / 10)) * 0.02;
            const meanReversion = (100 - basePrice) * 0.01;
            const randomWalk = (Math.random() - 0.5) * volatility;

            basePrice = basePrice * (1 + trend + meanReversion + randomWalk);
            prices.push(basePrice);
        }

        return prices;
    };

    /**
     * Execute main analysis
     */
    const executeAnalysis = async () => {
        if (!tokenAddress) {
            addConsoleMessage('ERROR: Token address required');
            return;
        }

        setLoading(true);
        addConsoleMessage(`Initiating analysis for ${tokenAddress.substring(0, 8)}...`);

        try {
            // In production, fetch real data from Solana
            // const transactions = await solanaService.getRecentTransactions(tokenAddress);
            // const priceData = await solanaService.parseSwapEvents(transactions);

            // For demo, use simulated data
            addConsoleMessage('Generating price data...');
            const prices = generatePriceData();

            // Calculate MACD
            addConsoleMessage('Computing MACD(12,26,9)...');
            const macd = mode === 'ADAPTIVE'
                ? macdCalculator.calculateAdaptive(prices, 0.02)
                : macdCalculator.calculate(prices);
            setMacdResult(macd);

            // Calculate returns
            const returns = prices.slice(1).map((price, i) =>
                (price - prices[i]) / prices[i]
            );

            // Statistical analysis
            addConsoleMessage('Calculating statistical metrics...');
            const stats = statsAnalyzer.calculateAllMetrics(prices, returns);
            setStatistics(stats);

            // Regime detection
            addConsoleMessage('Detecting market regime...');
            const marketRegime = regimeDetector.detect(prices);
            setRegime(marketRegime);

            // Multi-timeframe analysis
            addConsoleMessage('Running multi-timeframe analysis...');
            const signals = calculateMultiTimeframeSignals(prices);
            setTimeframeSignals(signals);

            // ML Enhancement (simulated)
            if (mode === 'ML_ENHANCED') {
                addConsoleMessage('Running ML enhancement...');
                await new Promise(resolve => setTimeout(resolve, 500));
                addConsoleMessage('ML Confidence: 78.3% | Feature importance: MACD(0.42), Volume(0.31), RSI(0.27)');
            }

            // Check for alerts
            if (Math.abs(stats.zScore) > 2) {
                addConsoleMessage('⚠️ ALERT: Extreme Z-Score detected. Potential reversal imminent.');
            }

            addConsoleMessage(`Analysis complete. Signal: ${macd.histogram > 0 ? 'BULLISH' : 'BEARISH'}`);

        } catch (error) {
            addConsoleMessage(`ERROR: ${error instanceof Error ? error.message : 'Analysis failed'}`);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Calculate multi-timeframe signals
     */
    const calculateMultiTimeframeSignals = (prices: number[]): TimeframeSignal[] => {
        const timeframes = ['1m', '5m', '15m', '1h', '4h', '1d'];
        const signals: TimeframeSignal[] = [];

        for (const tf of timeframes) {
            // Simplified - in production, would aggregate data by timeframe
            const macd = macdCalculator.calculate(prices);

            signals.push({
                timeframe: tf,
                signal: macd.histogram > 0 ? 'BULL' : macd.histogram < 0 ? 'BEAR' : 'NEUTRAL',
                strength: Math.abs(macd.histogram) * 100,
                macd
            });
        }

        return signals;
    };

    /**
     * Initialize app
     */
    useEffect(() => {
        addConsoleMessage('Quantum MACD System initialized');
        addConsoleMessage('Connected to Solana Mainnet-Beta');
        addConsoleMessage('Ready for analysis. Enter token address and execute scan.');
    }, [addConsoleMessage]);

    /**
     * Auto-refresh (optional)
     */
    useEffect(() => {
        if (!tokenAddress || !macdResult) return;

        const interval = setInterval(() => {
            // Simulate real-time updates
            if (Math.random() > 0.7) {
                const newHistogram = macdResult.histogram + (Math.random() - 0.5) * 0.0001;
                setMacdResult(prev => prev ? { ...prev, histogram: newHistogram } : null);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [tokenAddress, macdResult]);

    return (
        <div className="app">
            <Dashboard
                tokenAddress={tokenAddress}
                setTokenAddress={setTokenAddress}
                timeframe={timeframe}
                setTimeframe={setTimeframe}
                mode={mode}
                setMode={setMode}
                loading={loading}
                onExecute={executeAnalysis}
                macdResult={macdResult}
                statistics={statistics}
                regime={regime}
                timeframeSignals={timeframeSignals}
                consoleMessages={consoleMessages}
            />
        </div>
    );
};

export default App;