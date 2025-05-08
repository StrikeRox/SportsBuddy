import { Stack } from 'expo-router'
import React from 'react'
import { Text } from 'react-native'
export default function _layout() {
  return (
    <Stack>
        <Stack.Screen name="index" options={{ headerShown: false, headerTitle() {
            return (
                <Text>Messages</Text>
            )
        }, }} />
    </Stack>
  )
}