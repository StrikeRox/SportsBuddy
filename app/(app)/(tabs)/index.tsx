import Card from '@/components/Card';
import { colors } from '@/constants/color';
import { peoples } from '@/data/peoples';
import { Profil } from '@/types/Profil';
import { Ionicons } from '@expo/vector-icons';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ActivityIndicator,
    Animated,
    Dimensions,
    PanResponder,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function Index() {
    const [isLoading, setIsLoading] = useState(true);
    const [persons, setPersons] = useState<Profil[]>(peoples);
    const [lastProfil, setLastProfil] = useState<[Profil, string]>();

    useEffect(() => {
        setTimeout(() => {
            setIsLoading(false);
        }, 2000);
    }, []);

    useEffect(() => {
        if (persons.length === 0) {
            setIsLoading(true);
            setPersons(peoples);
            setTimeout(() => {
                setIsLoading(false);
            }, 2000);
        }
    }, [persons]);

    const swipeValues = useRef(
        persons.map(() => new Animated.ValueXY()),
    ).current;

    const removeTopCard = useCallback(() => {
        setPersons(prev => {
            setLastProfil([
                prev[0],
                Number(JSON.stringify(swipeValues[0].x)) > 0 ? 'like' : 'none',
            ]);
            swipeValues.shift();
            return prev.slice(1);
        });
    }, []);

    const backPerson = () => {
        if (lastProfil) {
            const newPerson = lastProfil[0];
            const newPersonPosition = new Animated.ValueXY({
                x: lastProfil[1] === 'like' ? SCREEN_WIDTH : -SCREEN_WIDTH,
                y: 0,
            });

            setPersons(prevPersons => [newPerson, ...prevPersons]);

            swipeValues.unshift(newPersonPosition);

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
            swipeValues[0]?.setValue({ x: dx, y: dy });
        },
        onPanResponderRelease: (_, { dx }) => {
            const direction = Math.sign(dx);
            const isSwiped = Math.abs(dx) > 150;

            if (isSwiped) {
                Animated.timing(swipeValues[0], {
                    toValue: {
                        x: direction * SCREEN_WIDTH * 1.5,
                        y: 0,
                    },
                    duration: 200,
                    useNativeDriver: true,
                }).start(removeTopCard);
            } else {
                Animated.spring(swipeValues[0], {
                    toValue: { x: 0, y: 0 },
                    useNativeDriver: true,
                }).start();
            }
        },
    });

    const handleChoice = useCallback(
        (direction: 'like' | 'none') => {
            Animated.timing(swipeValues[0].x, {
                toValue:
                    direction === 'like'
                        ? SCREEN_WIDTH * 1.5
                        : -SCREEN_WIDTH * 1.5,
                duration: 400,
                useNativeDriver: true,
            }).start(removeTopCard);
        },
        [removeTopCard, swipeValues[0].x],
    );

    return (
        <SafeAreaView style={styles.container}>
            {isLoading && (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text>Recherche de profils...</Text>
                </View>
            )}
            <View style={styles.cardContainer}>
                {[...persons]
                    .map((person, index) => {
                        const isFirst = index === 0;
                        const dragHandlers = isFirst
                            ? panResponder.panHandlers
                            : {};

                        return (
                            <Card
                                key={person.name}
                                person={person}
                                position={index}
                                isFirst={isFirst}
                                swipe={swipeValues[index]}
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
                        onPress={() => handleChoice('none')}
                    >
                        <Ionicons name="close" size={40} color={colors.none} />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={backPerson}
                        disabled={!lastProfil}
                    >
                        <Ionicons
                            name="reload"
                            size={40}
                            color={colors.return}
                        />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity
                        style={styles.button}
                        onPress={() => handleChoice('like')}
                    >
                        <Ionicons name="heart" size={40} color={colors.love} />
                    </TouchableOpacity>
                </View>
            </View>
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
});
