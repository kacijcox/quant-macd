// src/types/api.types.ts

export interface APIResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    timestamp: number;
}

export interface BirdeyeTokenResponse {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    price: number;
    v24hUSD: number;
    v24hChangePercent: number;
}

export interface BirdeyeOHLCVItem {
    unixTime: number;
    o: number;
    h: number;
    l: number;
    c: number;
    v: number;
}

export interface JupiterQuoteResponse {
    inputMint: string;
    outputMint: string;
    inAmount: string;
    outAmount: string;
    priceImpactPct: number;
    routePlan: any[];
}

export interface RateLimitInfo {
    limit: number;
    remaining: number;
    reset: number;
}