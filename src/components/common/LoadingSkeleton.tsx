import React from 'react';
import { View, ActivityIndicator, StyleSheet, useColorScheme } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

export const LoadingSkeleton: React.FC = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = colors[colorScheme];

    return (
        <View style={styles.container}>
            {[1, 2, 3, 4, 5].map(i => (
                <View
                    key={i}
                    style={[styles.skeleton, { backgroundColor: theme.surface }]}>
                    <ActivityIndicator size="small" color={theme.primary} />
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: spacing.md,
    },
    skeleton: {
        height: 80,
        borderRadius: borderRadius.md,
        marginBottom: spacing.sm,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
