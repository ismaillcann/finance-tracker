import { WatchlistItem, Asset } from '../../types';

let watchlistItems: WatchlistItem[] = [
    {
        id: 'watch-1',
        userId: 'mock-user-1',
        asset: {
            id: 'AAPL',
            symbol: 'AAPL',
            name: 'Apple Inc.',
            type: 'stock',
            exchange: 'NASDAQ',
            currency: 'USD',
        },
        addedAt: Date.now() - 86400000,
        order: 0,
    },
    {
        id: 'watch-2',
        userId: 'mock-user-1',
        asset: {
            id: 'GOOGL',
            symbol: 'GOOGL',
            name: 'Alphabet Inc.',
            type: 'stock',
            exchange: 'NASDAQ',
            currency: 'USD',
        },
        addedAt: Date.now() - 43200000,
        order: 1,
    },
    {
        id: 'watch-3',
        userId: 'mock-user-1',
        asset: {
            id: 'bitcoin',
            symbol: 'BTC',
            name: 'Bitcoin',
            type: 'crypto',
            currency: 'USD',
        },
        addedAt: Date.now() - 3600000,
        order: 2,
    },
];

let watchlistListeners: Array<(items: WatchlistItem[]) => void> = [];

export const getUserWatchlist = async (
    userId: string,
): Promise<WatchlistItem[]> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        return watchlistItems
            .filter(item => item.userId === userId)
            .sort((a, b) => a.order - b.order);
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        return [];
    }
};

export const addToWatchlist = async (
    userId: string,
    asset: Asset,
): Promise<WatchlistItem | null> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const existingItems = watchlistItems.filter(
            item => item.userId === userId,
        );
        const order = existingItems.length;

        const newItem: WatchlistItem = {
            id: `watch-${Date.now()}`,
            userId,
            asset,
            addedAt: Date.now(),
            order,
        };

        watchlistItems.push(newItem);
        notifyWatchlistListeners(userId);

        return newItem;
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        return null;
    }
};

export const removeFromWatchlist = async (
    watchlistItemId: string,
): Promise<boolean> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        const item = watchlistItems.find(i => i.id === watchlistItemId);
        if (!item) return false;

        watchlistItems = watchlistItems.filter(i => i.id !== watchlistItemId);
        notifyWatchlistListeners(item.userId);

        return true;
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        return false;
    }
};

export const updateWatchlistOrder = async (
    userId: string,
    items: WatchlistItem[],
): Promise<boolean> => {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));

        items.forEach((item, index) => {
            const existingItem = watchlistItems.find(i => i.id === item.id);
            if (existingItem) {
                existingItem.order = index;
            }
        });

        notifyWatchlistListeners(userId);
        return true;
    } catch (error) {
        console.error('Error updating watchlist order:', error);
        return false;
    }
};

export const watchWatchlist = (
    userId: string,
    callback: (items: WatchlistItem[]) => void,
): (() => void) => {
    const listener = (items: WatchlistItem[]) => {
        const userItems = items
            .filter(item => item.userId === userId)
            .sort((a, b) => a.order - b.order);
        callback(userItems);
    };

    watchlistListeners.push(listener);
    listener(watchlistItems);

    return () => {
        watchlistListeners = watchlistListeners.filter(l => l !== listener);
    };
};

const notifyWatchlistListeners = (userId: string) => {
    watchlistListeners.forEach(listener => listener(watchlistItems));
};
