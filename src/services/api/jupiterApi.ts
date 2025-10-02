import axios, { AxiosInstance } from 'axios';

export class JupiterAPI {
    private client: AxiosInstance;

    constructor() {
        this.client = axios.create({
            baseURL: process.env.REACT_APP_JUPITER_API_URL || 'https://quote-api.jup.ag/v6',
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
    }

    /**
     * Get swap quote
     */
    async getQuote(
        inputMint: string,
        outputMint: string,
        amount: number,
        slippageBps: number = 50 // 0.5% slippage
    ): Promise<any> {
        try {
            const response = await this.client.get('/quote', {
                params: {
                    inputMint,
                    outputMint,
                    amount,
                    slippageBps
                }
            });

            return response.data;
        } catch (error) {
            console.error('Error fetching quote from Jupiter:', error);
            return null;
        }
    }

    /**
     * Get all tradeable tokens
     */
    async getTokenList(): Promise<any[]> {
        try {
            const response = await this.client.get('/tokens');
            return response.data;
        } catch (error) {
            console.error('Error fetching token list from Jupiter:', error);
            return [];
        }
    }

    /**
     * Get price for token pair
     */
    async getPrice(
        inputMint: string,
        outputMint: string,
        amount: number = 1000000 // 1 USDC default
    ): Promise<number> {
        try {
            const quote = await this.getQuote(inputMint, outputMint, amount);

            if (!quote) return 0;

            return Number(quote.outAmount) / Number(quote.inAmount);
        } catch (error) {
            console.error('Error fetching price from Jupiter:', error);
            return 0;
        }
    }

    /**
     * Get routes for swap
     */
    async getRoutes(
        inputMint: string,
        outputMint: string,
        amount: number
    ): Promise<any[]> {
        try {
            const quote = await this.getQuote(inputMint, outputMint, amount);
            return quote ? quote.routePlan : [];
        } catch (error) {
            console.error('Error fetching routes from Jupiter:', error);
            return [];
        }
    }

    /**
     * Get token info by address
     */
    async getTokenInfo(address: string): Promise<any> {
        try {
            const tokens = await this.getTokenList();
            return tokens.find(token => token.address === address);
        } catch (error) {
            console.error('Error fetching token info from Jupiter:', error);
            return null;
        }
    }

    /**
     * Calculate price impact
     */
    async calculatePriceImpact(
        inputMint: string,
        outputMint: string,
        amount: number
    ): Promise<number> {
        try {
            const quote = await this.getQuote(inputMint, outputMint, amount);

            if (!quote) return 0;

            return quote.priceImpactPct || 0;
        } catch (error) {
            console.error('Error calculating price impact:', error);
            return 0;
        }
    }

    /**
     * Get market info
     */
    async getMarketInfo(marketId: string): Promise<any> {
        try {
            const response = await this.client.get(`/market/${marketId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching market info from Jupiter:', error);
            return null;
        }
    }
}