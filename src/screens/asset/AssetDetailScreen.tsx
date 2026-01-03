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
import { AreaChart } from '../../components/charts/AreaChart';
import { CandlestickChart } from '../../components/charts/CandlestickChart';
import { VolumeChart } from '../../components/charts/VolumeChart';
import { TimeRangeSelector } from '../../components/charts/TimeRangeSelector';
import { ChartTypeSelector, ChartType } from '../../components/charts/ChartTypeSelector';
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
    const [chartType, setChartType] = useState<ChartType>('line');

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

    const renderChart = () => {
        if (!timeSeries || timeSeries.data.length === 0) return null;

        switch (chartType) {
            case 'area':
                return <AreaChart data={timeSeries.data} />;
            case 'candle':
                return <CandlestickChart data={timeSeries.data} />;
            case 'line':
            default:
                return <LineChart data={timeSeries.data} />;
        }
    };

    return (
        <ScrollView
            style={[styles.container, { backgroundColor: theme.background }]}>
            {/* Enhanced Header with Gradient Background */}
            <View style={[styles.header, { backgroundColor: theme.surface }]}>
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
                        <View style={[styles.changeBadge, { backgroundColor: changeColor + '20' }]}>
                            <Text style={[styles.change, { color: changeColor }]}>
                                {isPositive ? '▲' : '▼'} {formatPercent(quote.changePercent)} ({formatPrice(Math.abs(quote.change))})
                            </Text>
                        </View>
                    </>
                ) : (
                    <Text style={[styles.error, { color: theme.error }]}>
                        Failed to load price
                    </Text>
                )}
            </View>

            {/* Chart Controls */}
            <TimeRangeSelector selected={timeRange} onSelect={setTimeRange} />
            <ChartTypeSelector selected={chartType} onSelect={setChartType} />

            {/* Charts Section */}
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
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionIcon]}>📈</Text>
                            <Text style={[styles.chartTitle, { color: theme.text }]}>
                                Price Chart
                            </Text>
                        </View>
                        {renderChart()}
                    </View>

                    <View style={styles.chartSection}>
                        <View style={styles.sectionHeader}>
                            <Text style={[styles.sectionIcon]}>📊</Text>
                            <Text style={[styles.chartTitle, { color: theme.text }]}>
                                Volume
                            </Text>
                        </View>
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

            {/* Metrics Panel */}
            {quote && <MetricsPanel quote={quote} />}
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: spacing.xl,
        alignItems: 'center',
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
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
        fontSize: 36,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.sm,
    },
    changeBadge: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: 20,
    },
    change: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.bold,
    },
    error: {
        fontSize: typography.fontSize.md,
    },
    chartSection: {
        marginTop: spacing.lg,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },
    sectionIcon: {
        fontSize: 20,
        marginRight: spacing.xs,
    },
    chartTitle: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
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
