// src/hooks/useTokenData.ts
import { useState, useEffect } from 'react';
import { BirdeyeAPI } from '@/services/api/birdeyeApi';
import { TokenData, PriceData } from '@/types';

export const useTokenData = (tokenAddress: string, timeframe: string = '5m') => {
    const [tokenInfo, setTokenInfo] = useState<TokenData | null>(null);
    const [priceData, setPriceData] = useState<PriceData[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!tokenAddress) {
            setTokenInfo(null);
            setPriceData([]);
            return;
        }

        const fetchTokenData = async () => {
            setLoading(true);
            setError(null);

            try {
                const api = new BirdeyeAPI();

                // Fetch token info
                const info = await api.getToken(tokenAddress);
                setTokenInfo(info);

                // Fetch OHLCV data
                const ohlcv = await api.getOHLCV(tokenAddress, timeframe, 200);
                setPriceData(ohlcv);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch token data');
            } finally {
                setLoading(false);
            }
        };

        fetchTokenData();
    }, [tokenAddress, timeframe]);

    return { tokenInfo, priceData, loading, error };
};