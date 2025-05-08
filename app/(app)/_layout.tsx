import { useAuthStore } from '@/stores/useAuthStore';
import { Redirect, Stack } from 'expo-router';
import React from 'react';

export default function _layout() {
    const { auth } = useAuthStore();

    if (!auth) {
        return <Redirect href="/auth/signIn" />;
    }

    return <Stack screenOptions={{ headerShown: false }} />;
}
