import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    useColorScheme,
    TouchableOpacity,
    Alert,
    SectionList,
} from 'react-native';
import { Input } from '../../components/common/Input';
import { AssetCard } from '../../components/watchlist/AssetCard';
import { EmptyState } from '../../components/common/EmptyState';
import { useAssetSearch } from '../../hooks/useAssetData';
import { addToWatchlist } from '../../services/firebase/firestore';
import { getCurrentUser } from '../../services/firebase/auth';
import { getPopularAssets } from '../../constants/popularAssets';
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

    const popularAssets = getPopularAssets(selectedType);

    const handleAddToWatchlist = async (asset: Asset) => {
        if (!user) {
            Alert.alert(
                'Authentication Required',
                'Please log in to add assets to your watchlist',
            );
            return;
        }

        try {
            const result = await addToWatchlist(user.id, asset);
            if (result) {
                Alert.alert(
                    'Success',
                    `${asset.symbol} has been added to your watchlist`,
                    [
                        {
                            text: 'Add More',
                            style: 'cancel',
                        },
                        {
                            text: 'View Watchlist',
                            onPress: () => navigation.goBack(),
                        },
                    ],
                );
            } else {
                Alert.alert(
                    'Error',
                    'Failed to add asset. It may already be in your watchlist.',
                );
            }
        } catch (error) {
            Alert.alert(
                'Error',
                'An unexpected error occurred. Please try again.',
            );
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

    const sections = [
        {
            title: 'Popular Assets',
            data: query.length < 2 ? popularAssets : [],
        },
        {
            title: 'Search Results',
            data: query.length >= 2 ? searchResults : [],
        },
    ];

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

            <SectionList
                sections={sections}
                keyExtractor={item => item.id}
                renderItem={({ item }) => (
                    <AssetCard asset={item} onPress={() => handleAddToWatchlist(item)} />
                )}
                renderSectionHeader={({ section: { title, data } }) =>
                    data.length > 0 ? (
                        <View style={[styles.sectionHeader, { backgroundColor: theme.background }]}>
                            <Text style={[styles.sectionTitle, { color: theme.text }]}>
                                {title}
                            </Text>
                        </View>
                    ) : null
                }
                contentContainerStyle={styles.listContent}
                ListEmptyComponent={
                    <EmptyState
                        title={query.length < 2 ? 'Start Searching' : 'No Results'}
                        subtitle={
                            query.length < 2
                                ? 'Enter at least 2 characters or select from popular assets below'
                                : `No assets found for "${query}"`
                        }
                    />
                }
            />
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
    sectionHeader: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
    },
    sectionTitle: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
    },
    listContent: {
        padding: spacing.md,
        paddingTop: 0,
    },
});
