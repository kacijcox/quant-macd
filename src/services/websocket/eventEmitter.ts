// src/services/websocket/eventEmitter.ts
// Re-export EventEmitter3 for consistency
export { EventEmitter } from 'eventemitter3';

// Custom event types for type safety
export interface WebSocketEvents {
    connected: () => void;
    disconnected: () => void;
    error: (error: Error) => void;
    priceUpdate: (data: any) => void;
    signal: (data: any) => void;
    message: (data: any) => void;
}

// Type-safe event emitter
export type TypedEventEmitter = {
    on<K extends keyof WebSocketEvents>(event: K, listener: WebSocketEvents[K]): void;
    off<K extends keyof WebSocketEvents>(event: K, listener: WebSocketEvents[K]): void;
    emit<K extends keyof WebSocketEvents>(event: K, ...args: Parameters<WebSocketEvents[K]>): void;
};