import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { WatchlistScreen } from '../screens/watchlist/WatchlistScreen';
import { useColorScheme } from 'react-native';
import { colors } from '../theme/colors';

const Tab = createBottomTabNavigator();

export const MainNavigator = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = colors[colorScheme];

    return (
        <Tab.Navigator
            screenOptions={{
                tabBarStyle: {
                    backgroundColor: theme.surface,
                    borderTopColor: theme.border,
                },
                tabBarActiveTintColor: theme.primary,
                tabBarInactiveTintColor: theme.textSecondary,
                headerStyle: {
                    backgroundColor: theme.surface,
                },
                headerTintColor: theme.text,
            }}>
            <Tab.Screen
                name="Watchlist"
                component={WatchlistScreen}
                options={{
                    title: 'My Watchlist',
                }}
            />
        </Tab.Navigator>
    );
};
