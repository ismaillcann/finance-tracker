import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainNavigator } from './MainNavigator';
import { NewsScreen } from '../screens/news/NewsScreen'; // We will create this
import { useColorScheme } from 'react-native';
import { colors } from '../theme/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
    const colorScheme = useColorScheme();
    const isDark = colorScheme === 'dark';
    const theme = colors[isDark ? 'dark' : 'light'];

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: theme.surface,
                    borderTopColor: theme.border,
                    elevation: 5,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    height: 90, // Taller tab bar for modern look
                    paddingTop: 10,
                },
                tabBarActiveTintColor: theme.chart.line, // Use our brand indingo
                tabBarInactiveTintColor: theme.textSecondary,
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginBottom: 5,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;

                    if (route.name === 'Markets') {
                        iconName = focused ? 'trending-up' : 'trending-up-outline';
                    } else if (route.name === 'News') {
                        iconName = focused ? 'newspaper' : 'newspaper-outline';
                    }

                    return <Ionicons name={iconName || 'alert-circle'} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Markets"
                component={MainNavigator}
                options={{
                    title: 'Markets'
                }}
            />
            <Tab.Screen
                name="News"
                component={NewsScreen}
                options={{
                    title: 'News',
                    // Safe area handling for News screen since existing headers might overlap
                    headerShown: false
                }}
            />
        </Tab.Navigator>
    );
};
