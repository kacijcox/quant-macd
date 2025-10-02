import EventEmitter from 'eventemitter3';
import { WebSocketMessage } from '@/types';

export class WebSocketClient extends EventEmitter {
    private ws: WebSocket | null = null;
    private url: string;
    private reconnectAttempts: number = 0;
    private maxReconnectAttempts: number = 5;
    private reconnectDelay: number = 1000;
    private heartbeatInterval: NodeJS.Timeout | null = null;
    private isConnected: boolean = false;

    constructor(url: string) {
        super();
        this.url = url;
    }

    /**
     * Connect to WebSocket server
     */
    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            try {
                this.ws = new WebSocket(this.url);

                this.ws.onopen = () => {
                    console.log('WebSocket connected');
                    this.isConnected = true;
                    this.reconnectAttempts = 0;
                    this.startHeartbeat();
                    this.emit('connected');
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const message: WebSocketMessage = JSON.parse(event.data);
                        this.handleMessage(message);
                    } catch (error) {
                        console.error('Failed to parse WebSocket message:', error);
                    }
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    this.emit('error', error);
                    reject(error);
                };

                this.ws.onclose = () => {
                    console.log('WebSocket disconnected');
                    this.isConnected = false;
                    this.stopHeartbeat();
                    this.emit('disconnected');
                    this.attemptReconnect();
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Disconnect from WebSocket server
     */
    disconnect(): void {
        this.stopHeartbeat();
        if (this.ws) {
            this.ws.close();
            this.ws = null;
        }
        this.isConnected = false;
    }

    /**
     * Send message to server
     */
    send(data: any): void {
        if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.error('WebSocket is not connected');
            return;
        }

        this.ws.send(JSON.stringify(data));
    }

    /**
     * Subscribe to a channel
     */
    subscribe(channel: string, params?: any): void {
        this.send({
            type: 'SUBSCRIBE',
            channel,
            params,
            timestamp: Date.now()
        });
    }

    /**
     * Unsubscribe from a channel
     */
    unsubscribe(channel: string): void {
        this.send({
            type: 'UNSUBSCRIBE',
            channel,
            timestamp: Date.now()
        });
    }

    /**
     * Handle incoming messages
     */
    private handleMessage(message: WebSocketMessage): void {
        switch (message.type) {
            case 'PRICE_UPDATE':
                this.emit('priceUpdate', message.data);
                break;
            case 'SIGNAL':
                this.emit('signal', message.data);
                break;
            case 'ERROR':
                this.emit('error', message.data);
                break;
            case 'HEARTBEAT':
                // Heartbeat received, connection is alive
                break;
            default:
                this.emit('message', message);
        }
    }

    /**
     * Attempt to reconnect
     */
    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Max reconnection attempts reached');
            this.emit('maxReconnectAttemptsReached');
            return;
        }

        this.reconnectAttempts++;
        const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

        console.log(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);

        setTimeout(() => {
            this.connect().catch(error => {
                console.error('Reconnection failed:', error);
            });
        }, delay);
    }

    /**
     * Start heartbeat
     */
    private startHeartbeat(): void {
        this.heartbeatInterval = setInterval(() => {
            if (this.isConnected) {
                this.send({
                    type: 'HEARTBEAT',
                    timestamp: Date.now()
                });
            }
        }, 30000); // Send heartbeat every 30 seconds
    }

    /**
     * Stop heartbeat
     */
    private stopHeartbeat(): void {
        if (this.heartbeatInterval) {
            clearInterval(this.heartbeatInterval);
            this.heartbeatInterval = null;
        }
    }

    /**
     * Get connection status
     */
    getStatus(): boolean {
        return this.isConnected;
    }
}