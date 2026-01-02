import { Quote, CandlestickData } from '../../types';

// Mock quote data for when API fails or is unavailable
export const getMockQuote = (symbol: string): Quote => {
    const basePrice = Math.random() * 1000 + 100;
    const change = (Math.random() - 0.5) * 20;
    const changePercent = (change / basePrice) * 100;

    return {
        symbol,
        price: basePrice,
        change,
        changePercent,
        open: basePrice - Math.random() * 10,
        high: basePrice + Math.random() * 15,
        low: basePrice - Math.random() * 15,
        close: basePrice,
        volume: Math.floor(Math.random() * 10000000) + 1000000,
        previousClose: basePrice - change,
        timestamp: Date.now(),
    };
};

// Mock time series data for charts
export const getMockTimeSeries = (
    symbol: string,
    days: number = 30,
): CandlestickData[] => {
    const data: CandlestickData[] = [];
    let basePrice = Math.random() * 1000 + 100;

    for (let i = days; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);

        const open = basePrice + (Math.random() - 0.5) * 10;
        const close = open + (Math.random() - 0.5) * 15;
        const high = Math.max(open, close) + Math.random() * 5;
        const low = Math.min(open, close) - Math.random() * 5;
        const volume = Math.floor(Math.random() * 5000000) + 500000;

        data.push({
            timestamp: date.getTime(),
            open,
            high,
            low,
            close,
            volume,
        });

        basePrice = close;
    }

    return data;
};

// Popular stock symbols with realistic data
export const MOCK_STOCK_DATA: Record<string, Partial<Quote>> = {
    AAPL: {
        symbol: 'AAPL',
        price: 178.25,
        change: 2.15,
        changePercent: 1.22,
        open: 176.10,
        high: 179.50,
        low: 175.80,
        volume: 52341000,
    },
    GOOGL: {
        symbol: 'GOOGL',
        price: 142.65,
        change: -1.35,
        changePercent: -0.94,
        open: 144.00,
        high: 144.80,
        low: 142.10,
        volume: 28456000,
    },
    TSLA: {
        symbol: 'TSLA',
        price: 248.50,
        change: 5.75,
        changePercent: 2.37,
        open: 242.75,
        high: 251.20,
        low: 241.50,
        volume: 95234000,
    },
    MSFT: {
        symbol: 'MSFT',
        price: 374.80,
        change: 3.20,
        changePercent: 0.86,
        open: 371.60,
        high: 376.40,
        low: 370.90,
        volume: 21567000,
    },
};

// Crypto mock data
export const MOCK_CRYPTO_DATA: Record<string, Partial<Quote>> = {
    BTC: {
        symbol: 'BTC',
        price: 42850.00,
        change: 1250.00,
        changePercent: 3.01,
        open: 41600.00,
        high: 43200.00,
        low: 41400.00,
        volume: 28500000000,
    },
    ETH: {
        symbol: 'ETH',
        price: 2245.50,
        change: -45.30,
        changePercent: -1.98,
        open: 2290.80,
        high: 2310.00,
        low: 2230.00,
        volume: 12400000000,
    },
};

export const getMockQuoteForSymbol = (symbol: string): Quote => {
    const mockData =
        MOCK_STOCK_DATA[symbol] || MOCK_CRYPTO_DATA[symbol] || {};

    const baseQuote = getMockQuote(symbol);

    return {
        ...baseQuote,
        ...mockData,
        close: mockData.price || baseQuote.price,
        previousClose:
            (mockData.price || baseQuote.price) - (mockData.change || baseQuote.change),
        timestamp: Date.now(),
    };
};
