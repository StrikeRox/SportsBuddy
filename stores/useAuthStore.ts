import { Auth } from '@/types/Auth';
import { router } from 'expo-router';
import { create } from 'zustand';

interface UserStore {
    loading: boolean;
    auth: Auth | null;

    signIn: (credentials: { email: string; password: string }) => void;
    signOut: () => void;
}

export const useAuthStore = create<UserStore>(set => ({
    loading: false,
    auth: null,

    async signIn(credentials) {
        try {
            const user = {
                id: 1,
                email: credentials.email,
                firstname: 'Yana',
                bio: "J'adore la boxe et casser des culs, je travaille au McDo, c'est trop bien je kiffe ma vie.",
                birthdate: '1995-05-27',
                sports: ['Boxe', 'Tennis', 'Basket'],
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
