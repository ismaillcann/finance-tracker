import { twelveDataClient } from './client';
import { Quote, TimeSeriesData, Asset } from '../../types';
import Config from 'react-native-config';
import { getMockQuoteForSymbol, getMockTimeSeries } from './mockData';

const API_KEY = Config.TWELVEDATA_API_KEY || '';
const USE_MOCK_DATA = !API_KEY || API_KEY === 'your_twelvedata_api_key_here';

export const getQuote = async (symbol: string): Promise<Quote | null> => {
    // Use mock data if no API key
    if (USE_MOCK_DATA) {
        return getMockQuoteForSymbol(symbol);
    }

    try {
        const response = await twelveDataClient.get('/quote', {
            params: {
                symbol,
                apikey: API_KEY,
            },
        });

        const data = response.data;

        if (!data || data.status === 'error') {
            console.warn(`[TwelveData] API error for ${symbol}, using mock data`);
            return getMockQuoteForSymbol(symbol);
        }

        return {
            symbol: data.symbol,
            price: parseFloat(data.close) || 0,
            change: parseFloat(data.change) || 0,
            changePercent: parseFloat(data.percent_change) || 0,
            open: parseFloat(data.open) || 0,
            high: parseFloat(data.high) || 0,
            low: parseFloat(data.low) || 0,
            close: parseFloat(data.close) || 0,
            volume: parseInt(data.volume, 10) || 0,
            previousClose: parseFloat(data.previous_close) || 0,
            timestamp: Date.now(),
        };
    } catch (error: any) {
        console.warn(`[TwelveData] Error fetching quote for ${symbol}:`, error.message);
        return getMockQuoteForSymbol(symbol);
    }
};

export const getTimeSeries = async (
    symbol: string,
    interval: string = '1day',
    outputsize: number = 30,
): Promise<TimeSeriesData | null> => {
    // Use mock data if no API key
    if (USE_MOCK_DATA) {
        return {
            symbol,
            data: getMockTimeSeries(symbol, outputsize),
        };
    }

    try {
        const response = await twelveDataClient.get('/time_series', {
            params: {
                symbol,
                interval,
                outputsize,
                apikey: API_KEY,
            },
        });

        const data = response.data;

        if (!data || !data.values || data.status === 'error') {
            console.warn(`[TwelveData] API error for ${symbol} time series, using mock data`);
            return {
                symbol,
                data: getMockTimeSeries(symbol, outputsize),
            };
        }

        const candlestickData = data.values.map((item: any) => ({
            timestamp: new Date(item.datetime).getTime(),
            open: parseFloat(item.open) || 0,
            high: parseFloat(item.high) || 0,
            low: parseFloat(item.low) || 0,
            close: parseFloat(item.close) || 0,
            volume: parseInt(item.volume, 10) || 0,
        }));

        return {
            symbol,
            data: candlestickData,
        };
    } catch (error: any) {
        console.warn(`[TwelveData] Error fetching time series for ${symbol}:`, error.message);
        return {
            symbol,
            data: getMockTimeSeries(symbol, outputsize),
        };
    }
};

export const searchAssets = async (query: string): Promise<Asset[]> => {
    // Return empty for mock mode
    if (USE_MOCK_DATA) {
        return [];
    }

    try {
        const response = await twelveDataClient.get('/symbol_search', {
            params: {
                symbol: query,
                apikey: API_KEY,
            },
        });

        const data = response.data;

        if (!data || !data.data) {
            return [];
        }

        return data.data.slice(0, 10).map((item: any) => ({
            id: item.symbol,
            symbol: item.symbol,
            name: item.instrument_name,
            type: item.instrument_type === 'Common Stock' ? 'stock' : 'index',
            exchange: item.exchange,
            currency: item.currency,
        }));
    } catch (error: any) {
        console.error('[TwelveData] Search error:', error.message);
        return [];
    }
};
