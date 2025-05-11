import { colors } from '@/constants/color';
import { useAuthStore } from '@/stores/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
    Image,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function profil() {
    const { auth, signOut } = useAuthStore();

    // Calcul de l'âge à partir de la date de naissance
    const calculateAge = (birthdate: string) => {
        const today = new Date();
        const birth = new Date(birthdate);
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }

        return age;
    };

    // Paramètres du compte (à personnaliser selon les besoins)
    const settings = [
        {
            icon: 'person-outline' as const,
            title: 'Modifier mon profil',
            action: () => router.push('/profil/edit'),
        },
        {
            icon: 'notifications-outline' as const,
            title: 'Notifications',
            action: () => router.push('/profil/notifications'),
        },
        {
            icon: 'lock-closed-outline' as const,
            title: 'Confidentialité',
            action: () => router.push('/profil/Confidentiality'),
        },
        // langues
        {
            icon: 'language-outline' as const,
            title: 'Langues',
            action: () => router.push('/profil/lang'),
        },
        {
            icon: 'help-circle-outline' as const,
            title: 'Aide et support',
            action: () => router.push('/profil/help'),
        },
        {
            icon: 'log-out-outline' as const,
            title: 'Déconnexion',
            action: () => signOut(),
        },
    ];

    return (
        <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* En-tête avec fond */}
                <View style={styles.header} />

                {/* Bulle de profil */}
                <View style={styles.profileBubbleContainer}>
                    <View style={styles.profileBubble}>
                        <View style={styles.profileImageContainer}>
                            {/* Photo de profil en cercle */}
                            <View style={styles.profileImageBorder}>
                                <Image
                                    source={{ uri: auth?.photos[0] }}
                                    style={styles.profileImage}
                                />
                            </View>

                            {/* Nom et certification */}
                            <View style={styles.nameContainer}>
                                <Text style={styles.name}>
                                    {auth?.firstname}
                                </Text>
                                <Image
                                    source={require('@/assets/images/certified.png')}
                                    style={styles.certifiedIcon}
                                />
                            </View>

                            {/* Âge */}
                            <Text style={styles.age}>
                                {auth?.birthdate
                                    ? `${calculateAge(auth.birthdate)} ans`
                                    : ''}
                            </Text>

                            {/* Bio */}
                            <Text style={styles.bio}>
                                {auth?.bio}
                            </Text>
                        </View>
                    </View>
                </View>

                {/* Sports */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionContent}>
                        <Text style={styles.sectionTitle}>
                            Mes sports
                        </Text>

                        <View style={styles.sportsContainer}>
                            {auth?.sports?.map(
                                (sport: string, index: number) => (
                                    <View key={index} style={styles.sportItem}>
                                        <View style={styles.sportIconContainer}>
                                            <Ionicons
                                                name={
                                                    sport.toLowerCase() ===
                                                    'boxe'
                                                        ? ('fitness-outline' as const)
                                                        : sport.toLowerCase() ===
                                                          'tennis'
                                                        ? ('tennisball-outline' as const)
                                                        : ('basketball-outline' as const)
                                                }
                                                size={28}
                                                color={colors.primary}
                                            />
                                        </View>
                                        <Text style={styles.sportName}>
                                            {sport}
                                        </Text>
                                    </View>
                                ),
                            )}
                        </View>
                    </View>
                </View>

                {/* Paramètres */}
                <View style={styles.sectionContainer}>
                    <View style={styles.sectionContent}>
                        <Text style={styles.sectionTitle}>
                            Paramètres
                        </Text>

                        {settings.map((setting, index) => (
                            <TouchableOpacity
                                key={index}
                                style={[
                                    styles.settingItem,
                                    index < settings.length - 1 && styles.settingItemBorder
                                ]}
                                onPress={setting.action}
                            >
                                <View style={styles.settingIconContainer}>
                                    <Ionicons
                                        name={setting.icon}
                                        size={22}
                                        color={colors.primary}
                                    />
                                </View>
                                <Text style={styles.settingTitle}>
                                    {setting.title}
                                </Text>
                                <Ionicons
                                    name="chevron-forward"
                                    size={20}
                                    color="gray"
                                />
                            </TouchableOpacity>
                        ))}
                    </View>
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
        height: 128,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        backgroundColor: colors.primary,
    },
    profileBubbleContainer: {
        paddingHorizontal: 16,
        marginTop: -64,
    },
    profileBubble: {
        backgroundColor: 'white',
        borderRadius: 24,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    profileImageContainer: {
        alignItems: 'center',
    },
    profileImageBorder: {
        padding: 4,
        borderRadius: 9999,
        backgroundColor: colors.primary,
    },
    profileImage: {
        height: 96,
        width: 96,
        borderRadius: 48,
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 8,
        color: 'black',
        fontFamily: 'Onest',
    },
    certifiedIcon: {
        width: 24,
        height: 24,
    },
    age: {
        color: '#4b5563',
        marginTop: 4,
        fontFamily: 'Onest',
    },
    bio: {
        textAlign: 'center',
        color: '#374151',
        marginTop: 8,
        fontFamily: 'Onest',
    },
    sectionContainer: {
        paddingHorizontal: 16,
        marginTop: 16,
    },
    sectionContent: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        fontFamily: 'Onest',
    },
    sportsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    sportItem: {
        alignItems: 'center',
    },
    sportIconContainer: {
        backgroundColor: '#f3f4f6',
        borderRadius: 9999,
        padding: 12,
        marginBottom: 8,
    },
    sportName: {
        fontSize: 14,
        fontFamily: 'Onest',
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
    },
    settingItemBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#e5e7eb',
    },
    settingIconContainer: {
        backgroundColor: '#f3f4f6',
        borderRadius: 9999,
        padding: 8,
        marginRight: 12,
    },
    settingTitle: {
        flex: 1,
        fontFamily: 'Onest',
    },
});
