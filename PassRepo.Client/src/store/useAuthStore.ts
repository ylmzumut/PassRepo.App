import { create } from 'zustand';

interface User {
    id: string;
    email: string;
}

interface AuthState {
    user: User | null;
    encryptionKey: Uint8Array | null;
    authKey: string | null;
    isAuthenticated: boolean;
    setAuth: (user: User, encryptionKey: Uint8Array, authKey: string) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    encryptionKey: null,
    authKey: null,
    isAuthenticated: false,
    setAuth: (user, encryptionKey, authKey) => set({ user, encryptionKey, authKey, isAuthenticated: true }),
    logout: () => set({ user: null, encryptionKey: null, authKey: null, isAuthenticated: false }),
}));
