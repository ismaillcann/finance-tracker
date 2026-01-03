import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, useColorScheme } from 'react-native';
import { TimeRange } from '../../types';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface TimeRangeSelectorProps {
    selected: TimeRange;
    onSelect: (range: TimeRange) => void;
}

const TIME_RANGES: TimeRange[] = ['1D', '1W', '1M', '3M', '1Y', 'ALL'];

export const TimeRangeSelector: React.FC<TimeRangeSelectorProps> = ({
    selected,
    onSelect,
}) => {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];

    return (
        <View style={styles.container}>
            {TIME_RANGES.map(range => (
                <TouchableOpacity
                    key={range}
                    style={[
                        styles.button,
                        {
                            backgroundColor:
                                selected === range ? theme.primary : theme.surface,
                            borderColor: theme.border,
                        },
                    ]}
                    onPress={() => onSelect(range)}>
                    <Text
                        style={[
                            styles.buttonText,
                            {
                                color: selected === range ? '#ffffff' : theme.text,
                                fontWeight:
                                    selected === range
                                        ? typography.fontWeight.semibold
                                        : typography.fontWeight.regular,
                            },
                        ]}>
                        {range}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        gap: spacing.xs,
    },
    button: {
        flex: 1,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.sm,
        alignItems: 'center',
        borderWidth: 1,
    },
    buttonText: {
        fontSize: typography.fontSize.sm,
    },
});
