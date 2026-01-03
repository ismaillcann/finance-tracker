import firestore from '@react-native-firebase/firestore';
import { Asset, WatchlistItem } from '../../types';

const watchlistsCollection = firestore().collection('watchlists');

export const getUserWatchlist = async (
    userId: string,
): Promise<WatchlistItem[]> => {
    try {
        const snapshot = await watchlistsCollection
            .where('userId', '==', userId)
            .orderBy('addedAt', 'desc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            userId: doc.data().userId,
            asset: doc.data().asset,
            addedAt: doc.data().addedAt,
        }));
    } catch (error) {
        console.error('[Firestore] Error fetching watchlist:', error);
        return [];
    }
};

export const addToWatchlist = async (
    userId: string,
    asset: Asset,
): Promise<boolean> => {
    try {
        // Check if asset already exists
        const existing = await watchlistsCollection
            .where('userId', '==', userId)
            .where('asset.symbol', '==', asset.symbol)
            .get();

        if (!existing.empty) {
            return false;
        }

        // Add new asset
        await watchlistsCollection.add({
            userId,
            asset,
            addedAt: Date.now(),
        });

        return true;
    } catch (error) {
        console.error('[Firestore] Error adding to watchlist:', error);
        return false;
    }
};

export const removeFromWatchlist = async (
    itemId: string,
): Promise<boolean> => {
    try {
        await watchlistsCollection.doc(itemId).delete();
        return true;
    } catch (error) {
        console.error('[Firestore] Error removing from watchlist:', error);
        return false;
    }
};

export const watchWatchlist = (
    userId: string,
    callback: (items: WatchlistItem[]) => void,
): (() => void) => {
    const unsubscribe = watchlistsCollection
        .where('userId', '==', userId)
        .orderBy('addedAt', 'desc')
        .onSnapshot(
            snapshot => {
                const items = snapshot.docs.map(doc => ({
                    id: doc.id,
                    userId: doc.data().userId,
                    asset: doc.data().asset,
                    addedAt: doc.data().addedAt,
                }));
                callback(items);
            },
            error => {
                console.error('[Firestore] Watch error:', error);
                callback([]);
            },
        );

    return unsubscribe;
};
