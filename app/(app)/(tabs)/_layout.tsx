import { colors } from '@/constants/color';
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';

export default function tabsLayout() {
    return ( 
        <Tabs screenOptions={{
            tabBarActiveTintColor: colors.primary,
        }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'match',
                    headerShown: false,
                    tabBarIcon: ({ size, focused }) => {
                        return <Ionicons name="barbell-outline" size={size} color={focused ? colors.primary : undefined}/>;
                    },
                }}
            />
            <Tabs.Screen
                name="map"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ size, focused }) => {
                        return <Ionicons name="map-outline" size={size} color={focused ? colors.primary : undefined}/>;
                    },
                }}
            />
            <Tabs.Screen
                name="coach"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ size, focused }) => {
                        return <Ionicons name="people-outline" size={size} color={focused ? colors.primary : undefined}/>;
                    },
                }}
            />
            <Tabs.Screen
                name="message"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ size, focused }) => {
                        return (
                            <Ionicons name="chatbubble-outline" size={size} color={focused ? colors.primary : undefined}/>
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="profil"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ size, focused }) => {
                        return <Ionicons name="person-outline" size={size} color={focused ? colors.primary : undefined}/>;
                    },
                }}
            />
        </Tabs>
    );
}
