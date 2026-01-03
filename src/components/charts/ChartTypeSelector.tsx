import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export type ChartType = 'line' | 'area' | 'candle';

interface ChartTypeSelectorProps {
    selected: ChartType;
    onSelect: (type: ChartType) => void;
}

export const ChartTypeSelector: React.FC<ChartTypeSelectorProps> = ({
    selected,
    onSelect,
}) => {
    const colorScheme: 'light' | 'dark' = useColorScheme() === 'dark' ? 'dark' : 'light';
    const theme = colors[colorScheme];

    const chartTypes: { value: ChartType; label: string }[] = [
        { value: 'line', label: 'Line' },
        { value: 'area', label: 'Area' },
        { value: 'candle', label: 'Candle' },
    ];

    return (
        <View style={[styles.container, { backgroundColor: theme.surface }]}>
            {chartTypes.map(type => {
                const isSelected = selected === type.value;
                return (
                    <TouchableOpacity
                        key={type.value}
                        style={[
                            styles.button,
                            {
                                backgroundColor: isSelected ? theme.primary : 'transparent',
                                borderColor: isSelected ? theme.primary : theme.border,
                            },
                        ]}
                        onPress={() => onSelect(type.value)}
                        activeOpacity={0.7}>
                        <Text
                            style={[
                                styles.label,
                                {
                                    color: isSelected ? '#fff' : theme.textSecondary,
                                    fontWeight: isSelected
                                        ? typography.fontWeight.bold
                                        : typography.fontWeight.medium,
                                },
                            ]}>
                            {type.label}
                        </Text>
                    </TouchableOpacity>
                );
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginHorizontal: spacing.md,
        marginVertical: spacing.sm,
        padding: spacing.xs,
        borderRadius: borderRadius.lg,
        gap: spacing.xs,
    },
    button: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.xs,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        gap: spacing.xs,
    },
    icon: {
        fontSize: 16,
    },
    label: {
        fontSize: typography.fontSize.sm,
    },
});
