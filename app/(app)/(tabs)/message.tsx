import { colors } from '@/constants/color';
import { useMatchStore } from '@/stores/useMatchStores';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

// Modèle de données pour les conversations
type Conversation = {
    id: number;
    user: {
        id: string;
        name: string;
        img: string;
        certified?: boolean;
    };
    lastMessage: string;
    time: string;
    unread: number;
};

export default function Message() {
    const router = useRouter();
    const { matches } = useMatchStore();
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        // Convertir les matchs en conversations
        const newConversations = matches.map((match, index) => ({
            id: index + 1,
            user: {
                id: match.id.toString(),
                name: match.name,
                img: match.photos[0],
                certified: match.isCertified,
            },
            lastMessage: "Vous avez matché ! Commencez à discuter.",
            time: 'Nouveau',
            unread: 1,
        }));
        setConversations(newConversations);
    }, [matches]);

    const navigateToConversation = (conversation: Conversation) => {
        // Marquer comme lu
        setConversations(prev => 
            prev.map(conv => 
                conv.id === conversation.id 
                ? { ...conv, unread: 0 } 
                : conv
            )
        );
        
        router.push({
            pathname: '/conversations',
            params: { 
                id: conversation.user.id,
                name: conversation.user.name,
                avatar: conversation.user.img
            }
        });
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Messages</Text>
            </View>

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
                                <Text style={styles.userName}>{item.user.name}</Text>
                                <Text style={styles.messageTime}>{item.time}</Text>
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
                                        <Text style={styles.unreadCount}>{item.unread}</Text>
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
                            Commencez à matcher pour discuter avec vos partenaires sportifs
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
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e5e5e5',
    },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'black',
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
