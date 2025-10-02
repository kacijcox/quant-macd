// src/hooks/useSolanaConnection.tsx
import { useState, useEffect } from 'react';
import { SolanaService } from '@/services/solana/connection';

export const useSolanaConnection = () => {
    const [connected, setConnected] = useState(false);
    const [service, setService] = useState<SolanaService | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const initConnection = async () => {
            try {
                const solanaService = new SolanaService();
                const stats = await solanaService.getConnectionStats();

                setService(solanaService);
                setConnected(true);
                console.log('Solana connected:', stats);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Connection failed');
                setConnected(false);
            }
        };

        initConnection();
    }, []);

    return { connected, service, error };
};