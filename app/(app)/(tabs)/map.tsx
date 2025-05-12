import { colors } from '@/constants/color';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import * as Location from 'expo-location';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    Animated,
    Easing,
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
    rating?: number;
    openingHours?: {
        isOpen: boolean;
        periods?: any[];
    };
    photos?: string[];
    phoneNumber?: string;
    website?: string;
}

export default function Map() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSearching, setIsSearching] = useState(false);
    const [location, setLocation] = useState<Location.LocationObject | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [gyms, setGyms] = useState<GymLocation[]>([]);
    const [selectedGym, setSelectedGym] = useState<GymLocation | null>(null);
    const mapRef = useRef<MapView | null>(null);
    const slideAnim = useRef(new Animated.Value(0)).current;

    // Fonction pour obtenir la localisation de l'utilisateur
    const getLocation = async () => {
        setIsLoading(true);
        setErrorMsg(null);
        
        try {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission de localisation refusée');
                setIsLoading(false);
                return;
            }
            
            let loc = await Location.getCurrentPositionAsync({ 
                accuracy: Location.Accuracy.Balanced 
            });
            
            setLocation(loc);
            // Attendre que la localisation soit définie avant de chercher les salles
            await fetchNearbyGyms(loc.coords.latitude, loc.coords.longitude);
            setIsLoading(false);
        } catch (error) {
            setErrorMsg('Impossible d\'obtenir votre position');
            setIsLoading(false);
        }
    };

    const fetchNearbyGyms = async (latitude: number, longitude: number) => {
        try {
            setIsSearching(true);
            
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=50000&type=gym&key=AIzaSyDcZTBUGGEbMxW7BGibd71kEzdMVh-XO9A`
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
            setErrorMsg('Erreur lors de la recherche des salles de sport');
        } finally {
            setIsSearching(false);
        }
    };

    // Obtenir la localisation au chargement du composant
    useEffect(() => {
        getLocation();
    }, []);

    // Ajoutez un useEffect pour recharger les salles quand la région change
    useEffect(() => {
        if (location) {
            fetchNearbyGyms(location.coords.latitude, location.coords.longitude);
        }
    }, [location]);

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

    const fetchGymDetails = async (placeId: string) => {
        try {
            const response = await fetch(
                `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=rating,opening_hours,photos,formatted_phone_number,website&key=AIzaSyDcZTBUGGEbMxW7BGibd71kEzdMVh-XO9A`
            );
            
            const data = await response.json();
            
            if (data.result) {
                setSelectedGym(prev => {
                    if (!prev) return null;
                    return {
                        ...prev,
                        rating: data.result.rating,
                        openingHours: data.result.opening_hours,
                        photos: data.result.photos?.map((photo: any) => 
                            `https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=${photo.photo_reference}&key=AIzaSyDcZTBUGGEbMxW7BGibd71kEzdMVh-XO9A`
                        ),
                        phoneNumber: data.result.formatted_phone_number,
                        website: data.result.website
                    };
                });
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des détails:', error);
        }
    };

    const handleGymPress = (gym: GymLocation) => {
        // Si c'est le même gym, on ne fait rien
        if (selectedGym?.id === gym.id) return;
        
        // Si un autre gym est déjà sélectionné, on met à jour les détails sans animation
        if (selectedGym) {
            setSelectedGym(gym);
            fetchGymDetails(gym.id);
        } else {
            // Si aucun gym n'est sélectionné, on lance l'animation
            setSelectedGym(gym);
            fetchGymDetails(gym.id);
            Animated.timing(slideAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
                easing: Easing.bezier(0.25, 0.1, 0.25, 1)
            }).start();
        }
    };

    const handleClose = () => {
        Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1)
        }).start(() => {
            setSelectedGym(null);
        });
    };

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
                            onPress={() => handleGymPress(gym)}
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

    const renderGymDetails = () => {
        if (!selectedGym) return null;
        
        return (
            <Animated.View style={[
                styles.gymDetailsContainer,
                {
                    transform: [{
                        translateY: slideAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [500, 0]
                        })
                    }],
                    opacity: slideAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0, 1]
                    })
                }
            ]}>
                <View style={styles.gymDetailsContent}>
                    <View style={styles.gymDetailsHeader}>
                        <Text style={styles.gymDetailsTitle}>{selectedGym.name}</Text>
                        <TouchableOpacity 
                            onPress={handleClose}
                            style={styles.closeButton}
                        >
                            <Ionicons name="close" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                    
                    <View style={styles.gymDetailsBody}>
                        <View style={styles.infoRow}>
                            <Ionicons name="location-outline" size={20} color={colors.primary} />
                            <Text style={styles.infoText}>{selectedGym.vicinity}</Text>
                        </View>
                        
                        {selectedGym.rating && (
                            <View style={styles.infoRow}>
                                <Ionicons name="star" size={20} color={colors.primary} />
                                <Text style={styles.infoText}>{selectedGym.rating.toFixed(1)} / 5</Text>
                            </View>
                        )}
                        
                        {selectedGym.openingHours && (
                            <View style={styles.infoRow}>
                                <Ionicons 
                                    name={selectedGym.openingHours.isOpen ? "time" : "time-outline"} 
                                    size={20} 
                                    color={selectedGym.openingHours.isOpen ? colors.primary : "red"} 
                                />
                                <Text style={styles.infoText}>
                                    {selectedGym.openingHours.isOpen ? "Ouvert" : "Fermé"}
                                </Text>
                            </View>
                        )}
                        
                        {selectedGym.phoneNumber && (
                            <TouchableOpacity 
                                style={styles.infoRow}
                                onPress={() => Linking.openURL(`tel:${selectedGym.phoneNumber}`)}
                            >
                                <Ionicons name="call-outline" size={20} color={colors.primary} />
                                <Text style={styles.infoText}>{selectedGym.phoneNumber}</Text>
                            </TouchableOpacity>
                        )}
                        
                        {selectedGym.website && (
                            <TouchableOpacity 
                                style={styles.infoRow}
                                onPress={() => Linking.openURL(selectedGym.website!)}
                            >
                                <Ionicons name="globe-outline" size={20} color={colors.primary} />
                                <Text style={styles.infoText}>Site web</Text>
                            </TouchableOpacity>
                        )}
                        
                        <TouchableOpacity 
                            style={styles.directionsButton}
                            onPress={() => {
                                const url = `https://www.google.com/maps/dir/?api=1&destination=${selectedGym.location.lat},${selectedGym.location.lng}`;
                                Linking.openURL(url);
                            }}
                        >
                            <Ionicons name="navigate" size={20} color="white" />
                            <Text style={styles.directionsButtonText}>Obtenir l'itinéraire</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Animated.View>
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
            {renderGymDetails()}
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
    gymDetailsContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 16
    },
    gymDetailsContent: {
        backgroundColor: 'white',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        padding: 16,
    },
    gymDetailsHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    gymDetailsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        fontFamily: 'Onest',
        flex: 1,
    },
    gymDetailsBody: {
        gap: 16,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    infoText: {
        fontSize: 16,
        fontFamily: 'Onest',
        color: '#333',
    },
    directionsButton: {
        backgroundColor: colors.primary,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
        gap: 8,
        marginTop: 8,
    },
    directionsButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Onest',
    },
    closeButton: {
        padding: 8,
    },
});