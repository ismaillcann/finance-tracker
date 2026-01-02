import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { WatchlistScreen } from '../screens/watchlist/WatchlistScreen';
import { SearchScreen } from '../screens/watchlist/SearchScreen';
import { AssetDetailScreen } from '../screens/asset/AssetDetailScreen';
import { useColorScheme } from 'react-native';
import { colors } from '../theme/colors';

const Stack = createNativeStackNavigator();

export const MainNavigator = () => {
    const colorScheme = useColorScheme() ?? 'light';
    const theme = colors[colorScheme];

    return (
        <Stack.Navigator
            screenOptions={{
                headerStyle: {
                    backgroundColor: theme.surface,
                },
                headerTintColor: theme.text,
                headerShadowVisible: false,
            }}>
            <Stack.Screen
                name="Watchlist"
                component={WatchlistScreen}
                options={{
                    title: 'My Watchlist',
                }}
            />
            <Stack.Screen
                name="Search"
                component={SearchScreen}
                options={{
                    title: 'Add Asset',
                    presentation: 'modal',
                }}
            />
            <Stack.Screen
                name="AssetDetail"
                component={AssetDetailScreen}
                options={({ route }: any) => ({
                    title: route.params?.asset?.symbol || 'Asset Details',
                })}
            />
        </Stack.Navigator>
    );
};
