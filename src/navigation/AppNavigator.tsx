import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { AuthNavigator } from './AuthNavigator';
import { TabNavigator } from './TabNavigator';
import { onAuthStateChanged } from '../services/firebase/auth';
import { User } from '../types';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OnboardingScreen } from '../screens/onboarding/OnboardingScreen';

export const AppNavigator = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                // Check onboarding status
                const hasLaunched = await AsyncStorage.getItem('@onboarding_complete');
                setIsFirstLaunch(hasLaunched === null);
            } catch (error) {
                setIsFirstLaunch(false); // Default to skippping if error
            }
        };

        const unsubscribe = onAuthStateChanged(currentUser => {
            setUser(currentUser);
            // Only set loading to false after we've checked both auth AND onboarding
            // We'll rely on a separate effect or check below, but simple way is:
            // calling init() here might be race condition with auth.
            // Let's call init() independently.
        });

        init().then(() => {
            // We wait for auth to settle usually, but here onAuthStateChanged fires pretty quick.
            // Let's just manage loading state when both are ready.
        });

        return unsubscribe;
    }, []);

    // Effect to coordinate loading state
    useEffect(() => {
        if (isFirstLaunch !== null && user !== undefined) {
            // We can stop loading, but user might be null which is fine
            // Actually onAuthStateChanged fires immediately with null or user.
            // We just need to make sure we don't show the screen until we know about 'isFirstLaunch'
            setLoading(false);
        }
    }, [isFirstLaunch, user]);


    if (loading || isFirstLaunch === null) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (isFirstLaunch) {
        return <OnboardingScreen onFinish={() => setIsFirstLaunch(false)} />;
    }

    return (
        <NavigationContainer>
            {user ? <TabNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
