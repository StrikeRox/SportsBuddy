import { colors } from '@/constants/color';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function ChoiceText({ type }: { type: 'like' | 'none' }) {
    return (
        <View style={[
            styles.container,
            {
                borderColor: type === 'like' ? colors.love : colors.none,
                transform: [{ rotate: type === 'like' ? '-30deg' : '30deg' }],
            }
        ]}>
            <Text style={[
                styles.text,
                { color: type === 'like' ? colors.love : colors.none }
            ]}>
                {type === 'like' ? 'LIKE' : 'NONE'}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        borderWidth: 2,
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
    },
    text: {
        fontSize: 32,
        fontWeight: 'bold',
        letterSpacing: 2,
    },
});
