import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, useColorScheme } from 'react-native';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

interface LoadingSkeletonProps {
    width?: number | string;
    height?: number;
    borderRadius?: number;
    style?: any;
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
    width = '100%',
    height = 20,
    borderRadius: customBorderRadius = borderRadius.sm,
    style,
}) => {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];
    const shimmerAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const shimmer = Animated.loop(
            Animated.sequence([
                Animated.timing(shimmerAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(shimmerAnim, {
                    toValue: 0,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ]),
        );
        shimmer.start();
        return () => shimmer.stop();
    }, [shimmerAnim]);

    const opacity = shimmerAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.3, 0.7],
    });

    return (
        <Animated.View
            style={[
                styles.skeleton,
                {
                    width,
                    height,
                    borderRadius: customBorderRadius,
                    backgroundColor: theme.border,
                    opacity,
                },
                style,
            ]}
        />
    );
};

export const AssetCardSkeleton: React.FC = () => {
    const colorScheme = useColorScheme();
    const theme = colors[colorScheme === 'dark' ? 'dark' : 'light'];

    return (
        <View style={[styles.cardContainer, { backgroundColor: theme.surface }]}>
            <View style={styles.cardContent}>
                <View style={styles.leftSection}>
                    <LoadingSkeleton width={80} height={20} style={{ marginBottom: 6 }} />
                    <LoadingSkeleton width={120} height={14} style={{ marginBottom: 4 }} />
                    <LoadingSkeleton width={60} height={12} />
                </View>
                <View style={styles.rightSection}>
                    <LoadingSkeleton width={90} height={20} style={{ marginBottom: 8 }} />
                    <LoadingSkeleton width={70} height={24} borderRadius={borderRadius.md} />
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    skeleton: {},
    cardContainer: {
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
    },
    cardContent: {
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
});
