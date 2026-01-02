import { coinGeckoClient } from './client';
import { Asset, Quote } from '../../types';

export const searchCoins = async (query: string): Promise<Asset[]> => {
    try {
        const response = await coinGeckoClient.get<any>('/search', {
            query,
        });

        if (!response.coins || response.coins.length === 0) {
            return [];
        }

        return response.coins.slice(0, 10).map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            type: 'crypto' as const,
            currency: 'USD',
        }));
    } catch (error) {
        console.error('Error searching coins:', error);
        return [];
    }
};

export const getCoinPrice = async (coinId: string): Promise<Quote | null> => {
    try {
        const response = await coinGeckoClient.get<any>(
            `/simple/price`,
            {
                ids: coinId,
                vs_currencies: 'usd',
                include_24hr_change: true,
                include_24hr_vol: true,
            },
        );

        if (!response[coinId]) {
            return null;
        }

        const data = response[coinId];
        const price = data.usd;
        const changePercent = data.usd_24h_change || 0;
        const change = (price * changePercent) / 100;

        return {
            price,
            change,
            changePercent,
            timestamp: Date.now(),
            open: price - change,
            high: price,
            low: price,
            close: price,
            volume: data.usd_24h_vol || 0,
            previousClose: price - change,
        };
    } catch (error) {
        console.error('Error fetching coin price:', error);
        return null;
    }
};

export const getCoinMarketChart = async (
    coinId: string,
    days: number = 30,
): Promise<any> => {
    try {
        const response = await coinGeckoClient.get<any>(
            `/coins/${coinId}/market_chart`,
            {
                vs_currency: 'usd',
                days,
            },
        );

        return response;
    } catch (error) {
        console.error('Error fetching coin market chart:', error);
        return null;
    }
};
