import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    useColorScheme,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Input } from '../../components/common/Input';
import { AssetCard } from '../../components/watchlist/AssetCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useAssetSearch } from '../../hooks/useAssetData';
import { addToWatchlist } from '../../services/firebase/firestore';
import { getCurrentUser } from '../../services/firebase/auth';
import { Asset } from '../../types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const SearchScreen = ({ navigation }: any) => {
    const [query, setQuery] = useState('');
    const [selectedType, setSelectedType] = useState<'all' | 'stock' | 'crypto'>(
        'all',
    );

    const colorScheme = useColorScheme() ?? 'light';
    const theme = colors[colorScheme];

    const { data: searchResults = [], isLoading } = useAssetSearch(
        query,
        selectedType,
    );

    const user = getCurrentUser();

    const handleAddToWatchlist = async (asset: Asset) => {
        if (!user) {
            Alert.alert('Error', 'You must be logged in to add assets');
            return;
        }

        const result = await addToWatchlist(user.id, asset);
        if (result) {
            Alert.alert('Success', `${asset.symbol} added to watchlist`);
            navigation.goBack();
        } else {
            Alert.alert('Error', 'Failed to add asset to watchlist');
        }
    };

    const renderTypeFilter = () => (
        <View style={styles.filterContainer}>
            {(['all', 'stock', 'crypto'] as const).map(type => (
                <TouchableOpacity
                    key={type}
                    style={[
                        styles.filterButton,
                        {
                            backgroundColor:
                                selectedType === type ? theme.primary : theme.surface,
                        },
                    ]}
                    onPress={() => setSelectedType(type)}>
                    <Text
                        style={[
                            styles.filterText,
                            {
                                color: selectedType === type ? '#ffffff' : theme.text,
                            },
                        ]}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.searchSection}>
                <Input
                    placeholder="Search stocks, crypto..."
                    value={query}
                    onChangeText={setQuery}
                    autoCapitalize="characters"
                    autoCorrect={false}
                />
                {renderTypeFilter()}
            </View>

            {query.length < 2 ? (
                <EmptyState
                    title="Start Searching"
                    subtitle="Enter at least 2 characters to search for assets"
                />
            ) : isLoading ? (
                <View style={styles.loadingContainer}>
                    <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                        Searching...
                    </Text>
                </View>
            ) : searchResults.length === 0 ? (
                <EmptyState
                    title="No Results"
                    subtitle={`No assets found for "${query}"`}
                />
            ) : (
                <FlatList
                    data={searchResults}
                    keyExtractor={item => item.id}
                    renderItem={({ item }) => (
                        <AssetCard
                            asset={item}
                            onPress={() => handleAddToWatchlist(item)}
                        />
                    )}
                    contentContainerStyle={styles.listContent}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    searchSection: {
        padding: spacing.md,
    },
    filterContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginTop: spacing.sm,
    },
    filterButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        borderRadius: 8,
        alignItems: 'center',
    },
    filterText: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
    },
    listContent: {
        padding: spacing.md,
        paddingTop: 0,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: typography.fontSize.md,
    },
});
