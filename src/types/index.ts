// Main type definitions for the Quantum MACD Scanner

export interface MACDResult {
    macd: number;
    signal: number;
    histogram: number;
    timestamp: number;
    macdHistory?: number[];
    signalHistory?: number[];
    histogramHistory?: number[];
}

export interface PriceData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface TokenData {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    price: number;
    priceHistory: PriceData[];
}

export interface StatisticalMetrics {
    sharpeRatio: number;
    sortinoRatio: number;
    valueAtRisk: number;
    maxDrawdown: number;
    kellyCriterion: number;
    zScore: number;
    correlation: number[][];
}

export interface MarketRegime {
    regime: 'BULLISH' | 'BEARISH' | 'NEUTRAL' | 'TRANSITION';
    confidence: number;
    trend: number;
    volatility: number;
}

export interface TimeframeSignal {
    timeframe: string;
    signal: 'BULL' | 'BEAR' | 'NEUTRAL';
    strength: number;
    macd: MACDResult;
}

export interface DivergenceSignal {
    type: 'BULLISH' | 'BEARISH' | 'NONE';
    strength: number;
    startIndex: number;
    endIndex: number;
    priceChange: number;
    macdChange: number;
}

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
  maxDrawdown: number;
  sharpeRatio: number;
  sortinoRatio: number;
  volatility: number;
  var95: number;
  var99: number;
  cvar95: number;
  winRate: number;
  profitFactor: number;
  kellyCriterion: number;
}

export interface AnalysisMode {
    mode: 'STANDARD' | 'ADAPTIVE' | 'ML_ENHANCED';
    parameters?: Record<string, any>;
}

export interface SolanaConfig {
    rpcUrl: string;
    wsUrl?: string;
    commitment: 'processed' | 'confirmed' | 'finalized';
}

export interface WebSocketMessage {
    type: 'PRICE_UPDATE' | 'SIGNAL' | 'ERROR' | 'HEARTBEAT';
    data: any;
    timestamp: number;
}