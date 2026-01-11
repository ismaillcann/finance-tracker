import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    useWindowDimensions,
    TouchableOpacity,
    SafeAreaView,
    useColorScheme
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';

const ONBOARDING_KEY = '@onboarding_complete';

interface OnboardingSlide {
    id: string;
    title: string;
    description: string;
    icon: string;
}

const SLIDES: OnboardingSlide[] = [
    {
        id: '1',
        title: 'Track Your Assets',
        description: 'Monitor your stock and crypto investments in real-time with live price updates.',
        icon: 'trending-up',
    },
    {
        id: '2',
        title: 'Stay Informed',
        description: 'Get the latest breaking financial news affecting the markets directly in your feed.',
        icon: 'newspaper',
    },
    {
        id: '3',
        title: 'Premium Insights',
        description: 'Visualise trends with advanced interactive charts and analytics.',
        icon: 'analytics', // or 'pie-chart'
    }
];

interface OnboardingScreenProps {
    onFinish: () => void;
}

export const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
    const { width } = useWindowDimensions();
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = colors[isDark ? 'dark' : 'light'];

    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    const handleNext = async () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            await completeOnboarding();
        }
    };

    const completeOnboarding = async () => {
        try {
            await AsyncStorage.setItem(ONBOARDING_KEY, 'true');
            onFinish();
        } catch (error) {
            console.error('Failed to save onboarding status', error);
            onFinish(); // Proceed anyway
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
            <View style={{ flex: 3 }}>
                <FlatList
                    ref={flatListRef}
                    data={SLIDES}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    onMomentumScrollEnd={(event) => {
                        const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
                        setCurrentIndex(newIndex);
                    }}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={[styles.slide, { width, backgroundColor: theme.background }]}>
                            <View style={styles.iconContainer}>
                                <Ionicons name={item.icon} size={100} color={theme.primary} />
                            </View>
                            <Text style={[styles.title, { color: theme.text }]}>{item.title}</Text>
                            <Text style={[styles.description, { color: theme.textSecondary }]}>
                                {item.description}
                            </Text>
                        </View>
                    )}
                />
            </View>

            <View style={styles.footer}>
                {/* Paginator Dots */}
                <View style={styles.pagination}>
                    {SLIDES.map((_, index) => (
                        <View
                            key={index}
                            style={[
                                styles.dot,
                                {
                                    backgroundColor: index === currentIndex ? theme.primary : theme.border,
                                    width: index === currentIndex ? 20 : 8
                                }
                            ]}
                        />
                    ))}
                </View>

                {/* Button */}
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={handleNext}
                    activeOpacity={0.8}
                >
                    <Text style={styles.buttonText}>
                        {currentIndex === SLIDES.length - 1 ? 'Get Started' : 'Next'}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    slide: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    iconContainer: {
        marginBottom: spacing.xl,
        // Add subtle shadow/glow if needed
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: spacing.md,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
    },
    footer: {
        flex: 1,
        justifyContent: 'space-between',
        paddingHorizontal: spacing.xl,
        paddingBottom: spacing.xxl,
    },
    pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        height: 20,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        marginHorizontal: 4,
    },
    button: {
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
