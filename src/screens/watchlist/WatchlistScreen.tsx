import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    useColorScheme,
    RefreshControl,
    TouchableOpacity,
    Alert,
    Modal,
} from 'react-native';
import { AssetCard } from '../../components/watchlist/AssetCard';
import { EmptyState } from '../../components/common/EmptyState';
import { LoadingSkeleton } from '../../components/common/LoadingSkeleton';
import { Button } from '../../components/common/Button';
import { getUserWatchlist, watchWatchlist, removeFromWatchlist } from '../../services/firebase/firestore';
import { getCurrentUser, signOut } from '../../services/firebase/auth';
import { useAssetQuote } from '../../hooks/useAssetData';
import { WatchlistItem } from '../../types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { borderRadius } from '../../theme/spacing';

const WatchlistItemWithPrice: React.FC<{
    item: WatchlistItem;
    onPress: () => void;
    onRemove: () => void;
}> = React.memo(({ item, onPress, onRemove }) => {
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
            onRemove={onRemove}
            showDelete={true}
        />
    );
});

export const WatchlistScreen = ({ navigation }: any) => {
    const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showSignOutModal, setShowSignOutModal] = useState(false);

    const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
    const theme = colors[colorScheme];

    const user = getCurrentUser();

    useEffect(() => {
        if (!user?.id) {
            setWatchlist([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        const unsubscribe = watchWatchlist(user.id, items => {
            setWatchlist(items);
            setLoading(false);
            setRefreshing(false);
        });

        return () => {
            unsubscribe();
        };
    }, [user?.id]);

    const handleRefresh = async () => {
        setRefreshing(true);
        if (user) {
            const items = await getUserWatchlist(user.id);
            setWatchlist(items);
        }
        setRefreshing(false);
    };

    const handleSignOutPress = () => {
        setShowSignOutModal(true);
    };

    const handleConfirmSignOut = async () => {
        setShowSignOutModal(false);
        await signOut();
    };

    const handleCancelSignOut = () => {
        setShowSignOutModal(false);
    };

    const handleAssetPress = (item: WatchlistItem) => {
        navigation.navigate('AssetDetail', { asset: item.asset });
    };

    const handleAddAsset = () => {
        navigation.navigate('Search');
    };

    const handleRemoveAsset = async (item: WatchlistItem) => {
        try {
            const success = await removeFromWatchlist(item.id);
            if (!success) {
                Alert.alert(
                    'Error',
                    'Failed to remove asset from watchlist. Please try again.',
                );
            }
        } catch (error) {
            Alert.alert(
                'Error',
                'An unexpected error occurred while removing the asset.',
            );
        }
    };

    // Get user initials for avatar
    const getUserInitials = () => {
        if (!user?.email) return '?';
        return user.email.charAt(0).toUpperCase();
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
            {/* Professional Header */}
            <View style={[styles.headerContainer, { backgroundColor: theme.surface, borderBottomColor: theme.border }]}>
                <View style={styles.headerTop}>
                    <View style={styles.userSection}>
                        <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
                            <Text style={styles.avatarText}>{getUserInitials()}</Text>
                        </View>
                        <View style={styles.userDetails}>
                            <Text style={[styles.userName, { color: theme.text }]}>
                                {user?.email?.split('@')[0] || 'User'}
                            </Text>
                            <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
                                {user?.email}
                            </Text>
                        </View>
                    </View>

                    <TouchableOpacity
                        onPress={handleSignOutPress}
                        style={[styles.signOutButton, { borderColor: theme.border }]}
                        activeOpacity={0.7}>
                        <Text style={[styles.signOutText, { color: theme.textSecondary }]}>Sign Out</Text>
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={[styles.statCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Assets</Text>
                        <Text style={[styles.statValue, { color: theme.text }]}>{watchlist.length}</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: theme.background, borderColor: theme.border }]}>
                        <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Status</Text>
                        <Text style={[styles.statValue, { color: theme.success }]}>Active</Text>
                    </View>
                </View>
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
                            onRemove={() => handleRemoveAsset(item)}
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

            {/* Floating Action Button */}
            <TouchableOpacity
                style={[styles.fab, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                onPress={handleAddAsset}
                activeOpacity={0.8}>
                <Text style={styles.fabIcon}>+</Text>
            </TouchableOpacity>

            {/* Sign Out Confirmation Modal */}
            <Modal
                visible={showSignOutModal}
                transparent={true}
                animationType="fade"
                onRequestClose={handleCancelSignOut}>
                <View style={styles.modalOverlay}>
                    <View style={[styles.modalContent, { backgroundColor: theme.surface }]}>
                        <Text style={[styles.modalTitle, { color: theme.text }]}>
                            Sign Out
                        </Text>
                        <Text style={[styles.modalMessage, { color: theme.textSecondary }]}>
                            Are you sure you want to sign out?
                        </Text>
                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.cancelButton, { backgroundColor: theme.border }]}
                                onPress={handleCancelSignOut}
                                activeOpacity={0.7}>
                                <Text style={[styles.modalButtonText, { color: theme.text }]}>
                                    Cancel
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.confirmButton, { backgroundColor: theme.error, marginLeft: spacing.sm }]}
                                onPress={handleConfirmSignOut}
                                activeOpacity={0.7}>
                                <Text style={[styles.modalButtonText, { color: '#fff' }]}>
                                    Sign Out
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        paddingTop: spacing.xl + 10,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        marginBottom: spacing.md,
    },
    userSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    avatar: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: spacing.sm,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: typography.fontWeight.bold,
        color: '#fff',
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        marginBottom: 2,
        textTransform: 'capitalize',
    },
    userEmail: {
        fontSize: typography.fontSize.xs,
    },
    signOutButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        borderWidth: 1,
    },
    signOutText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
    },
    statsContainer: {
        flexDirection: 'row',
        paddingHorizontal: spacing.md,
        marginLeft: -spacing.xs / 2,
    },
    statCard: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        marginLeft: spacing.xs / 2,
        marginRight: spacing.xs / 2,
    },
    statLabel: {
        fontSize: typography.fontSize.xs,
        marginBottom: 4,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    statValue: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
    },
    listContent: {
        padding: spacing.md,
    },
    footer: {
        padding: spacing.md,
    },
    fab: {
        position: 'absolute',
        bottom: spacing.lg,
        right: spacing.lg,
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    fabIcon: {
        fontSize: 32,
        color: '#fff',
        fontWeight: '300',
        marginTop: -2,
    },
    // Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.md,
    },
    modalContent: {
        width: '100%',
        maxWidth: 400,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 10,
    },
    modalTitle: {
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    modalMessage: {
        fontSize: typography.fontSize.md,
        textAlign: 'center',
        marginBottom: spacing.lg,
        lineHeight: 22,
    },
    modalButtons: {
        flexDirection: 'row',
    },
    modalButton: {
        flex: 1,
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    cancelButton: {
        // backgroundColor set dynamically
    },
    confirmButton: {
        // backgroundColor set dynamically
    },
    modalButtonText: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
    },
});
