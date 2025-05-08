import { colors } from '@/constants/color';
import { useAuthStore } from '@/stores/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const SPORTS_LIST = [
  'Boxe', 'Tennis', 'Basket', 'Football', 'Yoga', 'Running', 'Natation', 'Danse', 'Pilates',
  'Volleyball', 'Escalade', 'Cyclisme', 'Gymnastique', 'Athlétisme', 'Surf', 'Paddle',
  'Équitation', 'Ski', 'Snowboard', 'Handball', 'Musculation', 'CrossFit', 'Course'
];

export default function Edit() {
    const { auth } = useAuthStore();

    const [firstname, setFirstname] = useState(auth?.firstname || '');
    const [birthdate, setBirthdate] = useState(auth?.birthdate || '');
    const [bio, setBio] = useState(auth?.bio || '');
    const [sports, setSports] = useState<string[]>(auth?.sports || []);
    const [error, setError] = useState('');

    const toggleSport = (sport: string) => {
        if (sports.includes(sport)) {
            setSports(prev => prev.filter(s => s !== sport));
            setError('');
        } else if (sports.length < 3) {
            setSports(prev => [...prev, sport]);
            setError('');
        } else {
            setError('Vous pouvez sélectionner jusqu\'à 3 sports maximum.');
        }
    };

    const handleSave = () => {
        router.back();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity
                        onPress={() => router.back()}
                        style={styles.backButton}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>
                        Modifier mon profil
                    </Text>
                </View>
            </View>

            <ScrollView style={styles.scrollView}>
                <View style={styles.card}>
                    <View style={styles.sectionHeader}>
                        <View style={styles.iconContainer}>
                            <Ionicons
                                name="person-outline"
                                size={28}
                                color={colors.primary}
                            />
                        </View>
                        <Text style={styles.sectionTitle}>
                            Informations personnelles
                        </Text>
                    </View>

                    <Text style={styles.label}>Prénom</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Votre prénom"
                        value={firstname}
                        onChangeText={setFirstname}
                    />

                    <Text style={styles.label}>Date de naissance</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="AAAA-MM-JJ"
                        value={birthdate}
                        onChangeText={setBirthdate}
                    />

                    <Text style={styles.label}>Bio</Text>
                    <TextInput
                        style={[styles.input, styles.bioInput]}
                        placeholder="Parlez un peu de vous"
                        value={bio}
                        onChangeText={setBio}
                        multiline
                    />

                    <Text style={[styles.label, styles.sportsLabel]}>Sports pratiqués</Text>
                    {error ? (
                        <Text style={styles.errorText}>{error}</Text>
                    ) : null}
                    <View style={styles.sportsContainer}>
                        {SPORTS_LIST.map(sport => (
                            <TouchableOpacity
                                key={sport}
                                style={[
                                    styles.sportButton,
                                    sports.includes(sport) ? styles.selectedSportButton : styles.unselectedSportButton
                                ]}
                                onPress={() => toggleSport(sport)}
                            >
                                <Ionicons
                                    name={sports.includes(sport) ? 'checkmark-circle' : 'ellipse-outline'}
                                    size={18}
                                    color={sports.includes(sport) ? colors.primary : '#999'}
                                    style={styles.sportIcon}
                                />
                                <Text style={[
                                    styles.sportText,
                                    sports.includes(sport) ? styles.selectedSportText : styles.unselectedSportText
                                ]}>
                                    {sport}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        style={styles.saveButton}
                        onPress={handleSave}
                    >
                        <Text style={styles.saveButtonText}>
                            Sauvegarder
                        </Text>
                    </TouchableOpacity>
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
        borderRadius: 20,
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
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    iconContainer: {
        backgroundColor: `${colors.primary}1A`,
        borderRadius: 20,
        padding: 12,
        marginRight: 12,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Onest',
    },
    label: {
        color: '#4B5563',
        marginBottom: 4,
        fontFamily: 'Onest',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginBottom: 16,
        fontFamily: 'Onest',
    },
    bioInput: {
        minHeight: 60,
    },
    sportsLabel: {
        marginTop: 8,
        marginBottom: 8,
    },
    errorText: {
        color: '#EF4444',
        marginBottom: 8,
        fontFamily: 'Onest',
    },
    sportsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    sportButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 8,
        margin: 4,
        borderRadius: 20,
        borderWidth: 1,
    },
    selectedSportButton: {
        backgroundColor: `${colors.primary}1A`,
        borderColor: colors.primary,
    },
    unselectedSportButton: {
        backgroundColor: '#F3F4F6',
        borderColor: '#E5E7EB',
    },
    sportIcon: {
        marginRight: 6,
    },
    sportText: {
        fontFamily: 'Onest',
    },
    selectedSportText: {
        color: colors.primary,
    },
    unselectedSportText: {
        color: '#333',
    },
    saveButton: {
        backgroundColor: colors.primary,
        borderRadius: 12,
        paddingVertical: 12,
        marginTop: 24,
    },
    saveButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
        fontFamily: 'Onest',
    },
});