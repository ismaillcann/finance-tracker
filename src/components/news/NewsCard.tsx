import React from 'react';
import { View, Text, StyleSheet, Image, Pressable, useColorScheme, Linking } from 'react-native';
import { NewsItem } from '../../types/news';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';

interface NewsCardProps {
    news: NewsItem;
}

export const NewsCard: React.FC<NewsCardProps> = React.memo(({ news }) => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = colors[isDark ? 'dark' : 'light'];

    const handlePress = async () => {
        try {
            await Linking.openURL(news.url);
        } catch (error) {
            console.error('Failed to open URL:', error);
        }
    };

    // Calculate time ago (simple version)
    const getTimeAgo = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    return (
        <Pressable
            style={({ pressed }) => [
                styles.container,
                {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                    opacity: pressed ? 0.9 : 1,
                    transform: [{ scale: pressed ? 0.98 : 1 }]
                }
            ]}
            onPress={handlePress}
        >
            <View style={styles.contentContainer}>
                <View style={styles.textContainer}>
                    <View style={styles.headerRow}>
                        <Text style={[styles.source, { color: theme.chart.line }]}>
                            {news.source} • {getTimeAgo(news.publishedAt)}
                        </Text>
                    </View>
                    <Text
                        style={[styles.title, { color: theme.text }]}
                        numberOfLines={3}
                    >
                        {news.title}
                    </Text>
                    <Text style={[styles.summary, { color: theme.textSecondary }]} numberOfLines={2}>
                        {news.summary}
                    </Text>
                </View>
                {news.imageUrl && (
                    <Image
                        source={{ uri: news.imageUrl }}
                        style={[styles.image, { backgroundColor: theme.border }]}
                    />
                )}
            </View>
        </Pressable>
    );
});

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
        borderRadius: borderRadius.lg,
        borderWidth: 1,
        overflow: 'hidden',
        // Shadow for iOS
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        // Elevation for Android
        elevation: 2,
    },
    contentContainer: {
        flexDirection: 'row',
        padding: spacing.md,
    },
    textContainer: {
        flex: 1,
        marginRight: spacing.md,
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },
    source: {
        fontSize: typography.fontSize.xs,
        fontWeight: typography.fontWeight.bold,
        textTransform: 'uppercase',
    },
    title: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.bold,
        marginBottom: spacing.xs,
        lineHeight: 22,
    },
    summary: {
        fontSize: typography.fontSize.sm,
        lineHeight: 18,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: borderRadius.md,
    },
});
