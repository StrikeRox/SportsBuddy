import { colors } from '@/constants/color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Confidentiality() {
    return (
        <View style={styles.container}>
            {/* En-tête personnalisé */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity 
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        Confidentialité
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name="lock-closed-outline"
                                size={28}
                                color={colors.primary}
                            />
                        </View>
                        <Text style={styles.cardTitle}>
                            Politique de confidentialité
                        </Text>
                    </View>
                    <Text style={styles.cardText}>
                        Nous accordons une grande importance à la confidentialité de vos données. 
                        Vos informations personnelles sont protégées et ne seront jamais partagées sans votre consentement.
                    </Text>
                    <Text style={styles.cardText}>
                        Vous pouvez à tout moment modifier vos paramètres de confidentialité dans cette section.
                    </Text>
                    <Text style={styles.cardText}>
                        Pour toute question concernant la confidentialité, n'hésitez pas à contacter notre support.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f3f4f6',
    },
    header: {
        height: 176,
        paddingTop: 48,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        backgroundColor: colors.primary,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 24,
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    backButton: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        padding: 8,
        borderRadius: 9999,
    },
    headerTitle: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Onest',
    },
    scrollView: {
        flex: 1,
        paddingHorizontal: 16,
        marginTop: -48,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        marginBottom: 24,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        backgroundColor: `${colors.primary}1A`,
        borderRadius: 9999,
        padding: 12,
        marginRight: 12,
    },
    cardTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Onest',
    },
    cardText: {
        color: '#4B5563',
        marginBottom: 8,
        fontFamily: 'Onest',
    },
});