import axios, { AxiosInstance } from 'axios';
import { PriceData, TokenData } from '@/types';

export class BirdeyeAPI {
    private client: AxiosInstance;
    private apiKey: string;

    constructor(apiKey: string = '') {
        this.apiKey = apiKey || process.env.REACT_APP_BIRDEYE_API_KEY || '';

        this.client = axios.create({
            baseURL: 'https://public-api.birdeye.so',
            headers: {
                'X-API-KEY': this.apiKey,
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
    }

    /**
     * Get token information
     */
    async getToken(address: string): Promise<TokenData | null> {
        try {
            const response = await this.client.get(`/public/token_overview`, {
                params: { address }
            });

            const data = response.data.data;

            return {
                address: data.address,
                symbol: data.symbol,
                name: data.name,
                decimals: data.decimals,
                price: data.price,
                priceHistory: []
            };
        } catch (error) {
            console.error('Error fetching token from Birdeye:', error);
            return null;
        }
    }

    /**
     * Get OHLCV data
     */
    async getOHLCV(
        address: string,
        interval: string = '5m',
        limit: number = 100
    ): Promise<PriceData[]> {
        try {
            const response = await this.client.get(`/defi/ohlcv`, {
                params: {
                    address,
                    type: interval,
                    time_from: Math.floor(Date.now() / 1000) - (limit * this.intervalToSeconds(interval)),
                    time_to: Math.floor(Date.now() / 1000)
                }
            });

            return response.data.data.items.map((item: any) => ({
                timestamp: item.unixTime * 1000,
                open: item.o,
                high: item.h,
                low: item.l,
                close: item.c,
                volume: item.v
            }));
        } catch (error) {
            console.error('Error fetching OHLCV from Birdeye:', error);
            return [];
        }
    }

    /**
     * Get token price
     */
    async getPrice(address: string): Promise<number> {
        try {
            const response = await this.client.get(`/public/price`, {
                params: { address }
            });

            return response.data.data.value;
        } catch (error) {
            console.error('Error fetching price from Birdeye:', error);
            return 0;
        }
    }

    /**
     * Get multi token prices
     */
    async getMultiPrice(addresses: string[]): Promise<Map<string, number>> {
        try {
            const response = await this.client.post(`/public/multi_price`, {
                list_address: addresses
            });

            const prices = new Map<string, number>();

            for (const [address, data] of Object.entries(response.data.data)) {
                prices.set(address, (data as any).value);
            }

            return prices;
        } catch (error) {
            console.error('Error fetching multi prices from Birdeye:', error);
            return new Map();
        }
    }

    /**
     * Get token trades
     */
    async getTrades(
        address: string,
        limit: number = 50
    ): Promise<any[]> {
        try {
            const response = await this.client.get(`/defi/txs/token`, {
                params: {
                    address,
                    tx_type: 'swap',
                    limit
                }
            });

            return response.data.data.items;
        } catch (error) {
            console.error('Error fetching trades from Birdeye:', error);
            return [];
        }
    }

    /**
     * Get token volume
     */
    async getVolume(address: string): Promise<{
        volume24h: number,
        volumeChange: number,
        trades24h: number
    }> {
        try {
            const response = await this.client.get(`/defi/token_overview`, {
                params: { address }
            });

            const data = response.data.data;

            return {
                volume24h: data.v24hUSD,
                volumeChange: data.v24hChangePercent,
                trades24h: data.trade24h
            };
        } catch (error) {
            console.error('Error fetching volume from Birdeye:', error);
            return {
                volume24h: 0,
                volumeChange: 0,
                trades24h: 0
            };
        }
    }

    /**
     * Search tokens
     */
    async searchTokens(query: string): Promise<TokenData[]> {
        try {
            const response = await this.client.get(`/public/token_search`, {
                params: {
                    keyword: query,
                    sort_by: 'v24hUSD',
                    sort_type: 'desc',
                    limit: 10
                }
            });

            return response.data.data.items.map((item: any) => ({
                address: item.address,
                symbol: item.symbol,
                name: item.name,
                decimals: item.decimals,
                price: item.price,
                priceHistory: []
            }));
        } catch (error) {
            console.error('Error searching tokens on Birdeye:', error);
            return [];
        }
    }

    /**
     * Convert interval to seconds
     */
    private intervalToSeconds(interval: string): number {
        const intervals: Record<string, number> = {
            '1m': 60,
            '5m': 300,
            '15m': 900,
            '30m': 1800,
            '1h': 3600,
            '4h': 14400,
            '1d': 86400
        };

        return intervals[interval] || 300;
    }
}