// src/types/solana.types.ts
import { Commitment, PublicKey } from '@solana/web3.js';

export interface SolanaConfig {
    rpcUrl: string;
    wsUrl?: string;
    commitment: Commitment;
}

export interface TokenAccount {
    pubkey: PublicKey;
    mint: PublicKey;
    owner: PublicKey;
    amount: number;
    decimals: number;
}

export interface SwapInstruction {
    programId: string;
    amountIn: number;
    minimumAmountOut: number;
    poolAddress: string;
}

export interface PoolInfo {
    address: string;
    tokenA: string;
    tokenB: string;
    liquidityA: number;
    liquidityB: number;
    fee: number;
}

export type DEXType = 'RAYDIUM' | 'ORCA' | 'JUPITER' | 'UNKNOWN';