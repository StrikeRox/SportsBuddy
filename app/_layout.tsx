import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [fontsLoaded] = useFonts({
        Bytesized: require('@/assets/fonts/Bytesized.ttf'),
        Onest: require('@/assets/fonts/Onest.ttf'),
    });

    useEffect(() => {
        async function prepare() {
            if (fontsLoaded) {
                await SplashScreen.hideAsync();
            }
        }
        prepare();
    }, [fontsLoaded]);

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Stack screenOptions={{ headerShown: false }} />
        </GestureHandlerRootView>
    );
}
