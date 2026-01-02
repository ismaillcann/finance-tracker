import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { Quote } from '../../types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { formatPrice, formatVolume } from '../../utils/formatters';

interface MetricsPanelProps {
    quote: Quote;
}

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ quote }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = colors[colorScheme];

    const metrics = [
        { label: 'Open', value: formatPrice(quote.open) },
        { label: 'High', value: formatPrice(quote.high) },
        { label: 'Low', value: formatPrice(quote.low) },
        { label: 'Close', value: formatPrice(quote.close) },
        { label: 'Volume', value: formatVolume(quote.volume) },
        { label: 'Prev Close', value: formatPrice(quote.previousClose) },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
            <Text style={[styles.title, { color: theme.text }]}>Key Metrics</Text>
            <View style={styles.grid}>
                {metrics.map((metric, index) => (
                    <View key={index} style={styles.metricItem}>
                        <Text style={[styles.label, { color: theme.textSecondary }]}>
                            {metric.label}
                        </Text>
                        <Text style={[styles.value, { color: theme.text }]}>
                            {metric.value}
                        </Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        margin: spacing.md,
        padding: spacing.md,
        borderRadius: borderRadius.md,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.md,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.md,
    },
    metricItem: {
        width: '30%',
    },
    label: {
        fontSize: typography.fontSize.xs,
        marginBottom: spacing.xs / 2,
    },
    value: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.semibold,
    },
});
