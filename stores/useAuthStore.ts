import { Auth } from '@/types/Auth';
import { router } from 'expo-router';
import { create } from 'zustand';


interface UserStore {
    loading: boolean;
    auth: Auth | null;
    updateAuth: (newAuth: Auth) => void;

    signIn: (credentials: { email: string; password: string }) => void;
    signOut: () => void;
}

export const useAuthStore = create<UserStore>(set => ({
    loading: false,
    auth: null,
    updateAuth: (newAuth) => set({ auth: newAuth }),

    async signIn(credentials) {
        try {
            const user = {
                id: 1,
                email: credentials.email,
                firstname: 'Anastasia',
                bio: "J'aimerais faire de nouvelles connaissances pour pouvoir pratiquer du sport en groupe",
                birthdate: '1995-05-27',
                sports: ['boxe', 'tennis', 'basket'],
                photos: ['https://images.unsplash.com/photo-1639564166502-e6b287fbb0ec?q=80&w=3687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'],
                showGender: 'all',
            };

            set(() => ({ auth: user }));
            router.replace('/');
        } catch (e) {
            console.log('error:', e);
        }
    },
    signOut() {
        set(() => ({ auth: null }));
    },
}));
