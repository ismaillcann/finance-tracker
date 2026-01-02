import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    useColorScheme,
    RefreshControl,
    TouchableOpacity,
} from 'react-native';
import { AssetCard } from '../../components/watchlist/AssetCard';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { getUserWatchlist, watchWatchlist } from '../../services/firebase/firestore';
import { getCurrentUser, signOut } from '../../services/firebase/auth';
import { useAssetQuote } from '../../hooks/useAssetData';
import { WatchlistItem } from '../../types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

const WatchlistItemWithPrice: React.FC<{
    item: WatchlistItem;
    onPress: () => void;
}> = ({ item, onPress }) => {
    const { data: priceData } = useAssetQuote(
        item.asset.symbol,
        item.asset.type,
        item.asset.id,
    );

    return (
        <AssetCard
            asset={item.asset}
            priceData={priceData || undefined}
            onPress={onPress}
        />
    );
};

export const WatchlistScreen = ({ navigation }: any) => {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const colorScheme = useColorScheme() ?? 'light';
    const theme = colors[colorScheme];

    const user = getCurrentUser();

    useEffect(() => {
        if (!user) return;

        const unsubscribe = watchWatchlist(user.id, items => {
            setWatchlist(items);
            setLoading(false);
            setRefreshing(false);
        });

        return unsubscribe;
    }, [user]);

    const handleRefresh = async () => {
        setRefreshing(true);
        if (user) {
            const items = await getUserWatchlist(user.id);
            setWatchlist(items);
        }
        setRefreshing(false);
    };

    const handleSignOut = async () => {
        await signOut();
    };

    const handleAssetPress = (item: WatchlistItem) => {
        // Navigate to asset detail screen (to be implemented)
        console.log('Asset pressed:', item.asset.symbol);
    };

    if (loading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <LoadingSkeleton />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <View>
                    <Text style={[styles.greeting, { color: theme.text }]}>
                        Welcome back!
                    </Text>
                    {user && (
                        <Text style={[styles.email, { color: theme.textSecondary }]}>
                            {user.email}
                        </Text>
                    )}
                </View>
                <TouchableOpacity onPress={handleSignOut}>
                    <Text style={[styles.signOutButton, { color: theme.error }]}>
                        Sign Out
                    </Text>
                </TouchableOpacity>
            </View>

            {watchlist.length === 0 ? (
                <EmptyState
                    title="No Assets in Watchlist"
                    subtitle="Add your first asset to start tracking prices"
                />
            ) : (
                <FlatList
                    data={watchlist}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <WatchlistItemWithPrice
                            item={item}
                            onPress={() => handleAssetPress(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={handleRefresh}
                            tintColor={theme.primary}
                        />
                    }
                />
            )}

            <View style={styles.footer}>
                <Button
                    title="Add Asset"
                    onPress={() => navigation.navigate('Search')}
                    style={styles.addButton}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: spacing.md,
        paddingTop: spacing.lg,
    },
    greeting: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
    },
    email: {
        fontSize: typography.fontSize.sm,
        marginTop: spacing.xs / 2,
    },
    signOutButton: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
    },
    listContent: {
        padding: spacing.md,
    },
    footer: {
        padding: spacing.md,
    },
    addButton: {
        width: '100%',
    },
});
