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
    icon: string;
    isPositive?: boolean;
    showColor?: boolean;
}

const MetricCard: React.FC<MetricCardProps> = ({ label, value, icon, isPositive, showColor }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = colors[colorScheme];

    const valueColor = showColor
        ? isPositive
            ? theme.success
            : theme.error
        : theme.text;

    return (
        <View style={[styles.card, { backgroundColor: theme.surface }]}>
            <View style={styles.cardHeader}>
                <Text style={styles.icon}>{icon}</Text>
                <Text style={[styles.label, { color: theme.textSecondary }]}>{label}</Text>
            </View>
            <Text style={[styles.value, { color: valueColor }]}>{value}</Text>
        </View>
    );
};

export const MetricsPanel: React.FC<MetricsPanelProps> = ({ quote }) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = colors[colorScheme];

    const isPositiveDay = quote.close >= quote.open;
    const isPositiveChange = quote.changePercent >= 0;

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.text }]}>📊 Key Metrics</Text>

            <View style={styles.row}>
                <MetricCard
                    label="Open"
                    value={formatPrice(quote.open)}
                    icon="🔓"
                />
                <MetricCard
                    label="High"
                    value={formatPrice(quote.high)}
                    icon="📈"
                    isPositive={true}
                    showColor={true}
                />
            </View>

            <View style={styles.row}>
                <MetricCard
                    label="Low"
                    value={formatPrice(quote.low)}
                    icon="📉"
                    isPositive={false}
                    showColor={true}
                />
                <MetricCard
                    label="Close"
                    value={formatPrice(quote.close)}
                    icon="🔒"
                    isPositive={isPositiveDay}
                    showColor={true}
                />
            </View>

            <View style={styles.row}>
                <MetricCard
                    label="Volume"
                    value={formatVolume(quote.volume)}
                    icon="📊"
                />
                <MetricCard
                    label="Prev Close"
                    value={formatPrice(quote.previousClose)}
                    icon="⏮️"
                />
            </View>

            <View style={styles.fullWidthCard}>
                <MetricCard
                    label="24h Change"
                    value={`${formatPrice(quote.change)} (${quote.changePercent >= 0 ? '+' : ''}${quote.changePercent.toFixed(2)}%)`}
                    icon={isPositiveChange ? '🚀' : '📉'}
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
    title: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.md,
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
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
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
