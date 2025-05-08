import { colors } from '@/constants/color';
import { Profil } from '@/types/Profil';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback } from 'react';
import { Animated, ImageBackground, StyleSheet, Text, View } from 'react-native';
import ChoiceText from './ChoiceText';

type CardProps = {
    person: Profil;
    position: number;
    isFirst: boolean;
    swipe: Animated.ValueXY;
};

export default function Card({
    person,
    position,
    isFirst,
    swipe,
    ...rest
}: CardProps) {
    const rotate = swipe.x.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: ['-8deg', '0deg', '8deg'],
    });

    const animatedCardStyle = {
        transform: [...swipe.getTranslateTransform(), { rotate }],
    };

    const likeOpacity = swipe.x.interpolate({
        inputRange: [25, 100],
        outputRange: [0, 1],
        extrapolate: 'clamp',
    });

    const noneOpacity = swipe.x.interpolate({
        inputRange: [-100, -25],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const renderChoice = useCallback(() => {
        return (
            <>
                <Animated.View
                    style={[styles.choiceContainer, styles.likeChoice, { opacity: likeOpacity }]}
                >
                    <ChoiceText type="like" />
                </Animated.View>
                <Animated.View
                    style={[styles.choiceContainer, styles.noneChoice, { opacity: noneOpacity }]}
                >
                    <ChoiceText type="none" />
                </Animated.View>
            </>
        );
    }, []);

    return (
        <Animated.View
            style={[
                styles.card,
                isFirst && animatedCardStyle,
                styles.cardShadow
            ]}
            {...rest}
        >
            <ImageBackground
                source={{ uri: person.img }}
                style={styles.backgroundImage}
                resizeMode="cover"
            >
                {renderChoice()}
                <LinearGradient
                    colors={['transparent', 'rgba(0,0,0,0.9)']}
                    style={styles.gradient}
                >
                    <View style={styles.infoContainer}>
                        <View style={styles.nameAgeContainer}>
                            <View style={styles.nameAge}>
                                <Text style={styles.name}>{person.name}</Text>
                                <Text style={styles.age}>, {person.age} ans</Text>
                            </View>
                            {person.isCertified && (
                                <View style={styles.certifiedBadge}>
                                    <Text style={styles.certifiedText}>
                                        Certifié
                                    </Text>
                                </View>
                            )}
                        </View>

                        {person.sports && person.sports.length > 0 && (
                            <View style={styles.sportsContainer}>
                                {person.sports.map((sport, index) => (
                                    <View key={index} style={styles.sportBadge}>
                                        <Text style={styles.sportText}>
                                            {sport}
                                        </Text>
                                    </View>
                                ))}
                            </View>
                        )}
                    </View>
                </LinearGradient>
            </ImageBackground>
        </Animated.View>
    );
}

const styles = StyleSheet.create({
    card: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        borderRadius: 12,
        overflow: 'hidden',
    },
    cardShadow: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    backgroundImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'flex-end',
    },
    choiceContainer: {
        position: 'absolute',
        top: 96,
    },
    likeChoice: {
        left: 64,
    },
    noneChoice: {
        right: 64,
    },
    gradient: {
        position: 'relative',
        bottom: 0,
        left: 0,
        right: 0,
        height: 180,
    },
    infoContainer: {
        position: 'absolute',
        bottom: 0,
        padding: 16,
    },
    nameAgeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
        gap: 8,
    },
    nameAge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        color: 'white',
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Onest',
    },
    age: {
        color: 'white',
        fontSize: 24,
        fontFamily: 'Onest',
    },
    certifiedBadge: {
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 9999,
        backgroundColor: colors.primary,
    },
    certifiedText: {
        color: 'white',
        fontSize: 12,
        fontWeight: '500',
        fontFamily: 'Onest',
    },
    sportsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 8,
    },
    sportBadge: {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 9999,
    },
    sportText: {
        color: 'white',
        fontSize: 14,
        fontFamily: 'Onest',
    },
});
