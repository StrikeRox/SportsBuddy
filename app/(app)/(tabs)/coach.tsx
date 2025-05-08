import { colors } from '@/constants/color';
import { coaches } from '@/data/coaches';
import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Type pour les coachs
type Coach = {
    id: number;
    name: string;
    sport: string;
    certified: boolean;
    img: string;
};

export default function Coach() {
    // Fonction pour rendre chaque carte de coach
    const renderCoachCard = ({ item }: { item: Coach }) => (
        <TouchableOpacity style={styles.coachCard}>
            <Image
                source={{ uri: item.img }}
                style={styles.coachImage}
                resizeMode="cover"
            />
            <View style={styles.cardContent}>
                <View style={styles.nameContainer}>
                    <Text style={styles.coachName}>
                        {item.name}
                    </Text>
                    {item.certified && (
                        <Image
                            source={require('@/assets/images/certified.png')}
                            style={styles.certifiedIcon}
                        />
                    )}
                </View>
                <View style={styles.sportContainer}>
                    <Ionicons
                        name={
                            item.sport.toLowerCase() === 'boxe'
                                ? 'fitness-outline'
                                : item.sport.toLowerCase() === 'tennis'
                                ? 'tennisball-outline'
                                : item.sport.toLowerCase() === 'fitness'
                                ? 'barbell-outline'
                                : item.sport.toLowerCase() === 'yoga'
                                ? 'body-outline'
                                : item.sport.toLowerCase() === 'basketball'
                                ? 'basketball-outline'
                                : item.sport.toLowerCase() === 'natation'
                                ? 'water-outline'
                                : item.sport.toLowerCase() === 'football'
                                ? 'football-outline'
                                : item.sport.toLowerCase() === 'danse'
                                ? 'body-outline'
                                : 'fitness-outline'
                        }
                        size={16}
                        color={colors.primary}
                    />
                    <Text style={styles.sportText}>
                        {item.sport}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            
            {/* En-tête */}
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Coachs
                </Text>
            </View>

            {/* Grille de coachs */}
            <FlatList
                data={coaches}
                renderItem={renderCoachCard}
                keyExtractor={item => item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.gridContainer}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <View style={styles.emptyContainer}>
                        <Ionicons
                            name="people-outline"
                            size={60}
                            color={colors.primary}
                        />
                        <Text style={styles.emptyTitle}>
                            Aucun coach disponible
                        </Text>
                        <Text style={styles.emptySubtitle}>
                            Revenez plus tard pour découvrir nos coachs
                        </Text>
                    </View>
                }
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    headerText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Onest',
    },
    gridContainer: {
        padding: 8,
    },
    coachCard: {
        flex: 1,
        margin: 8,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
        overflow: 'hidden',
    },
    coachImage: {
        width: '100%',
        height: 160,
    },
    cardContent: {
        padding: 12,
    },
    nameContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    coachName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        fontFamily: 'Onest',
    },
    certifiedIcon: {
        width: 20,
        height: 20,
    },
    sportContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    sportText: {
        fontSize: 14,
        color: '#666',
        marginLeft: 4,
        fontFamily: 'Onest',
    },
    emptyContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyTitle: {
        fontSize: 20,
        marginTop: 16,
        color: '#666',
        textAlign: 'center',
        fontFamily: 'Onest',
    },
    emptySubtitle: {
        fontSize: 16,
        marginTop: 8,
        color: '#999',
        textAlign: 'center',
        paddingHorizontal: 40,
        fontFamily: 'Onest',
    },
});
