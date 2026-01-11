import React, { useState } from 'react';
import { View, FlatList, StyleSheet, useColorScheme, ActivityIndicator, Text, SafeAreaView } from 'react-native';
import { NewsCard } from '../../components/news/NewsCard';
import { NewsItem } from '../../types/news';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

// Mock Data for Premium UI Demo
const MOCK_NEWS: NewsItem[] = [
    {
        id: '1',
        title: 'Bitcoin Surges Past $95,000 as Institutional Adpotion Grows',
        summary: 'Leading cryptocurrency Bitcoin has broken another record high today as major banks announce new crypto custodial services.',
        source: 'CoinDesk',
        imageUrl: 'https://images.unsplash.com/photo-1518546305927-5a555bb7020d?q=80&w=2069&auto=format&fit=crop',
        url: 'https://www.coindesk.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 mins ago
        category: 'crypto',
    },
    {
        id: '2',
        title: 'Fed Signals Potential Rate Cuts in Late 2024',
        summary: 'Federal Reserve Chairman hints at easing monetary policy if inflation data continues to show positive trends.',
        source: 'Bloomberg',
        imageUrl: 'https://images.unsplash.com/photo-1611974765270-ca12586343bb?q=80&w=2070&auto=format&fit=crop',
        url: 'https://www.bloomberg.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
        category: 'general',
    },
    {
        id: '3',
        title: 'NVIDIA Reports Record Earnings, AI Chip Demand Skyrockets',
        summary: 'Tech giant NVIDIA surpassed earnings expectations by 20%, driven by unprecedented demand for AI data center chips.',
        source: 'Reuters',
        imageUrl: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1965&auto=format&fit=crop',
        url: 'https://www.reuters.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
        category: 'stock',
    },
    {
        id: '4',
        title: 'Apple Unveils New Vision Pro Mixed Reality Headset Features',
        summary: 'The latest update to visionOS brings spatial personas and improved hand tracking capabilities to the headset.',
        source: 'TechCrunch',
        imageUrl: 'https://images.unsplash.com/photo-1621768216002-5ac171876625?q=80&w=2074&auto=format&fit=crop',
        url: 'https://techcrunch.com',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
        category: 'stock',
    },
    {
        id: '5',
        title: 'Ethereum ETF Approval Likelihood Increase to 75%, Analysts Say',
        summary: 'Bloomberg ETF analysts have raised their odds for spot Ethereum ETF approval following recent SEC engagement.',
        source: 'The Block',
        imageUrl: 'https://images.unsplash.com/photo-1622790693518-ff38018e3e79?q=80&w=2070&auto=format&fit=crop',
        url: 'https://www.theblock.co',
        publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 26).toISOString(), // 1 day ago
        category: 'crypto',
    }
];

export const NewsScreen = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = colors[isDark ? 'dark' : 'light'];

    // Simulate loading for realistic feel
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(MOCK_NEWS);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = () => {
        setIsRefreshing(true);
        // Simulate API delay
        setTimeout(() => {
            setIsRefreshing(false);
        }, 1500);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <NewsCard news={item} />}
                contentContainerStyle={styles.listContent}
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={
                    <View style={styles.header}>
                        <Text style={[styles.headerTitle, { color: theme.text }]}>Market News</Text>
                        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
                            Latest updates from the financial world
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        padding: spacing.md,
    },
    header: {
        marginBottom: spacing.lg,
        marginTop: spacing.sm,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 16,
        marginTop: spacing.xs,
    },
});
