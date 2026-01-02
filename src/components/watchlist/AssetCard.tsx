import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    useColorScheme,
} from 'react-native';
import { Asset, PriceData } from '../../types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatPrice, formatPercent } from '../../utils/formatters';

interface AssetCardProps {
    asset: Asset;
    priceData?: PriceData;
    onPress?: () => void;
    onRemove?: () => void;
}

export const AssetCard: React.FC<AssetCardProps> = ({
    asset,
    priceData,
    onPress,
    onRemove,
}) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = colors[colorScheme];

    const isPositive = priceData ? priceData.changePercent >= 0 : true;
    const changeColor = isPositive ? theme.success : theme.error;

    return (
        <TouchableOpacity
            style={[styles.container, { backgroundColor: theme.surface }]}
            onPress={onPress}
            activeOpacity={0.7}>
            <View style={styles.content}>
                <View style={styles.leftSection}>
                    <Text style={[styles.symbol, { color: theme.text }]}>
                        {asset.symbol}
                    </Text>
                    <Text style={[styles.name, { color: theme.textSecondary }]}>
                        {asset.name}
                    </Text>
                    {asset.exchange && (
                        <Text style={[styles.exchange, { color: theme.textSecondary }]}>
                            {asset.exchange}
                        </Text>
                    )}
                </View>

                <View style={styles.rightSection}>
                    {priceData ? (
                        <>
                            <Text style={[styles.price, { color: theme.text }]}>
                                {formatPrice(priceData.price)}
                            </Text>
                            <View style={[styles.changeContainer, { backgroundColor: changeColor + '20' }]}>
                                <Text style={[styles.change, { color: changeColor }]}>
                                    {formatPercent(priceData.changePercent)}
                                </Text>
                            </View>
                        </>
                    ) : (
                        <Text style={[styles.loading, { color: theme.textSecondary }]}>
                            Loading...
                        </Text>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    leftSection: {
        flex: 1,
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    symbol: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.xs / 2,
    },
    name: {
        fontSize: typography.fontSize.sm,
        marginBottom: spacing.xs / 2,
    },
    exchange: {
        fontSize: typography.fontSize.xs,
    },
    price: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        marginBottom: spacing.xs,
    },
    changeContainer: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs / 2,
        borderRadius: borderRadius.sm,
    },
    change: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
    },
    loading: {
        fontSize: typography.fontSize.sm,
    },
});
