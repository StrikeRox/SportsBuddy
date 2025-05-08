import { colors } from '@/constants/color';
import { peoples } from '@/data/peoples';
import { useAuthStore } from '@/stores/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Modèle de données pour les conversations
type Conversation = {
    id: number;
    user: {
        name: string;
        img: string;
        certified?: boolean;
    };
    lastMessage: string;
    time: string;
    unread: number;
};

export default function message() {
    const { auth } = useAuthStore();
    const router = useRouter();

    // Utilisation des "peoples" pour simuler les derniers matchs
    const recentMatches = peoples.slice(0, 5);

    // Conversations fictives pour la démonstration
    const [conversations, setConversations] = useState<Conversation[]>([
        {
            id: 1,
            user: {
                name: peoples[0].name,
                img: peoples[0].img,
                certified: peoples[0].isCertified,
            },
            lastMessage: "Salut, tu vas à la salle aujourd'hui ?",
            time: '14:32',
            unread: 2,
        },
        {
            id: 2,
            user: {
                name: peoples[1].name,
                img: peoples[1].img,
                certified: peoples[1].isCertified,
            },
            lastMessage: "J'ai adoré notre session de tennis hier !",
            time: '12:05',
            unread: 0,
        },
        {
            id: 3,
            user: {
                name: peoples[2].name,
                img: peoples[2].img,
                certified: peoples[2].isCertified,
            },
            lastMessage: 'On se retrouve comme prévu à 18h au parc ?',
            time: 'Hier',
            unread: 1,
        },
        {
            id: 4,
            user: {
                name: peoples[3].name,
                img: peoples[3].img,
                certified: peoples[3].isCertified,
            },
            lastMessage: 'Je ne pourrai pas venir à la boxe demain, désolé !',
            time: 'Hier',
            unread: 0,
        },
        {
            id: 5,
            user: {
                name: peoples[4].name,
                img: peoples[4].img,
                certified: peoples[4].isCertified,
            },
            lastMessage:
                "Merci pour tes conseils sur le stretching, ça m'a beaucoup aidé.",
            time: 'Lun',
            unread: 0,
        },
    ]);

    // Fonction pour naviguer vers la conversation
    const navigateToConversation = (conversation: Conversation) => {
        // Marquer comme lu
        if (conversation.unread > 0) {
            setConversations(prev => 
                prev.map(conv => 
                    conv.id === conversation.id 
                    ? { ...conv, unread: 0 } 
                    : conv
                )
            );
        }
        
        // Naviguer vers la page de détail
        router.push({
            pathname: '/conversations',
            params: { 
                id: conversation.id,
                name: conversation.user.name,
                avatar: conversation.user.img
            }
        });
    };

    // Fonction pour naviguer vers un profil depuis les matchs récents
    const navigateToProfile = (match: any) => {
        // Créer une nouvelle conversation ou naviguez vers une existante
        const existingConversation = conversations.find(
            conv => conv.user.name === match.name
        );
        
        if (existingConversation) {
            navigateToConversation(existingConversation);
        } else {
            // Créer une nouvelle conversation
            const newConversation: Conversation = {
                id: Date.now(),
                user: {
                    name: match.name,
                    img: match.img,
                    certified: match.isCertified,
                },
                lastMessage: 'Vous avez matché! Commencez à discuter.',
                time: 'Maintenant',
                unread: 0,
            };
            
            setConversations(prev => [newConversation, ...prev]);
            navigateToConversation(newConversation);
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" />
            {/* En-tête */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>
                    Messages
                </Text>
            </View>

            {/* Section des derniers matchs */}
            <View style={styles.matchesSection}>
                <View style={styles.matchesHeader}>
                    <Text style={styles.matchesTitle}>
                        Nouveaux matchs
                    </Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAllText}>
                            Voir tout
                        </Text>
                    </TouchableOpacity>
                </View>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.matchesScrollView}
                >
                    {recentMatches.map((match, index) => (
                        <TouchableOpacity
                            key={index}
                            style={styles.matchItem}
                            onPress={() => navigateToProfile(match)}
                        >
                            <View
                                style={[
                                    styles.matchImageContainer,
                                    { borderColor: match.isCertified ? colors.primary : 'white' }
                                ]}
                            >
                                <Image
                                    source={{ uri: match.img }}
                                    style={styles.matchImage}
                                />
                            </View>
                            <Text style={styles.matchName}>
                                {match.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Liste des conversations */}
            <FlatList
                data={conversations}
                keyExtractor={item => item.id.toString()}
                style={styles.conversationsList}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        style={styles.conversationItem}
                        onPress={() => navigateToConversation(item)}
                    >
                        <View style={styles.avatarContainer}>
                            <Image
                                source={{ uri: item.user.img }}
                                style={styles.avatar}
                            />
                            {item.user.certified && (
                                <View style={styles.certifiedBadge}>
                                    <Image
                                        source={require('@/assets/images/certified.png')}
                                        style={styles.certifiedIcon}
                                    />
                                </View>
                            )}
                        </View>

                        <View style={styles.conversationContent}>
                            <View style={styles.conversationHeader}>
                                <Text style={styles.userName}>
                                    {item.user.name}
                                </Text>
                                <Text style={styles.messageTime}>
                                    {item.time}
                                </Text>
                            </View>

                            <View style={styles.messagePreview}>
                                <Text
                                    style={[
                                        styles.lastMessage,
                                        item.unread > 0 && styles.unreadMessage
                                    ]}
                                    numberOfLines={1}
                                    ellipsizeMode="tail"
                                >
                                    {item.lastMessage}
                                </Text>

                                {item.unread > 0 && (
                                    <View style={styles.unreadBadge}>
                                        <Text style={styles.unreadCount}>
                                            {item.unread}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
                ListEmptyComponent={
                    <View style={styles.emptyListContainer}>
                        <Ionicons
                            name="chatbubbles-outline"
                            size={60}
                            color={colors.primary}
                        />
                        <Text style={styles.emptyListTitle}>
                            Aucune conversation
                        </Text>
                        <Text style={styles.emptyListSubtitle}>
                            Commencez à discuter avec vos matchs sportifs
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
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Onest',
    },
    matchesSection: {
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    matchesHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 8,
    },
    matchesTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Onest',
    },
    seeAllText: {
        fontSize: 16,
        color: colors.primary,
        fontFamily: 'Onest',
    },
    matchesScrollView: {
        paddingHorizontal: 12,
    },
    matchItem: {
        alignItems: 'center',
        marginHorizontal: 8,
    },
    matchImageContainer: {
        borderWidth: 2,
        borderRadius: 9999,
    },
    matchImage: {
        height: 64,
        width: 64,
        borderRadius: 32,
    },
    matchName: {
        fontSize: 14,
        marginTop: 4,
        color: '#333',
        fontFamily: 'Onest',
    },
    conversationsList: {
        flex: 1,
    },
    conversationItem: {
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        height: 56,
        width: 56,
        borderRadius: 28,
    },
    certifiedBadge: {
        position: 'absolute',
        bottom: -4,
        right: -4,
        backgroundColor: 'white',
        borderRadius: 9999,
        padding: 2,
    },
    certifiedIcon: {
        width: 16,
        height: 16,
    },
    conversationContent: {
        flex: 1,
        marginLeft: 12,
        justifyContent: 'center',
    },
    conversationHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userName: {
        fontWeight: 'bold',
        color: 'black',
        fontFamily: 'Onest',
    },
    messageTime: {
        fontSize: 12,
        color: '#888',
        fontFamily: 'Onest',
    },
    messagePreview: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    lastMessage: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Onest',
    },
    unreadMessage: {
        color: 'black',
        fontWeight: '500',
    },
    unreadBadge: {
        backgroundColor: colors.primary,
        borderRadius: 9999,
        height: 20,
        width: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    unreadCount: {
        color: 'white',
        fontSize: 12,
        fontFamily: 'Onest',
    },
    emptyListContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    emptyListTitle: {
        fontSize: 20,
        marginTop: 16,
        color: '#666',
        textAlign: 'center',
        fontFamily: 'Onest',
    },
    emptyListSubtitle: {
        fontSize: 16,
        marginTop: 8,
        color: '#888',
        textAlign: 'center',
        paddingHorizontal: 40,
        fontFamily: 'Onest',
    },
});
