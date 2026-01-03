export type AssetType = 'stock' | 'crypto' | 'index';

export interface Asset {
    id: string;
    symbol: string;
    name: string;
    type: AssetType;
    exchange?: string;
    currency?: string;
}

export interface PriceData {
    price: number;
    change: number;
    changePercent: number;
    timestamp: number;
}

export interface Quote extends PriceData {
    symbol: string;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    previousClose: number;
}

export interface CandlestickData {
    timestamp: number;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
}

export interface TimeSeriesData {
    symbol: string;
    interval: string;
    data: CandlestickData[];
}

export interface WatchlistItem {
    id: string;
    userId: string;
    asset: Asset;
    addedAt: number;
    order: number;
}

export interface User {
    id: string;
    email: string;
    displayName?: string;
    createdAt: number;
}

export type TimeRange = '1D' | '1W' | '1M' | '3M' | '1Y' | 'ALL';

export type ChartType = 'line' | 'candlestick';

export interface ChartConfig {
    type: ChartType;
    timeRange: TimeRange;
    showVolume: boolean;
}
