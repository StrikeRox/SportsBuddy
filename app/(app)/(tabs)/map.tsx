import { colors } from '@/constants/color';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';

interface GymLocation {
    id: string;
    name: string;
    location: {
        lat: number;
        lng: number;
    };
    vicinity: string;
}

export default function Map() {
    const [isLoading, setIsLoading] = useState(true);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [gyms, setGyms] = useState<GymLocation[]>([]);
    const mapRef = useRef<MapView | null>(null);

    // Fonction pour obtenir la localisation de l'utilisateur
    const getLocation = async () => {
        setIsLoading(true);
        setErrorMsg(null);
        
        let isMounted = true;
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                if (isMounted) {
                    setErrorMsg('Permission de localisation refusée');
                    setIsLoading(false);
                }
                return;
            }
            
            let loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
            if (isMounted) {
                setLocation(loc);
                fetchNearbyGyms(loc.coords.latitude, loc.coords.longitude);
                setIsLoading(false);
            }
        } catch (error) {
            if (isMounted) {
                setErrorMsg('Impossible d\'obtenir votre position');
                setIsLoading(false);
            }
        }
        
        return () => { isMounted = false; };
    };

    const fetchNearbyGyms = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=5000&type=gym&key=VOTRE_CLE_API_GOOGLE`
            );
            const data = await response.json();
            
            if (data.results) {
                const gymLocations: GymLocation[] = data.results.map((place: any) => ({
                    id: place.place_id,
                    name: place.name,
                    location: place.geometry.location,
                    vicinity: place.vicinity
                }));
                setGyms(gymLocations);
            }
        } catch (error) {
            console.error('Erreur lors de la recherche des salles de sport:', error);
        }
    };

    // Obtenir la localisation au chargement du composant
    useEffect(() => {
        getLocation();
    }, []);

    // Fonction pour centrer la carte sur l'utilisateur
    const centerOnUser = useCallback(() => {
        if (location && mapRef.current) {
            const region: Region = {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
            };
            mapRef.current.animateToRegion(region, 500);
        }
    }, [location]);

    const renderContent = () => {
        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <Text style={styles.loadingText}>
                        Chargement de la carte...
                    </Text>
                </View>
            );
        }
        
        if (errorMsg) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        {errorMsg}
                    </Text>
                    <TouchableOpacity 
                        onPress={getLocation}
                        style={styles.retryButton}
                    >
                        <Text style={styles.retryButtonText}>
                            Réessayer
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
        
        if (!location) {
            return (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>
                        Aucune position trouvée
                    </Text>
                    <TouchableOpacity 
                        onPress={getLocation}
                        style={styles.retryButton}
                    >
                        <Text style={styles.retryButtonText}>
                            Réessayer
                        </Text>
                    </TouchableOpacity>
                </View>
            );
        }
        
        return (
            <View style={styles.mapContainer}>
                <MapView    
                    ref={mapRef}
                    style={styles.map}
                    provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
                    initialRegion={{
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    }}
                    showsUserLocation
                    showsMyLocationButton={false}
                    showsCompass={true}
                    showsScale={true}
                >
                    {gyms.map((gym) => (
                        <Marker
                            key={gym.id}
                            coordinate={{
                                latitude: gym.location.lat,
                                longitude: gym.location.lng
                            }}
                            title={gym.name}
                            description={gym.vicinity}
                        >
                            <View style={styles.markerContainer}>
                                <Ionicons name="barbell-outline" size={24} color={colors.primary} />
                            </View>
                        </Marker>
                    ))}
                </MapView>
                    
                {/* Bouton pour recentrer sur l'utilisateur */}
                <TouchableOpacity 
                    style={styles.centerButton}
                    onPress={centerOnUser}
                >
                    <Ionicons name="locate" size={24} color={colors.primary} />
                </TouchableOpacity>   
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* En-tête */}
            <View style={styles.header}>
                <Text style={styles.headerText}>
                    Carte
                </Text>
            </View>
            {renderContent()}
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: '500',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 16,
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    retryButton: {
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
        backgroundColor: colors.primary,
    },
    retryButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    mapContainer: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%'
    },
    centerButton: {
        position: 'absolute',
        right: 16,
        bottom: 16,
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 30,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    markerContainer: {
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.primary,
    },
});