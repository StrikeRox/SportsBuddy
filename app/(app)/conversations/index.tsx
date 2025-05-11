import { colors } from '@/constants/color';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
    Animated,
    FlatList,
    Image,
    KeyboardAvoidingView,
    Modal,
    Platform,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

type Message = {
    id: string;
    text: string;
    senderId: string;
    timestamp: string;
};

type Action = {
    icon: string;
    label: string;
    onPress: () => void;
};

export default function ConversationDetail() {
    const router = useRouter();
    const { name, avatar } = useLocalSearchParams();
    const [newMessage, setNewMessage] = useState('');
    const [menuVisible, setMenuVisible] = useState(false);
    const menuAnimation = useRef(new Animated.Value(0)).current;
    
    // Exemple de messages (normalement chargés depuis une base de données)
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Salut, comment vas-tu?',
            senderId: 'other',
            timestamp: '10:03'
        },
        {
            id: '2',
            text: 'Je vais bien, merci! Tu joues au foot demain?',
            senderId: 'me',
            timestamp: '10:05'
        },
        {
            id: '3',
            text: 'Oui, au parc à 15h. Tu veux venir?',
            senderId: 'other',
            timestamp: '10:10'
        },
        {
            id: '4',
            text: 'Bien sûr! Je serai là avec mon équipement.',
            senderId: 'me',
            timestamp: '10:12'
        },
        {
            id: '5',
            text: 'Super! On sera environ 10 personnes.',
            senderId: 'other',
            timestamp: '10:15'
        },
        {
            id: '6',
            text: "Je peux amener quelques boissons?",
            senderId: 'me',
            timestamp: '10:18'
        },
        {
            id: '7',
            text: "Ce serait parfait! À demain alors.",
            senderId: 'other',
            timestamp: '10:20'
        }
    ]);

    // Actions disponibles pour le menu
    const actions: Action[] = [
        {
            icon: 'person-outline',
            label: 'Voir le profil',
            onPress: () => {
                setMenuVisible(false);
                // Navigation vers le profil
            }
        },
        {
            icon: 'trash-outline',
            label: 'Supprimer la conversation',
            onPress: () => {
                setMenuVisible(false);
                // Logique de suppression
            }
        },
        {
            icon: 'alert-circle-outline',
            label: 'Signaler',
            onPress: () => {
                setMenuVisible(false);
                // Logique de signalement
            }
        }
    ];

    const toggleMenu = () => {
        if (menuVisible) {
            // Animation de fermeture
            Animated.timing(menuAnimation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true
            }).start(() => setMenuVisible(false));
        } else {
            setMenuVisible(true);
            // Animation d'ouverture
            Animated.timing(menuAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true
            }).start();
        }
    };

    const sendMessage = () => {
        if (newMessage.trim() === '') return;
        
        const message: Message = {
            id: Date.now().toString(),
            text: newMessage,
            senderId: 'me',
            timestamp: new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
        };
        
        setMessages([...messages, message]);
        setNewMessage('');
    };

    // Rendu d'une bulle de message
    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.senderId === 'me';
        
        return (
            <View style={[styles.messageContainer, isMe ? styles.messageContainerRight : styles.messageContainerLeft]}>
                {!isMe && (
                    <Image 
                        source={{ uri: avatar as string || 'https://via.placeholder.com/40' }}
                        style={styles.avatar}
                    />
                )}
                <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleOther]}>
                    <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextOther]}>
                        {item.text}
                    </Text>
                    <Text style={[styles.messageTimestamp, isMe ? styles.messageTimestampMe : styles.messageTimestampOther]}>
                        {item.timestamp}
                    </Text>
                </View>
            </View>
        );
    };

    const renderActionItem = (action: Action, index: number) => (
        <TouchableOpacity 
            key={index}
            style={styles.actionItem}
            onPress={action.onPress}
        >
            <Ionicons name={action.icon as any} size={22} color={colors.primary} />
            <Text style={styles.actionText}>
                {action.label}
            </Text>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* En-tête */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="black" />
                </TouchableOpacity>
                <Image 
                    source={{ uri: avatar as string || 'https://via.placeholder.com/40' }}
                    style={styles.headerAvatar}
                />
                <View style={styles.headerInfo}>
                    <Text style={styles.headerName}>
                        {name || 'Contact'}
                    </Text>
                    <Text style={styles.headerStatus}>
                        En ligne
                    </Text>
                </View>
                
                {/* Icône d'information */}
                <TouchableOpacity style={styles.menuButton} onPress={toggleMenu}>
                    <Ionicons name="ellipsis-vertical" size={24} color={colors.primary} />
                </TouchableOpacity>
            </View>

            {/* Menu d'actions */}
            <Modal
                visible={menuVisible}
                transparent={true}
                animationType="none"
                onRequestClose={() => toggleMenu()}
            >
                <TouchableOpacity 
                    style={styles.modalOverlay}
                    activeOpacity={1}
                    onPress={() => toggleMenu()}
                >
                    <Animated.View 
                        style={[
                            styles.menuContainer,
                            {
                                opacity: menuAnimation,
                                transform: [{ 
                                    translateY: menuAnimation.interpolate({
                                        inputRange: [0, 1],
                                        outputRange: [-20, 0]
                                    })
                                }]
                            }
                        ]}
                    >
                        {actions.map(renderActionItem)}
                    </Animated.View>
                </TouchableOpacity>
            </Modal>

            {/* Liste des messages */}
            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardAvoidingView}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
            >
                <FlatList
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={item => item.id}
                    style={styles.messageList}
                    showsVerticalScrollIndicator={false}
                    inverted={false}
                    contentContainerStyle={styles.messageListContent}
                />

                {/* Zone de saisie */}
                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.addButton}>
                        <Ionicons name="add-circle-outline" size={24} color="gray" />
                    </TouchableOpacity>
                    <TextInput
                        value={newMessage}
                        onChangeText={setNewMessage}
                        placeholder="Écrivez un message..."
                        style={styles.input}
                        multiline
                    />
                    <TouchableOpacity 
                        onPress={sendMessage}
                        disabled={newMessage.trim() === ''}
                        style={[styles.sendButton, newMessage.trim() === '' && styles.sendButtonDisabled]}
                    >
                        <Ionicons 
                            name="send" 
                            size={24} 
                            color={colors.primary} 
                        />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
        padding: 8,
    },
    backButton: {
        padding: 8,
    },
    headerAvatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
        marginHorizontal: 8,
    },
    headerInfo: {
        flex: 1,
    },
    headerName: {
        fontWeight: 'bold',
        fontSize: 18,
        fontFamily: 'Onest',
    },
    headerStatus: {
        color: 'green',
        fontSize: 12,
        fontFamily: 'Onest',
    },
    menuButton: {
        padding: 8,
    },
    modalOverlay: {
        flex: 1,
    },
    menuContainer: {
        position: 'absolute',
        right: 8,
        top: 64,
        backgroundColor: 'white',
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        width: 256,
        overflow: 'hidden',
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e0e0e0',
    },
    actionText: {
        marginLeft: 12,
        fontSize: 16,
        fontFamily: 'Onest',
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    messageList: {
        flex: 1,
        paddingTop: 8,
    },
    messageListContent: {
        paddingBottom: 10,
    },
    messageContainer: {
        flexDirection: 'row',
        marginVertical: 4,
        paddingHorizontal: 8,
    },
    messageContainerLeft: {
        justifyContent: 'flex-start',
    },
    messageContainerRight: {
        justifyContent: 'flex-end',
    },
    avatar: {
        height: 32,
        width: 32,
        borderRadius: 16,
        marginRight: 8,
        marginTop: 4,
    },
    messageBubble: {
        maxWidth: '80%',
        borderRadius: 16,
        paddingHorizontal: 12,
        paddingVertical: 8,
    },
    messageBubbleMe: {
        backgroundColor: colors.primary,
    },
    messageBubbleOther: {
        backgroundColor: '#e0e0e0',
    },
    messageText: {
        fontFamily: 'Onest',
    },
    messageTextMe: {
        color: 'white',
    },
    messageTextOther: {
        color: 'black',
    },
    messageTimestamp: {
        fontSize: 10,
        marginTop: 4,
        textAlign: 'right',
    },
    messageTimestampMe: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    messageTimestampOther: {
        color: 'rgba(0, 0, 0, 0.5)',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: '#e0e0e0',
        padding: 8,
        backgroundColor: 'white',
    },
    addButton: {
        padding: 8,
    },
    input: {
        flex: 1,
        backgroundColor: '#f0f0f0',
        borderRadius: 20,
        paddingHorizontal: 16,
        paddingVertical: 8,
        marginHorizontal: 8,
        fontFamily: 'Onest',
    },
    sendButton: {
        padding: 8,
        borderRadius: 20,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
});