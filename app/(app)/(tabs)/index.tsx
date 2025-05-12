import Card from '@/components/Card';
import { colors } from '@/constants/color';
import { peoples } from '@/data/peoples';
import { useAuthStore } from '@/stores/useAuthStore';
import { useMatchStore } from '@/stores/useMatchStores';
import { Profil } from '@/types/Profil';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    Image,
    PanResponder,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Index() {
    const { auth } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);
    const [persons, setPersons] = useState<Profil[]>(auth?.showGender === 'all' ? peoples : peoples.filter(person => person.gender === auth?.showGender));
    const [lastProfil, setLastProfil] = useState<[Profil, string]>();
    const matchStore = useMatchStore();
    const [swipe, setSwipe] = useState<string | null>(null);
    const [disabled, setDisabled] = useState(false);
    const [isSwiping, setIsSwiping] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    useEffect(() => {
        if (swipe === 'like' && matchStore.listLikes.includes(persons[0].id)) {
            setTimeout(() => {
                matchStore.addMatch(persons[0]);
                animateMatch(persons[0]);
            }, 500);
        }
        setSwipe(null);
    }, [swipe]);

    useEffect(() => {
        if (auth?.showGender !== 'all') {
            const filteredPeople = peoples.filter(person => person.gender === auth?.showGender);
            setPersons(filteredPeople.length > 0 ? filteredPeople : peoples.slice(0, 15));
        }
    }, [auth?.showGender]);

    useEffect(() => {
        if (persons.length === 0) {
            setIsLoading(true);
            const filteredPeople = peoples.filter(person => person.gender === auth?.showGender);
            setPersons(filteredPeople.length > 0 ? filteredPeople : peoples.slice(0, 15));
            swipeValues.current = filteredPeople.map(() => new Animated.ValueXY());
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    }, [persons]);

    const swipeValues = useRef(
        persons.map(() => new Animated.ValueXY())
    );

    const removeTopCard = useCallback(() => {        
        setPersons(prev => {
            if (prev.length === 0) return prev; 

            setLastProfil([
                prev[0],
                swipe || 'none',
            ]);
            swipeValues.current = swipeValues.current.slice(1);
            
            return prev.slice(1);
        });
    }, [swipe]);

    const backPerson = () => {
        if (lastProfil) {
            const newPerson = lastProfil[0];
            const newPersonPosition = new Animated.ValueXY({
                x: lastProfil[1] === 'like' ? SCREEN_WIDTH : -SCREEN_WIDTH,
                y: 0,
            });

            setPersons(prevPersons => [newPerson, ...prevPersons]);
            swipeValues.current = [newPersonPosition, ...swipeValues.current];

            Animated.spring(newPersonPosition, {
                toValue: { x: 0, y: 0 },
                useNativeDriver: true,
            }).start();
        }
        setLastProfil(undefined);
    };

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: () => true,
        onPanResponderMove: (_, { dx, dy }) => {
            swipeValues.current[0]?.setValue({ x: dx, y: dy });
            setIsSwiping(dx !== 0);
        },
        onPanResponderRelease: (_, { dx }) => {
            setIsSwiping(false);
            const direction = Math.sign(dx);
            const isSwiped = Math.abs(dx) > 150;

            if (isSwiped) {
                if (direction > 0) {
                    setSwipe('like');
                } else {
                    setSwipe('none');
                }
                
                Animated.timing(swipeValues.current[0], {
                    toValue: {
                        x: direction * SCREEN_WIDTH * 1.5,
                        y: 0,
                    },
                    duration: 200,
                    useNativeDriver: true,
                }).start(removeTopCard);
            } else {
                Animated.spring(swipeValues.current[0], {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                }).start();
            }
        },
    });

    const handleChoice = useCallback(
        (direction: 'like' | 'none') => {
            if (isProcessing || isSwiping) return;
            setIsProcessing(true);
            setSwipe(direction);
            
            Animated.timing(swipeValues.current[0].x, {
                toValue:
                    direction === 'like'
                        ? SCREEN_WIDTH * 1.5
                        : -SCREEN_WIDTH * 1.5,
                duration: 400,
                useNativeDriver: true,
            }).start(() => {
                removeTopCard();
                setIsProcessing(false);
            });
        },
        [removeTopCard, isSwiping, isProcessing]
    );

    const [showMatch, setShowMatch] = useState(false);
    const [matchedPerson, setMatchedPerson] = useState<Profil | null>(null);
    const matchAnimation = useRef(new Animated.Value(0)).current;

    const animateMatch = useCallback((person: Profil) => {
        setMatchedPerson(person);
        setShowMatch(true);
        
        Animated.sequence([
            Animated.spring(matchAnimation, {
                toValue: 1,
                useNativeDriver: true,
                tension: 50,
                friction: 7
            }),
            Animated.delay(2000),
            Animated.timing(matchAnimation, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true
            })
        ]).start(() => {
            setShowMatch(false);
            setMatchedPerson(null);
        });
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text>Recherche de profils...</Text>
                </View>
            )}
            <View style={styles.cardContainer}>
                {persons.length > 0 && [...persons]
                    .map((person, index) => {
                        const isFirst = index === 0;
                        const dragHandlers = isFirst
                            ? panResponder.panHandlers
                            : {};

                        return (
                            <Card
                                key={person.id}
                                person={person}
                                isFirst={isFirst}
                                swipe={swipeValues.current[index]}
                                {...dragHandlers}
                            />
                        );
                    })
                    .reverse()}
            </View>
            <View style={styles.buttonContainer}>
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        disabled={isSwiping || isProcessing}
                        onPress={() => handleChoice('none')}
                    >
                        <Ionicons name="close" size={40} color={colors.none} />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={backPerson}
                        disabled={!lastProfil || isSwiping || isProcessing}
                    >
                        <Ionicons
                            name="reload"
                            size={40}
                            color={lastProfil ? colors.return : '#ccc'}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleChoice('like')}
                        disabled={isSwiping || isProcessing}
                    >
                        <Ionicons name="heart" size={40} color={colors.love} />
                    </TouchableOpacity>
                </View>
            </View>
            {showMatch && (
                <Animated.View style={[styles.matchOverlay, {
                    opacity: matchAnimation
                }]}>
                    <Animated.View style={[styles.matchContent, {
                        transform: [{
                            scale: matchAnimation.interpolate({
                                inputRange: [0, 1],
                                outputRange: [0.8, 1]
                            })
                        }]
                    }]}>
                        <View style={styles.matchImagesContainer}>
                            <Image 
                                source={{ uri: auth?.photos[0] }}
                                style={styles.matchImage}
                            />
                            <View style={styles.matchIconContainer}>
                                <Ionicons name="heart" size={40} color={colors.love} />
                            </View>
                            <Image 
                                source={{ uri: matchedPerson?.photos[0] }}
                                style={styles.matchImage}
                            />
                        </View>
                        <Text style={styles.matchText}>
                            C'est un match !
                        </Text>
                        <Text style={styles.matchSubtext}>
                            {auth?.firstname} et {matchedPerson?.name} vous êtes connectés
                        </Text>
                        <TouchableOpacity style={styles.matchButton} onPress={() => {
                            router.push({
                                pathname: '/conversations',
                                params: { 
                                    id: matchedPerson?.id,
                                    name: matchedPerson?.name,
                                    avatar: matchedPerson?.photos[0]
                                }
                            });
                        }}>
                            <Text style={styles.matchButtonText}>Envoyer un message</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={styles.closeButton}
                            onPress={() => setShowMatch(false)}
                        >
                            <Ionicons name="close" size={24} color="white" />
                        </TouchableOpacity>
                    </Animated.View>
                </Animated.View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: 'white',
        gap: 16,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 50,
    },
    cardContainer: {
        height: 600,
        marginHorizontal: 24,
        position: 'relative',
    },
    buttonContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
    },
    button: {
        backgroundColor: 'white',
        borderRadius: 9999,
        padding: 16,
    },
    matchOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 999,
    },
    matchContent: {
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 30,
        width: '80%',
    },
    matchImagesContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    matchImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    matchIconContainer: {
        marginHorizontal: 20,
    },
    matchText: {
        fontSize: 28,
        fontWeight: 'bold',
        color: colors.primary,
        marginBottom: 10,
        fontFamily: 'Onest',
    },
    matchSubtext: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        fontFamily: 'Onest',
        marginBottom: 20,
    },
    matchButton: {
        backgroundColor: colors.primary,
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 25,
    },
    matchButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
    },
});
