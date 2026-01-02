import { Asset } from '../types';

export const POPULAR_STOCKS: Asset[] = [
    {
        id: 'AAPL',
        symbol: 'AAPL',
        name: 'Apple Inc.',
        type: 'stock',
        exchange: 'NASDAQ',
        currency: 'USD',
    },
    {
        id: 'GOOGL',
        symbol: 'GOOGL',
        name: 'Alphabet Inc.',
        type: 'stock',
        exchange: 'NASDAQ',
        currency: 'USD',
    },
    {
        id: 'MSFT',
        symbol: 'MSFT',
        name: 'Microsoft Corporation',
        type: 'stock',
        exchange: 'NASDAQ',
        currency: 'USD',
    },
    {
        id: 'TSLA',
        symbol: 'TSLA',
        name: 'Tesla Inc.',
        type: 'stock',
        exchange: 'NASDAQ',
        currency: 'USD',
    },
    {
        id: 'AMZN',
        symbol: 'AMZN',
        name: 'Amazon.com Inc.',
        type: 'stock',
        exchange: 'NASDAQ',
        currency: 'USD',
    },
    {
        id: 'META',
        symbol: 'META',
        name: 'Meta Platforms Inc.',
        type: 'stock',
        exchange: 'NASDAQ',
        currency: 'USD',
    },
    {
        id: 'NVDA',
        symbol: 'NVDA',
        name: 'NVIDIA Corporation',
        type: 'stock',
        exchange: 'NASDAQ',
        currency: 'USD',
    },
    {
        id: 'NFLX',
        symbol: 'NFLX',
        name: 'Netflix Inc.',
        type: 'stock',
        exchange: 'NASDAQ',
        currency: 'USD',
    },
];

export const POPULAR_CRYPTO: Asset[] = [
    {
        id: 'bitcoin',
        symbol: 'BTC',
        name: 'Bitcoin',
        type: 'crypto',
        currency: 'USD',
    },
    {
        id: 'ethereum',
        symbol: 'ETH',
        name: 'Ethereum',
        type: 'crypto',
        currency: 'USD',
    },
    {
        id: 'binancecoin',
        symbol: 'BNB',
        name: 'Binance Coin',
        type: 'crypto',
        currency: 'USD',
    },
    {
        id: 'solana',
        symbol: 'SOL',
        name: 'Solana',
        type: 'crypto',
        currency: 'USD',
    },
    {
        id: 'cardano',
        symbol: 'ADA',
        name: 'Cardano',
        type: 'crypto',
        currency: 'USD',
    },
    {
        id: 'ripple',
        symbol: 'XRP',
        name: 'XRP',
        type: 'crypto',
        currency: 'USD',
    },
];

export const POPULAR_ASSETS: Asset[] = [
    ...POPULAR_STOCKS,
    ...POPULAR_CRYPTO,
];

export const getPopularAssets = (type?: 'stock' | 'crypto' | 'all'): Asset[] => {
    if (type === 'stock') return POPULAR_STOCKS;
    if (type === 'crypto') return POPULAR_CRYPTO;
    return POPULAR_ASSETS;
};
