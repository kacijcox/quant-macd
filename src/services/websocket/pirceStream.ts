import { WebSocketClient } from './wsClient';
import { PriceData } from '@/types';
import EventEmitter from 'eventemitter3';

export class PriceStreamService extends EventEmitter {
    private wsClient: WebSocketClient;
    private subscriptions: Map<string, boolean> = new Map();
    private priceBuffer: Map<string, PriceData[]> = new Map();
    private maxBufferSize: number = 1000;

    constructor(wsUrl: string) {
        super();
        this.wsClient = new WebSocketClient(wsUrl);
        this.setupEventListeners();
    }

    /**
     * Setup WebSocket event listeners
     */
    private setupEventListeners(): void {
        this.wsClient.on('connected', () => {
            console.log('Price stream connected');
            this.resubscribeAll();
        });

        this.wsClient.on('priceUpdate', (data: any) => {
            this.handlePriceUpdate(data);
        });

        this.wsClient.on('error', (error: any) => {
            console.error('Price stream error:', error);
            this.emit('error', error);
        });

        this.wsClient.on('disconnected', () => {
            console.log('Price stream disconnected');
            this.emit('disconnected');
        });
    }

    /**
     * Connect to price stream
     */
    async connect(): Promise<void> {
        await this.wsClient.connect();
    }

    /**
     * Disconnect from price stream
     */
    disconnect(): void {
        this.wsClient.disconnect();
        this.subscriptions.clear();
        this.priceBuffer.clear();
    }

    /**
     * Subscribe to token price updates
     */
    subscribeToToken(tokenAddress: string, interval: string = '1m'): void {
        const key = `${tokenAddress}:${interval}`;

        if (this.subscriptions.has(key)) {
            return; // Already subscribed
        }

        this.wsClient.subscribe('PRICE', {
            token: tokenAddress,
            interval
        });

        this.subscriptions.set(key, true);
        this.priceBuffer.set(key, []);

        console.log(`Subscribed to price updates for ${tokenAddress} at ${interval}`);
    }

    /**
     * Unsubscribe from token price updates
     */
    unsubscribeFromToken(tokenAddress: string, interval: string = '1m'): void {
        const key = `${tokenAddress}:${interval}`;

        if (!this.subscriptions.has(key)) {
            return;
        }

        this.wsClient.unsubscribe(`PRICE:${key}`);
        this.subscriptions.delete(key);
        this.priceBuffer.delete(key);

        console.log(`Unsubscribed from price updates for ${tokenAddress}`);
    }

    /**
     * Handle incoming price updates
     */
    private handlePriceUpdate(data: any): void {
        const key = `${data.token}:${data.interval}`;

        const priceData: PriceData = {
            timestamp: data.timestamp,
            open: data.open,
            high: data.high,
            low: data.low,
            close: data.close,
            volume: data.volume
        };

        // Add to buffer
        let buffer = this.priceBuffer.get(key) || [];
        buffer.push(priceData);

        // Limit buffer size
        if (buffer.length > this.maxBufferSize) {
            buffer = buffer.slice(-this.maxBufferSize);
        }

        this.priceBuffer.set(key, buffer);

        // Emit update event
        this.emit('priceUpdate', {
            token: data.token,
            interval: data.interval,
            price: priceData,
            buffer: buffer
        });
    }

    /**
     * Get price buffer for a token
     */
    getPriceBuffer(tokenAddress: string, interval: string = '1m'): PriceData[] {
        const key = `${tokenAddress}:${interval}`;
        return this.priceBuffer.get(key) || [];
    }

    /**
     * Resubscribe to all tokens after reconnection
     */
    private resubscribeAll(): void {
        for (const key of this.subscriptions.keys()) {
            const [token, interval] = key.split(':');
            this.wsClient.subscribe('PRICE', { token, interval });
        }
    }

    /**
     * Get latest price for a token
     */
    getLatestPrice(tokenAddress: string, interval: string = '1m'): PriceData | null {
        const buffer = this.getPriceBuffer(tokenAddress, interval);
        return buffer.length > 0 ? buffer[buffer.length - 1] : null;
    }

    /**
     * Clear price buffer for a token
     */
    clearBuffer(tokenAddress: string, interval: string = '1m'): void {
        const key = `${tokenAddress}:${interval}`;
        this.priceBuffer.set(key, []);
    }

    /**
     * Get all active subscriptions
     */
    getActiveSubscriptions(): string[] {
        return Array.from(this.subscriptions.keys());
    }
}