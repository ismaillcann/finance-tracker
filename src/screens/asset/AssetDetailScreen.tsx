import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    useColorScheme,
    ActivityIndicator,
} from 'react-native';
import { LineChart } from '../../components/charts/LineChart';
import { VolumeChart } from '../../components/charts/VolumeChart';
import { TimeRangeSelector } from '../../components/charts/TimeRangeSelector';
import { MetricsPanel } from '../../components/asset/MetricsPanel';
import { useAssetQuote, useAssetTimeSeries } from '../../hooks/useAssetData';
import { TimeRange } from '../../types';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatPrice, formatPercent } from '../../utils/formatters';

export const AssetDetailScreen = ({ route }: any) => {
    const { asset } = route.params;
    const [timeRange, setTimeRange] = useState<TimeRange>('1M');

    const colorScheme = useColorScheme() ?? 'light';
    const theme = colors[colorScheme];

    const { data: quote, isLoading: quoteLoading } = useAssetQuote(
        asset.symbol,
        asset.type,
        asset.id,
    );

    const { data: timeSeries, isLoading: chartLoading } = useAssetTimeSeries(
        asset.symbol,
        timeRange,
    );

    const isPositive = quote ? quote.changePercent >= 0 : true;
    const changeColor = isPositive ? theme.success : theme.error;

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={styles.header}>
                <Text style={[styles.symbol, { color: theme.text }]}>
                    {asset.symbol}
                </Text>
                <Text style={[styles.name, { color: theme.textSecondary }]}>
                    {asset.name}
                </Text>

                {quoteLoading ? (
                    <ActivityIndicator size="small" color={theme.primary} />
                ) : quote ? (
                    <>
                        <Text style={[styles.price, { color: theme.text }]}>
                            {formatPrice(quote.price)}
                        </Text>
                        <Text style={[styles.change, { color: changeColor }]}>
                            {formatPercent(quote.changePercent)} ({formatPrice(quote.change)})
                        </Text>
                    </>
                ) : (
                    <Text style={[styles.error, { color: theme.error }]}>
                        Failed to load price
                    </Text>
                )}
            </View>

            <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />

            {chartLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
                        Loading chart data...
                    </Text>
                </View>
            ) : timeSeries && timeSeries.data.length > 0 ? (
                <>
                    <View style={styles.chartSection}>
                        <Text style={[styles.chartTitle, { color: theme.text }]}>
                            Price Chart
                        </Text>
                        <LineChart data={timeSeries.data} />
                    </View>

                    <View style={styles.chartSection}>
                        <Text style={[styles.chartTitle, { color: theme.text }]}>
                            Volume
                        </Text>
                        <VolumeChart data={timeSeries.data} />
                    </View>
                </>
            ) : (
                <View style={styles.errorContainer}>
                    <Text style={[styles.errorText, { color: theme.error }]}>
                        Chart data not available for this time range
                    </Text>
                </View>
            )}

            {quote && <MetricsPanel quote={quote} />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: spacing.lg,
        alignItems: 'center',
    },
    symbol: {
        fontSize: typography.fontSize.xxxl,
        fontWeight: typography.fontWeight.bold,
    },
    name: {
        fontSize: typography.fontSize.md,
        marginTop: spacing.xs,
        marginBottom: spacing.lg,
    },
    price: {
        fontSize: typography.fontSize.xxl,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.xs,
    },
    change: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.medium,
    },
    error: {
        fontSize: typography.fontSize.md,
    },
    chartSection: {
        marginTop: spacing.lg,
    },
    chartTitle: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.semibold,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },
    loadingContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    loadingText: {
        marginTop: spacing.md,
        fontSize: typography.fontSize.md,
    },
    errorContainer: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    errorText: {
        fontSize: typography.fontSize.md,
        textAlign: 'center',
    },
});
