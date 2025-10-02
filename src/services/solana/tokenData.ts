export interface TokenData {
  symbol: string;
  price: number;
  timestamp: number;
  volume: number;
}

export interface OHLCData {
  open: number;
  high: number;
  low: number;
  close: number;
  timestamp: number;
  volume: number;
}

export interface MACDData {
  macd: number;
  signal: number;
  histogram: number;
  timestamp: number;
}

export interface MACDSettings {
  fastPeriod: number;
  slowPeriod: number;
  signalPeriod: number;
}

export type TimeframeInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '4h' | '1d';

export interface ChartData {
  prices: OHLCData[];
  macd: MACDData[];
  timeframe: TimeframeInterval;
}

export interface TokenInfo {
  address: string;
  symbol: string;
  name: string;
  decimals: number;
}