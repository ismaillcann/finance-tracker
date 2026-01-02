import firestore from '@react-native-firebase/firestore';
import { WatchlistItem, Asset } from '../../types';
import { FIRESTORE_COLLECTIONS } from '../../config/constants';

export const getUserWatchlist = async (
    userId: string,
): Promise<WatchlistItem[]> => {
    try {
        const snapshot = await firestore()
            .collection(FIRESTORE_COLLECTIONS.watchlists)
            .where('userId', '==', userId)
            .orderBy('order', 'asc')
            .get();

        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        })) as WatchlistItem[];
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
        const existingItems = await getUserWatchlist(userId);
        const order = existingItems.length;

        const docRef = await firestore()
            .collection(FIRESTORE_COLLECTIONS.watchlists)
            .add({
                userId,
                asset,
                addedAt: Date.now(),
                order,
            });

        const doc = await docRef.get();
        return {
            id: doc.id,
            ...doc.data(),
        } as WatchlistItem;
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        return null;
    }
};

export const removeFromWatchlist = async (
    watchlistItemId: string,
): Promise<boolean> => {
    try {
        await firestore()
            .collection(FIRESTORE_COLLECTIONS.watchlists)
            .doc(watchlistItemId)
            .delete();
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
        const batch = firestore().batch();

        items.forEach((item, index) => {
            const docRef = firestore()
                .collection(FIRESTORE_COLLECTIONS.watchlists)
                .doc(item.id);
            batch.update(docRef, { order: index });
        });

        await batch.commit();
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
    return firestore()
        .collection(FIRESTORE_COLLECTIONS.watchlists)
        .where('userId', '==', userId)
        .orderBy('order', 'asc')
        .onSnapshot(snapshot => {
            const items = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })) as WatchlistItem[];
            callback(items);
        });
};
