import { twelveDataClient } from './client';
import { Asset, Quote, TimeSeriesData } from '../../types';
import { processCandlestickData } from '../../utils/chartHelpers';
import Config from 'react-native-config';

const API_KEY = Config.TWELVEDATA_API_KEY || 'demo';

export const searchAssets = async (query: string): Promise<Asset[]> => {
    try {
        const response = await twelveDataClient.get<any>('/symbol_search', {
            symbol: query,
            apikey: API_KEY,
        });

        if (!response.data || response.data.length === 0) {
            return [];
        }

        return response.data.slice(0, 10).map((item: any) => ({
            id: `${item.symbol}-${item.exchange}`,
            symbol: item.symbol,
            name: item.instrument_name,
            type: item.instrument_type === 'Common Stock' ? 'stock' : 'index',
            exchange: item.exchange,
            currency: item.currency,
        }));
    } catch (error) {
        console.error('Error searching assets:', error);
        return [];
    }
};

export const getQuote = async (symbol: string): Promise<Quote | null> => {
    try {
        const response = await twelveDataClient.get<any>('/quote', {
            symbol,
            apikey: API_KEY,
        });

        if (!response || response.code === 400) {
            return null;
        }

        const current = parseFloat(response.close);
        const previous = parseFloat(response.previous_close);
        const change = current - previous;
        const changePercent = (change / previous) * 100;

        return {
            price: current,
            change,
            changePercent,
            timestamp: Date.now(),
            open: parseFloat(response.open),
            high: parseFloat(response.high),
            low: parseFloat(response.low),
            close: current,
            volume: parseFloat(response.volume || '0'),
            previousClose: previous,
        };
    } catch (error) {
        console.error('Error fetching quote:', error);
        return null;
    }
};

export const getTimeSeries = async (
    symbol: string,
    interval: string = '1day',
    outputsize: number = 30,
): Promise<TimeSeriesData | null> => {
    try {
        const response = await twelveDataClient.get<any>('/time_series', {
            symbol,
            interval,
            outputsize,
            apikey: API_KEY,
        });

        if (!response.values || response.values.length === 0) {
            return null;
        }

        return {
            symbol,
            interval,
            data: processCandlestickData(response.values.reverse()),
        };
    } catch (error) {
        console.error('Error fetching time series:', error);
        return null;
    }
};
