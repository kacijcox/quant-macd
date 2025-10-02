// src/hooks/useMACDCalculation.ts
import { useState, useEffect } from 'react';
import { MACDCalculator } from '@/core/indicators/macd';
import { MACDResult } from '@/types';

export const useMACDCalculation = (
    prices: number[],
    mode: 'STANDARD' | 'ADAPTIVE' = 'STANDARD'
) => {
    const [macdResult, setMacdResult] = useState<MACDResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!prices || prices.length === 0) {
            setMacdResult(null);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const calculator = new MACDCalculator();

            const result = mode === 'ADAPTIVE'
                ? calculator.calculateAdaptive(prices, 0.02)
                : calculator.calculate(prices);

            setMacdResult(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'MACD calculation failed');
        } finally {
            setLoading(false);
        }
    }, [prices, mode]);

    return { macdResult, loading, error };
};