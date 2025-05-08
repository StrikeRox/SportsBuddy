import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Keyboard, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface Props {
    placeholder?: string;
    value?: string;
    secureTextEntry?: boolean;
    maxLength?: number;
    onChangeText?: (text: string) => void;
    leftIcon?: React.ReactNode;
}

export default function Input({
    placeholder,
    value,
    secureTextEntry = false,
    maxLength,
    onChangeText,
    leftIcon,
}: Props) {
    const [showPassword, setShowPassword] = useState(secureTextEntry);

    const handlePasswordToggle = () => {
        setShowPassword(prevState => !prevState);
    };

    return (
        <View style={styles.container}>
            {leftIcon && (
                <View style={styles.leftIconContainer}>
                    {leftIcon}
                </View>
            )}
            <TextInput
                onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key.length > 1 && nativeEvent.key !== 'Backspace') {
                        Keyboard.dismiss();
                }}}
                placeholder={placeholder}
                value={value}
                secureTextEntry={showPassword}
                onChangeText={onChangeText}
                maxLength={maxLength}
                style={[
                    styles.input,
                    secureTextEntry ? styles.inputWithSecureTextEntry : null,
                    leftIcon ? styles.inputWithLeftIcon : null
                ]}
            />
            {secureTextEntry && (
                <TouchableOpacity
                    onPress={handlePasswordToggle}
                    style={styles.passwordToggle}
                >
                    <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={24}
                        color="#666"
                    />
                </TouchableOpacity>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#d1d5db',
        borderRadius: 8,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 1,
        position: 'relative',
    },
    leftIconContainer: {
        position: 'absolute',
        left: 12,
        top: '50%',
        transform: [{ translateY: -12 }],
        zIndex: 10,
    },
    input: {
        width: '100%',
        color: '#111827',
        padding: 16,
    },
    inputWithSecureTextEntry: {
        paddingRight: 48,
    },
    inputWithLeftIcon: {
        paddingLeft: 48,
    },
    passwordToggle: {
        position: 'absolute',
        right: 16,
        top: '50%',
        transform: [{ translateY: -12 }],
    },
});
