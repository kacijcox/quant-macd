// src/utils/validation.ts

/**
 * Validate Solana address format
 */
export const isValidSolanaAddress = (address: string): boolean => {
    if (!address || address.length < 32 || address.length > 44) {
        return false;
    }
    const base58Regex = /^[1-9A-HJ-NP-Za-km-z]+$/;
    return base58Regex.test(address);
};

/**
 * Validate timeframe string
 */
export const isValidTimeframe = (timeframe: string): boolean => {
    const validTimeframes = ['1m', '5m', '15m', '30m', '1h', '4h', '1d'];
    return validTimeframes.includes(timeframe);
};

/**
 * Validate numeric value is within range
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
    return value >= min && value <= max && !isNaN(value) && isFinite(value);
};

/**
 * Validate array has minimum length
 */
export const hasMinimumLength = <T>(arr: T[], minLength: number): boolean => {
    return Array.isArray(arr) && arr.length >= minLength;
};

/**
 * Sanitize user input
 */
export const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[^a-zA-Z0-9]/g, '');
};

/**
 * Validate price data
 */
export const isValidPriceData = (price: number): boolean => {
    return price > 0 && !isNaN(price) && isFinite(price);
};

/**
 * Validate MACD parameters
 */
export const validateMACDParams = (fast: number, slow: number, signal: number): boolean => {
    return fast > 0 && slow > fast && signal > 0;
};

/**
 * Check if API key is set
 */
export const hasAPIKey = (key: string | undefined): boolean => {
    return !!key && key.length > 0 && !key.includes('your_');
};