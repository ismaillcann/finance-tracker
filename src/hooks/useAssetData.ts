import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { Quote, TimeSeriesData, Asset } from '../types';
import { getQuote, getTimeSeries, searchAssets } from '../services/api/twelvedata';
import { getCoinPrice, searchCoins } from '../services/api/coingecko';
import {
    getIntervalFromTimeRange,
    getOutputSizeFromTimeRange,
} from '../utils/chartHelpers';
import type { TimeRange } from '../types';

export const useAssetQuote = (
    symbol: string,
    type: 'stock' | 'crypto',
    coinId?: string,
): UseQueryResult<Quote | null> => {
    return useQuery({
        queryKey: ['quote', symbol, type],
        queryFn: async () => {
            if (type === 'crypto' && coinId) {
                return await getCoinPrice(coinId);
            }
            return await getQuote(symbol);
        },
        refetchInterval: 60000,
        enabled: !!symbol,
    });
};

export const useAssetTimeSeries = (
    symbol: string,
    timeRange: TimeRange,
): UseQueryResult<TimeSeriesData | null> => {
    const interval = getIntervalFromTimeRange(timeRange);
    const outputsize = getOutputSizeFromTimeRange(timeRange);

    return useQuery({
        queryKey: ['timeseries', symbol, timeRange],
        queryFn: () => getTimeSeries(symbol, interval, outputsize),
        staleTime: 1000 * 60 * 5,
        enabled: !!symbol,
    });
};

export const useAssetSearch = (
    query: string,
    type: 'stock' | 'crypto' | 'all' = 'all',
): UseQueryResult<Asset[]> => {
    return useQuery({
        queryKey: ['search', query, type],
        queryFn: async () => {
            if (!query || query.length < 2) {
                return [];
            }

            if (type === 'crypto') {
                return await searchCoins(query);
            }

            if (type === 'stock') {
                return await searchAssets(query);
            }

            const [stocks, coins] = await Promise.all([
                searchAssets(query),
                searchCoins(query),
            ]);

            return [...stocks, ...coins];
        },
        enabled: query.length >= 2,
        staleTime: 1000 * 60 * 10,
    });
};
