import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface EmptyStateProps {
    title: string;
    subtitle: string;
    icon?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
    title,
    subtitle,
}) => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = colors[colorScheme];

    return (
        <View style={styles.container}>
            <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
                {subtitle}
            </Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: spacing.xl,
    },
    title: {
        fontSize: typography.fontSize.xl,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: typography.fontSize.md,
        textAlign: 'center',
        lineHeight: typography.fontSize.md * typography.lineHeight.relaxed,
    },
});
