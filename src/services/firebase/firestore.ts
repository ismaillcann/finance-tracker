import {
    collection,
    query,
    where,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    onSnapshot,
    orderBy,
    limit,
    serverTimestamp,
    updateDoc,
    writeBatch
} from 'firebase/firestore';
import { db } from './config';
import { WatchlistItem, Asset } from '../../types';
import { FIRESTORE_COLLECTIONS } from '../../config/constants';

const WATCHLIST_COLLECTION = FIRESTORE_COLLECTIONS.watchlists;

// Helper to map Firestore doc to WatchlistItem
const mapDocToWatchlistItem = (doc: any): WatchlistItem => {
    const data = doc.data();
    return {
        id: doc.id,
        userId: data.userId,
        asset: data.asset,
        addedAt: data.addedAt?.toMillis() || Date.now(),
        order: data.order || 0,
    };
};

export const getUserWatchlist = async (userId: string): Promise<WatchlistItem[]> => {
    try {
        const q = query(
            collection(db, WATCHLIST_COLLECTION),
            where('userId', '==', userId),
            orderBy('order', 'asc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(mapDocToWatchlistItem);
    } catch (error) {
        console.error('Error getting watchlist:', error);
        throw error;
    }
};

export const addToWatchlist = async (userId: string, asset: Asset): Promise<WatchlistItem | null> => {
    try {
        // Check if already exists
        const q = query(
            collection(db, WATCHLIST_COLLECTION),
            where('userId', '==', userId),
            where('asset.id', '==', asset.id),
            limit(1)
        );
        const existingDocs = await getDocs(q);

        if (!existingDocs.empty) {
            console.warn('Asset already in watchlist');
            return null;
        }

        // Get current max order to append to end
        const orderQ = query(
            collection(db, WATCHLIST_COLLECTION),
            where('userId', '==', userId),
            orderBy('order', 'desc'),
            limit(1)
        );
        const orderDocs = await getDocs(orderQ);
        const maxOrder = orderDocs.empty ? -1 : orderDocs.docs[0].data().order;

        const newItem = {
            userId,
            asset,
            addedAt: serverTimestamp(),
            order: maxOrder + 1,
        };

        const docRef = await addDoc(collection(db, WATCHLIST_COLLECTION), newItem);

        // Return constructed item (using Date.now() for immediate UI update before server sync)
        return {
            id: docRef.id,
            userId,
            asset,
            addedAt: Date.now(),
            order: newItem.order,
        };
    } catch (error) {
        console.error('Error adding document:', error);
        return null;
    }
};

export const removeFromWatchlist = async (watchlistItemId: string): Promise<boolean> => {
    try {
        await deleteDoc(doc(db, WATCHLIST_COLLECTION, watchlistItemId));
        return true;
    } catch (error) {
        console.error('Error removing document:', error);
        return false;
    }
};

export const updateWatchlistOrder = async (userId: string, items: WatchlistItem[]): Promise<boolean> => {
    try {
        const batch = writeBatch(db);

        items.forEach((item, index) => {
            const docRef = doc(db, WATCHLIST_COLLECTION, item.id);
            batch.update(docRef, { order: index });
        });

        await batch.commit();
        return true;
    } catch (error) {
        console.error('Error updating order:', error);
        return false;
    }
};

export const watchWatchlist = (
    userId: string,
    callback: (items: WatchlistItem[]) => void
): (() => void) => {
    const q = query(
        collection(db, WATCHLIST_COLLECTION),
        where('userId', '==', userId),
        orderBy('order', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
        const items = querySnapshot.docs.map(mapDocToWatchlistItem);
        callback(items);
    }, (error) => {
        console.error('Error watching watchlist:', error);
    });
};
