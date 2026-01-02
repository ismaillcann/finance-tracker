export const APP_CONFIG = {
    name: 'Finance Tracker',
    version: '1.0.0',
    apiTimeout: 10000,
    refreshInterval: 60000, // 1 minute
} as const;

export const API_ENDPOINTS = {
    twelveData: 'https://api.twelvedata.com',
    coinGecko: 'https://api.coingecko.com/api/v3',
} as const;

export const CHART_CONFIG = {
    defaultTimeRange: '1D',
    timeRanges: ['1D', '1W', '1M', '3M', '1Y', 'ALL'] as const,
    candlestickColors: {
        up: '#26a69a',
        down: '#ef5350',
    },
    chartHeight: 300,
} as const;

export const FIRESTORE_COLLECTIONS = {
    users: 'users',
    watchlists: 'watchlists',
} as const;
