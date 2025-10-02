// src/services/api/heliusApi.ts
import axios, { AxiosInstance } from 'axios';

export class HeliusAPI {
    private client: AxiosInstance;
    private apiKey: string;

    constructor(apiKey: string = '') {
        this.apiKey = apiKey || process.env.REACT_APP_HELIUS_API_KEY || '';

        this.client = axios.create({
            baseURL: `https://rpc.helius.xyz/?api-key=${this.apiKey}`,
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 10000
        });
    }

    /**
     * Get parsed transaction history
     */
    async getParsedTransactionHistory(address: string, limit: number = 100): Promise<any[]> {
        try {
            const response = await this.client.post('', {
                jsonrpc: '2.0',
                id: 'helius-tx-history',
                method: 'getSignaturesForAddress',
                params: [address, { limit }]
            });

            return response.data.result || [];
        } catch (error) {
            console.error('Error fetching transaction history from Helius:', error);
            return [];
        }
    }

    /**
     * Get asset information
     */
    async getAsset(assetId: string): Promise<any> {
        try {
            const response = await this.client.post('', {
                jsonrpc: '2.0',
                id: 'helius-asset',
                method: 'getAsset',
                params: { id: assetId }
            });

            return response.data.result;
        } catch (error) {
            console.error('Error fetching asset from Helius:', error);
            return null;
        }
    }

    /**
     * Get multiple assets
     */
    async getAssetBatch(assetIds: string[]): Promise<any[]> {
        try {
            const response = await this.client.post('', {
                jsonrpc: '2.0',
                id: 'helius-asset-batch',
                method: 'getAssetBatch',
                params: { ids: assetIds }
            });

            return response.data.result || [];
        } catch (error) {
            console.error('Error fetching asset batch from Helius:', error);
            return [];
        }
    }
}