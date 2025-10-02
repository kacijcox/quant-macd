// src/types/trading.types.ts

export interface Trade {
    id: string;
    entryTime: number;
    exitTime?: number;
    entryPrice: number;
    exitPrice?: number;
    position: 'LONG' | 'SHORT';
    size: number;
    pnl?: number;
    pnlPercent?: number;
    isOpen: boolean;
    stopLoss?: number;
    takeProfit?: number;
}

export interface Position {
    tokenAddress: string;
    size: number;
    entryPrice: number;
    currentPrice: number;
    unrealizedPnL: number;
    realizedPnL: number;
}

export interface OrderBook {
    bids: OrderBookLevel[];
    asks: OrderBookLevel[];
    spread: number;
}

export interface OrderBookLevel {
    price: number;
    size: number;
    total: number;
}

export interface TradingSignal {
    type: 'BUY' | 'SELL' | 'HOLD';
    strength: number;
    confidence: number;
    reasons: string[];
}

export type OrderType = 'MARKET' | 'LIMIT' | 'STOP_LOSS' | 'TAKE_PROFIT';
export type OrderSide = 'BUY' | 'SELL';
export type OrderStatus = 'PENDING' | 'FILLED' | 'CANCELLED' | 'EXPIRED';