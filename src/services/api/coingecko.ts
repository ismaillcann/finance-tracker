import { coinGeckoClient } from './client';
import { Quote, Asset } from '../../types';
import Config from 'react-native-config';
import { getMockQuoteForSymbol } from './mockData';

const API_KEY = Config.COINGECKO_API_KEY || '';
const USE_MOCK_DATA = !API_KEY || API_KEY === 'your_coingecko_api_key_here';

export const getCoinPrice = async (coinId: string): Promise<Quote | null> => {
    // Use mock data if no API key
    if (USE_MOCK_DATA) {
        const symbol = coinId === 'bitcoin' ? 'BTC' : coinId === 'ethereum' ? 'ETH' : coinId.toUpperCase();
        return getMockQuoteForSymbol(symbol);
    }

    try {
        const response = await coinGeckoClient.get(`/coins/${coinId}`, {
            params: {
                localization: false,
                tickers: false,
                market_data: true,
                community_data: false,
                developer_data: false,
            },
            headers: API_KEY ? { 'x-cg-demo-api-key': API_KEY } : {},
        });

        const data = response.data;

        if (!data || !data.market_data) {
            console.warn(`[CoinGecko] No market data for ${coinId}, using mock`);
            return getMockQuoteForSymbol(coinId.toUpperCase());
        }

        const currentPrice = data.market_data.current_price.usd || 0;
        const priceChange24h = data.market_data.price_change_24h || 0;
        const priceChangePercent24h =
            data.market_data.price_change_percentage_24h || 0;

        return {
            symbol: data.symbol.toUpperCase(),
            price: currentPrice,
            change: priceChange24h,
            changePercent: priceChangePercent24h,
            open: currentPrice - priceChange24h,
            high: data.market_data.high_24h?.usd || currentPrice,
            low: data.market_data.low_24h?.usd || currentPrice,
            close: currentPrice,
            volume: data.market_data.total_volume?.usd || 0,
            previousClose: currentPrice - priceChange24h,
            timestamp: Date.now(),
        };
    } catch (error: any) {
        console.warn(`[CoinGecko] Error fetching price for ${coinId}:`, error.message);
        return getMockQuoteForSymbol(coinId.toUpperCase());
    }
};

export const searchCoins = async (query: string): Promise<Asset[]> => {
    // Return empty for mock mode
    if (USE_MOCK_DATA) {
        return [];
    }

    try {
        const response = await coinGeckoClient.get('/search', {
            params: { query },
            headers: API_KEY ? { 'x-cg-demo-api-key': API_KEY } : {},
        });

        const data = response.data;

        if (!data || !data.coins) {
            return [];
        }

        return data.coins.slice(0, 10).map((coin: any) => ({
            id: coin.id,
            symbol: coin.symbol.toUpperCase(),
            name: coin.name,
            type: 'crypto',
            currency: 'USD',
        }));
    } catch (error: any) {
        console.error('[CoinGecko] Search error:', error.message);
        return [];
    }
};
