// src/core/indicators/indicators.types.ts

export interface IndicatorConfig {
    period: number;
    source?: 'open' | 'high' | 'low' | 'close' | 'hlc3' | 'ohlc4';
}

export interface MACDConfig {
    fastPeriod: number;
    slowPeriod: number;
    signalPeriod: number;
}

export interface RSIConfig {
    period: number;
    overbought: number;
    oversold: number;
}

export interface BollingerBandsConfig {
    period: number;
    stdDev: number;
}

export interface StochasticConfig {
    kPeriod: number;
    dPeriod: number;
    smooth: number;
}

export type IndicatorType = 'MACD' | 'RSI' | 'EMA' | 'SMA' | 'BB' | 'STOCH';