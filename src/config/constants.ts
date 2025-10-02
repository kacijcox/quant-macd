// src/config/constants.ts

// MACD Parameters
export const MACD_DEFAULTS = {
    FAST_PERIOD: 12,
    SLOW_PERIOD: 26,
    SIGNAL_PERIOD: 9
};

// Timeframes
export const TIMEFRAMES = {
    '1m': { label: '1 Minute', seconds: 60 },
    '5m': { label: '5 Minutes', seconds: 300 },
    '15m': { label: '15 Minutes', seconds: 900 },
    '30m': { label: '30 Minutes', seconds: 1800 },
    '1h': { label: '1 Hour', seconds: 3600 },
    '4h': { label: '4 Hours', seconds: 14400 },
    '1d': { label: '1 Day', seconds: 86400 }
} as const;

// Statistical Thresholds
export const THRESHOLDS = {
    Z_SCORE_EXTREME: 2,
    Z_SCORE_MODERATE: 1,
    CORRELATION_HIGH: 0.7,
    CORRELATION_LOW: 0.3,
    SHARPE_GOOD: 1,
    SHARPE_EXCELLENT: 2,
    VAR_CONFIDENCE: 0.95
};

// Risk Management
export const RISK_PARAMS = {
    MAX_KELLY: 0.25, // Cap Kelly at 25%
    DEFAULT_STOP_LOSS: 0.02, // 2% stop loss
    DEFAULT_TAKE_PROFIT: 0.05, // 5% take profit
    POSITION_SIZE: 0.1, // 10% per position
    MAX_DRAWDOWN_ALERT: 0.15 // 15% drawdown alert
};

// API Configuration
export const API_CONFIG = {
    BIRDEYE_BASE_URL: 'https://public-api.birdeye.so',
    JUPITER_BASE_URL: 'https://quote-api.jup.ag/v6',
    SOLANA_RPC_URL: process.env.REACT_APP_SOLANA_RPC_URL || 'https://api.mainnet-beta.solana.com',
    REQUEST_TIMEOUT: 10000,
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000
};

// Popular Tokens
export const POPULAR_TOKENS = {
    SOL: 'So11111111111111111111111111111111111111112',
    USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
    USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
    BONK: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
    WIF: 'EKpQGSJtjMFqKZ9KQanSqYXRcF8fBopzLHYxdM65zcjm',
    PYTH: 'HZ1JovNiVvGrGNiiYvEozEVgZ58xaU3RKwX8eACQBCt3'
};

// UI Constants
export const UI_CONFIG = {
    CONSOLE_MAX_LINES: 50,
    CHART_HISTORY_LENGTH: 20,
    PRICE_BUFFER_SIZE: 1000,
    AUTO_REFRESH_INTERVAL: 30000, // 30 seconds
    MATRIX_RAIN_SPEED: 35
};

// Analysis Modes
export const ANALYSIS_MODES = {
    STANDARD: {
        name: 'Standard',
        description: 'Classic MACD calculation with fixed periods'
    },
    ADAPTIVE: {
        name: 'Adaptive',
        description: 'Volatility-adjusted MACD periods for dynamic markets'
    },
    ML_ENHANCED: {
        name: 'ML Enhanced',
        description: 'Machine learning enhanced signal confirmation'
    }
} as const;

export type AnalysisMode = keyof typeof ANALYSIS_MODES;
export type Timeframe = keyof typeof TIMEFRAMES;