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

interface MetricCardProps {
    label: string;
    value: string;
    icon?: string;
    isPositive?: boolean;
    showColor?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, isPositive, showColor }) => {
    const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
    const theme = colors[colorScheme];

    const valueColor = showColor
        ? isPositive
            ? theme.success
            : theme.error
        : theme.text;

    return (
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
            <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
        </View>
    );
};

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ quote }) => {
    const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
    const theme = colors[colorScheme];

    const isPositiveDay = quote.close >= quote.open;
    const isPositiveChange = quote.changePercent >= 0;

    return (
        <View style={styles.container}>
            <View style={[styles.titleContainer, { borderBottomColor: theme.border }]}>
                <Text style={[styles.title, { color: theme.text }]}>KEY METRICS</Text>
                <View style={[styles.titleDivider, { backgroundColor: theme.primary }]} />
            </View>

            <View style={styles.row}>
                <MetricCard
                    label="Open"
                    value={formatPrice(quote.open)}
                />
                <MetricCard
                    label="High"
                    value={formatPrice(quote.high)}
                    isPositive={true}
                    showColor={true}
                />
            </View>

            <View style={styles.row}>
                <MetricCard
                    label="Low"
                    value={formatPrice(quote.low)}
                    isPositive={false}
                    showColor={true}
                />
                <MetricCard
                    label="Close"
                    value={formatPrice(quote.close)}
                    isPositive={isPositiveDay}
                    showColor={true}
                />
            </View>

            <View style={styles.row}>
                <MetricCard
                    label="Volume"
                    value={formatVolume(quote.volume)}
                />
                <MetricCard
                    label="Prev Close"
                    value={formatPrice(quote.previousClose)}
                />
            </View>

            <View style={styles.fullWidthCard}>
                <MetricCard
                    label="24h Change"
                    value={`${formatPrice(quote.change)} (${quote.changePercent >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%)`}
                    isPositive={isPositiveChange}
                    showColor={true}
                />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
    },
    titleContainer: {
        paddingBottom: spacing.sm,
        marginBottom: spacing.md,
        borderBottomWidth: 1,
    },
    titleDivider: {
        position: 'absolute',
        bottom: -1,
        left: 0,
        width: 80,
        height: 3,
        borderRadius: 2,
    },
    title: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    row: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    card: {
        flex: 1,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    icon: {
        fontSize: 16,
        marginRight: spacing.xs,
    },
    label: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.medium,
    },
    value: {
        fontSize: typography.fontSize.lg,
        fontWeight: typography.fontWeight.bold,
    },
    fullWidthCard: {
        marginTop: spacing.xs,
    },
});
