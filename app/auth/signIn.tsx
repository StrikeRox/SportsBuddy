import Input from '@/components/Input';
import { colors } from '@/constants/color';
import { useAuthStore } from '@/stores/useAuthStore';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import React, { useCallback, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

// Type pour les boutons sociaux
type SocialButtonProps = {
    icon: any;
    text: string;
    onPress: () => void;
};

// Composant mémorisé pour les boutons sociaux
const SocialButton = React.memo(({ icon, text, onPress }: SocialButtonProps) => (
    <TouchableOpacity 
        style={styles.socialButton}
        onPress={onPress}
    >
        <Image
            source={icon}
            style={styles.socialButtonIcon}
            resizeMode="contain"
        />
        <Text style={styles.socialButtonText}>
            {text}
        </Text>
    </TouchableOpacity>
));

export default function SignInScreen() {
    const { signIn, loading } = useAuthStore();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({ email: '', password: '' });
    const [rememberMe, setRememberMe] = useState(false);

    // Validation du formulaire
    const validateForm = useCallback(() => {
        let isValid = true;
        const newErrors = { email: '', password: '' };
        
        // if (!email) {
        //     newErrors.email = 'L\'email est requis';
        //     isValid = false;
        // } else if (!/\S+@\S+\.\S+/.test(email)) {
        //     newErrors.email = 'Format d\'email invalide';
        //     isValid = false;
        // }
        
        // if (!password) {
        //     newErrors.password = 'Le mot de passe est requis';
        //     isValid = false;
        // } else if (password.length < 6) {
        //     newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
        //     isValid = false;
        // }
        
        setErrors(newErrors);
        return isValid;
    }, [email, password]);

    // Gestion de la connexion
    const handleSignIn = useCallback(() => {
        if (validateForm()) {
            // @ts-ignore - Ajout de rememberMe qui n'est pas dans le type attendu
            signIn({ email, password, rememberMe });
        }
    }, [email, password, rememberMe, signIn, validateForm]);

    // Gestion de la connexion sociale
    const handleSocialSignIn = useCallback((provider: string) => {
        Alert.alert(
            "Connexion avec " + provider,
            "Cette fonctionnalité sera bientôt disponible",
            [{ text: "OK" }]
        );
    }, []);

    // Gestion du mot de passe oublié
    const handleForgotPassword = useCallback(() => {
        Alert.alert(
            "Mot de passe oublié",
            "Un email de réinitialisation sera envoyé à votre adresse email",
            [{ text: "OK" }]
        );
    }, []);

    return (
        <View style={styles.container}>
            <ScrollView 
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.content}>
                    {/* Header avec dégradé */}
                    <View style={styles.header}>
                        <View style={styles.logoContainer}>
                            <Ionicons
                                name="football-outline"
                                size={60}
                                color={colors.primary}
                            />
                        </View>
                        <Text style={styles.title}>SportBuddy</Text>
                        <Text style={styles.subtitle}>Trouvez votre partenaire sportif</Text>
                    </View>

                    {/* Formulaire de connexion */}
                    <View style={styles.formContainer}>
                        <View style={styles.form}>
                            <Text style={styles.formTitle}>
                                Connexion
                            </Text>
                            
                            {/* Champs de saisie */}
                            <View style={styles.inputContainer}>
                                <View>
                                    <Input 
                                        placeholder="Email" 
                                        value={email} 
                                        onChangeText={setEmail} 
                                        leftIcon={<Ionicons name="mail-outline" size={20} color="#9CA3AF" />}
                                        // @ts-ignore - Propriétés non reconnues par le type Input
                                        accessibilityLabel="Champ email"
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                    />
                                    {errors.email ? (
                                        <Text style={styles.errorText}>
                                            {errors.email}
                                        </Text>
                                    ) : null}
                                </View>
                                
                                <View>
                                    <Input 
                                        placeholder="Mot de passe" 
                                        value={password} 
                                        onChangeText={setPassword} 
                                        secureTextEntry 
                                        leftIcon={<Ionicons name="lock-closed-outline" size={20} color="#9CA3AF" />}
                                        // @ts-ignore - Propriétés non reconnues par le type Input
                                        accessibilityLabel="Champ mot de passe"
                                    />
                                    {errors.password ? (
                                        <Text style={styles.errorText}>
                                            {errors.password}
                                        </Text>
                                    ) : null}
                                </View>
                            </View>

                            {/* Options de connexion */}
                            <View style={styles.optionsContainer}>
                                <TouchableOpacity 
                                    style={styles.rememberMeContainer}
                                    onPress={() => setRememberMe(!rememberMe)}
                                >
                                    <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                        {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
                                    </View>
                                    <Text style={styles.rememberMeText}>
                                        Se souvenir de moi
                                    </Text>
                                </TouchableOpacity>
                                
                                <TouchableOpacity onPress={handleForgotPassword}>
                                    <Text style={styles.forgotPasswordText}>
                                        Mot de passe oublié ?
                                    </Text>
                                </TouchableOpacity>
                            </View>

                            {/* Bouton de connexion */}
                            <TouchableOpacity
                                onPress={handleSignIn}
                                disabled={loading}
                                style={[styles.signInButton, loading && styles.signInButtonDisabled]}
                                accessibilityLabel="Bouton de connexion"
                            >
                                {loading ? (
                                    <ActivityIndicator color="white" />
                                ) : (
                                    <Text style={styles.signInButtonText}>
                                        Se connecter
                                    </Text>
                                )}
                            </TouchableOpacity>

                            {/* Séparateur */}
                            <View style={styles.separator}>
                                <View style={styles.separatorLine}></View>
                                <Text style={styles.separatorText}>ou</Text>
                                <View style={styles.separatorLine}></View>
                            </View>

                            {/* Connexion sociale */}
                            <View style={styles.socialButtonsContainer}>
                                <SocialButton 
                                    icon={require('@/assets/logo/google.png')}
                                    text="Google"
                                    onPress={() => handleSocialSignIn('Google')}
                                />
                                <SocialButton 
                                    icon={require('@/assets/logo/apple.png')}
                                    text="Apple"
                                    onPress={() => handleSocialSignIn('Apple')}
                                />
                            </View>

                            {/* Création de compte */}
                            <View style={styles.createAccountContainer}>
                                <Text style={styles.createAccountText}>
                                    Vous n'avez pas encore de compte ?
                                </Text>
                                <Link href="/auth/createAccount" asChild>
                                    <TouchableOpacity>
                                        <Text style={styles.createAccountLink}>
                                            Créer un compte
                                        </Text>
                                    </TouchableOpacity>
                                </Link>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    content: {
        flex: 1,
        marginTop: 40,
    },
    header: {
        alignItems: 'center',
        marginTop: 40,
        marginBottom: 32,
    },
    logoContainer: {
        width: 96,
        height: 96,
        borderRadius: 48,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 5,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 16,
        color: colors.primary,
        fontFamily: 'Onest',
    },
    subtitle: {
        fontSize: 16,
        marginTop: 8,
        color: '#666',
        fontFamily: 'Onest',
    },
    formContainer: {
        paddingHorizontal: 24,
    },
    form: {
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    formTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#1F2937',
        marginBottom: 24,
        fontFamily: 'Onest',
    },
    inputContainer: {
        marginBottom: 16,
    },
    errorText: {
        color: '#EF4444',
        fontSize: 14,
        marginTop: 4,
        fontFamily: 'Onest',
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 16,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 20,
        height: 20,
        borderRadius: 4,
        borderWidth: 1,
        borderColor: 'gray',
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkboxChecked: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    rememberMeText: {
        fontSize: 14,
        color: '#666',
        fontFamily: 'Onest',
    },
    forgotPasswordText: {
        fontSize: 14,
        color: colors.primary,
        fontFamily: 'Onest',
    },
    signInButton: {
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        backgroundColor: colors.primary,
        shadowColor: colors.primary,
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 5,
    },
    signInButtonDisabled: {
        backgroundColor: '#666',
    },
    signInButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        fontFamily: 'Onest',
    },
    separator: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    separatorLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E5E7EB',
    },
    separatorText: {
        marginHorizontal: 12,
        color: '#6B7280',
        fontFamily: 'Onest',
    },
    socialButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    socialButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 12,
        paddingVertical: 12,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: '#E5E7EB',
    },
    socialButtonIcon: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    socialButtonText: {
        fontSize: 16,
        color: '#333',
        fontFamily: 'Onest',
    },
    createAccountContainer: {
        alignItems: 'center',
        marginTop: 16,
    },
    createAccountText: {
        fontSize: 16,
        color: '#666',
        fontFamily: 'Onest',
    },
    createAccountLink: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 4,
        color: colors.primary,
        fontFamily: 'Onest',
    },
});
