import { Profil } from '@/types/Profil';
import { create } from 'zustand';

interface MatchStore {
    listLikes: number[];

    matches: Profil[];
    addMatch: (person: Profil) => void;
    removeMatch: (id: number) => void;
    clearMatches: () => void;
}

export const useMatchStore = create<MatchStore>((set) => ({
    listLikes: [1,2,3,4,5,6,7,8,9,10],
    matches: [],
    
    addMatch: (person) => set((state) => ({ 
        matches: [...state.matches, person]
    })),

    removeMatch: (id) => set((state) => ({
        matches: state.matches.filter((match) => match.id !== id)
    })),

    clearMatches: () => set({ matches: [] })
}));
