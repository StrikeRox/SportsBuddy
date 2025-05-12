import { colors } from '@/constants/color';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Type pour les paramètres de notification
type NotificationSettings = {
    general: boolean;
    matches: boolean;
    messages: boolean;
    promotions: boolean;
    events: boolean;
    updates: boolean;
};

export default function Notifications() {
    // État pour les paramètres de notification
    const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
        general: true,
        matches: true,
        messages: true,
        promotions: true,
        events: true,
        updates: true
    });

    // État pour sauvegarder les paramètres précédents
    const [previousSettings, setPreviousSettings] = useState<Omit<NotificationSettings, 'general'>>({
        matches: false,
        messages: false,
        promotions: false,
        events: false,
        updates: false
    });

    // Fonction pour basculer un paramètre de notification
    const toggleNotification = (setting: keyof NotificationSettings) => {
        setNotificationSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    // Fonction pour activer/désactiver toutes les notifications
    const toggleAllNotifications = () => {
        const newGeneralValue = !notificationSettings.general;
        
        if (newGeneralValue) {
            // Si on active les notifications, on restaure les paramètres précédents
            setNotificationSettings({
                general: true,
                ...previousSettings
            });
        } else {
            // Si on désactive les notifications, on sauvegarde les paramètres actuels
            setPreviousSettings({
                matches: notificationSettings.matches,
                messages: notificationSettings.messages,
                promotions: notificationSettings.promotions,
                events: notificationSettings.events,
                updates: notificationSettings.updates
            });
            
            // Puis on désactive toutes les notifications
            setNotificationSettings({
                general: false,
                matches: false,
                messages: false,
                promotions: false,
                events: false,
                updates: false
            });
        }
    };

    // Fonction pour sauvegarder les paramètres
    const handleSave = () => {
        // Ici, vous pouvez ajouter la logique pour sauvegarder les paramètres
        Alert.alert(
            "Succès",
            "Vos préférences de notification ont été enregistrées",
            [
                { text: "OK", onPress: () => router.back() }
            ]
        );
    };

    // Liste des types de notifications avec leurs icônes
    const notificationTypes = [
        {
            id: 'matches' as keyof NotificationSettings,
            title: 'Nouveaux matchs',
            description: 'Soyez informé lorsque quelqu\'un a aimé votre profil',
            icon: 'heart-outline'
        },
        {
            id: 'messages' as keyof NotificationSettings,
            title: 'Messages',
            description: 'Recevez des notifications pour les nouveaux messages',
            icon: 'chatbubble-outline'
        },
        {
            id: 'promotions' as keyof NotificationSettings,
            title: 'Promotions',
            description: 'Restez informé des offres spéciales et promotions',
            icon: 'pricetag-outline'
        },
        {
            id: 'events' as keyof NotificationSettings,
            title: 'Événements',
            description: 'Soyez notifié des événements sportifs à proximité',
            icon: 'calendar-outline'
        },
        {
            id: 'updates' as keyof NotificationSettings,
            title: 'Mises à jour',
            description: 'Recevez des informations sur les nouvelles fonctionnalités',
            icon: 'refresh-outline'
        }
    ];

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
                        Notifications
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                {/* Bloc unique de notifications */}
                <View style={styles.notificationBlock}>
                    {/* Bouton principal pour activer/désactiver toutes les notifications */}
                    <View style={styles.mainToggle}>
                        <View style={styles.mainToggleContent}>
                            <View style={styles.iconContainer}>
                                <Ionicons
                                    name="notifications-outline"
                                    size={28}
                                    color={colors.primary}
                                />
                            </View>
                            <View>
                                <Text style={styles.mainToggleTitle}>
                                    Notifications
                                </Text>
                                <Text style={styles.mainToggleStatus}>
                                    {notificationSettings.general ? 'Activées' : 'Désactivées'}
                                </Text>
                            </View>
                        </View>
                        <Switch
                            value={notificationSettings.general}
                            onValueChange={toggleAllNotifications}
                            trackColor={{ false: '#d1d5db', true: colors.primary }}
                            thumbColor="#fff"
                        />
                    </View>
                    
                    <Text style={styles.description}>
                        Personnalisez les types de notifications que vous souhaitez recevoir
                    </Text>

                    {/* Types de notifications spécifiques */}
                    {notificationTypes.map((type, index) => (
                        <View 
                            key={type.id} 
                            style={[
                                styles.notificationType,
                                index !== notificationTypes.length - 1 && styles.notificationTypeBorder
                            ]}
                        >
                            <View style={styles.notificationTypeContent}>
                                <View style={styles.notificationTypeInfo}>
                                    <View style={[
                                        styles.notificationTypeIcon,
                                        !notificationSettings.general && styles.notificationTypeIconDisabled
                                    ]}>
                                        <Ionicons
                                            name={type.icon as any}
                                            size={22}
                                            color={notificationSettings.general ? colors.primary : '#999'}
                                        />
                                    </View>
                                    <View style={styles.notificationTypeText}>
                                        <Text style={[
                                            styles.notificationTypeTitle,
                                            !notificationSettings.general && styles.textDisabled
                                        ]}>
                                            {type.title}
                                        </Text>
                                        <Text style={[
                                            styles.notificationTypeDescription,
                                            !notificationSettings.general && styles.textDisabled
                                        ]}>
                                            {type.description}
                                        </Text>
                                    </View>
                                </View>
                                <Switch
                                    value={notificationSettings[type.id]}
                                    onValueChange={() => toggleNotification(type.id)}
                                    trackColor={{ false: '#d1d5db', true: colors.primary }}
                                    thumbColor="#fff"
                                    disabled={!notificationSettings.general}
                                />
                            </View>
                        </View>
                    ))}
                </View>

                {/* Informations supplémentaires */}
                <View style={styles.infoBlock}>
                    <Text style={styles.infoTitle}>
                        Informations supplémentaires
                    </Text>
                    
                    <Text style={styles.infoText}>
                        Les notifications sont importantes pour rester connecté avec la communauté sportive.
                    </Text>
                    
                    <Text style={styles.infoText}>
                        Vous pouvez modifier ces paramètres à tout moment.
                    </Text>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
    notificationBlock: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 24,
    },
    mainToggle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 24,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    mainToggleContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconContainer: {
        backgroundColor: 'rgba(79, 70, 229, 0.1)',
        borderRadius: 9999,
        padding: 12,
        marginRight: 12,
    },
    mainToggleTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Onest',
    },
    mainToggleStatus: {
        color: '#6b7280',
        fontFamily: 'Onest',
    },
    description: {
        color: '#4b5563',
        marginBottom: 16,
        fontFamily: 'Onest',
    },
    notificationType: {
        paddingVertical: 16,
    },
    notificationTypeBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    notificationTypeContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    notificationTypeInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    notificationTypeIcon: {
        backgroundColor: '#f3f4f6',
        borderRadius: 9999,
        padding: 8,
        marginRight: 12,
    },
    notificationTypeIconDisabled: {
        backgroundColor: '#e5e7eb',
    },
    notificationTypeText: {
        flex: 1,
    },
    notificationTypeTitle: {
        fontWeight: '600',
        fontFamily: 'Onest',
    },
    notificationTypeDescription: {
        fontSize: 14,
        color: '#6b7280',
        fontFamily: 'Onest',
    },
    textDisabled: {
        color: '#9ca3af',
    },
    infoBlock: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginBottom: 24,
    },
    infoTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        fontFamily: 'Onest',
    },
    infoText: {
        color: '#4b5563',
        marginBottom: 8,
        fontFamily: 'Onest',
    },
});