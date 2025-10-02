// src/hooks/useWebSocket.ts
import { useState, useEffect, useCallback } from 'react';
import { WebSocketClient } from '@/services/websocket/wsClient';

export const useWebSocket = (url: string) => {
    const [client, setClient] = useState<WebSocketClient | null>(null);
    const [connected, setConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const ws = new WebSocketClient(url);

        ws.on('connected', () => setConnected(true));
        ws.on('disconnected', () => setConnected(false));
        ws.on('error', (err) => setError(err.message));

        ws.connect().catch(err => setError(err.message));

        setClient(ws);

        return () => {
            ws.disconnect();
        };
    }, [url]);

    const subscribe = useCallback((channel: string, params?: any) => {
        client?.subscribe(channel, params);
    }, [client]);

    const unsubscribe = useCallback((channel: string) => {
        client?.unsubscribe(channel);
    }, [client]);

    return { client, connected, error, subscribe, unsubscribe };
};