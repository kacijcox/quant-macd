// src/utils/format.ts

/**
 * Format number with specified decimals
 */
export const formatNumber = (value: number, decimals: number = 2): string => {
    if (isNaN(value) || !isFinite(value)) return '0.00';
    return value.toFixed(decimals);
};

/**
 * Format price based on magnitude
 */
export const formatPrice = (price: number): string => {
    if (price === 0) return '$0.00';
    if (price < 0.00001) return `$${price.toExponential(2)}`;
    if (price < 0.01) return `$${price.toFixed(6)}`;
    if (price < 1) return `$${price.toFixed(4)}`;
    return `$${price.toFixed(2)}`;
};

/**
 * Format percentage
 */
export const formatPercent = (value: number, decimals: number = 2): string => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(decimals)}%`;
};

/**
 * Format large numbers with K, M, B suffixes
 */
export const formatLargeNumber = (value: number): string => {
    if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`;
    if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`;
    if (value >= 1e3) return `$${(value / 1e3).toFixed(2)}K`;
    return `$${value.toFixed(2)}`;
};

/**
 * Format timestamp to readable date
 */
export const formatTimestamp = (timestamp: number): string => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

/**
 * Format Solana address (truncate)
 */
export const formatAddress = (address: string, chars: number = 4): string => {
    if (address.length <= chars * 2) return address;
    return `${address.substring(0, chars)}...${address.substring(address.length - chars)}`;
};

/**
 * Format duration in seconds to readable format
 */
export const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`;
    return `${Math.floor(seconds / 86400)}d`;
};

/**
 * Format ratio (e.g., Sharpe, Sortino)
 */
export const formatRatio = (ratio: number): string => {
    if (ratio === Infinity) return '∞';
    if (ratio === -Infinity) return '-∞';
    return ratio.toFixed(2);
};