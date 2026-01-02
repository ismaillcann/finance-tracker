import { CandlestickData, TimeRange } from '../types';

export const getIntervalFromTimeRange = (timeRange: TimeRange): string => {
    switch (timeRange) {
        case '1D':
            return '5min';
        case '1W':
            return '30min';
        case '1M':
            return '1h';
        case '3M':
            return '1day';
        case '1Y':
            return '1day';
        case 'ALL':
            return '1week';
        default:
            return '1day';
    }
};

export const getOutputSizeFromTimeRange = (timeRange: TimeRange): number => {
    switch (timeRange) {
        case '1D':
            return 78; // 6.5 hours * 12 (5min intervals)
        case '1W':
            return 130; // 5 days * 26 (30min intervals)
        case '1M':
            return 168; // ~30 days * 24 hours / 4
        case '3M':
            return 90;
        case '1Y':
            return 365;
        case 'ALL':
            return 520; // ~10 years
        default:
            return 100;
    }
};

export const processCandlestickData = (
    data: any[],
): CandlestickData[] => {
    return data.map(item => ({
        timestamp: new Date(item.datetime).getTime(),
        open: parseFloat(item.open),
        high: parseFloat(item.high),
        low: parseFloat(item.low),
        close: parseFloat(item.close),
        volume: parseFloat(item.volume || '0'),
    }));
};

export const calculatePriceChange = (
    current: number,
    previous: number,
): { change: number; changePercent: number } => {
    const change = current - previous;
    const changePercent = (change / previous) * 100;
    return { change, changePercent };
};
