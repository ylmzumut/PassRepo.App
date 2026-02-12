import { create } from 'zustand';
import api from '../services/ApiService';
import type { Category } from '../types';

interface CategoryState {
    categories: Category[];
    isLoading: boolean;
    fetchCategories: () => Promise<void>;
    addCategory: (cat: Omit<Category, 'id'>) => Promise<void>;
    removeCategory: (id: string) => Promise<void>;
}

// GÜNCELLEME: Varsayılan liste artık BOŞ
const DEFAULT_CATEGORIES: Category[] = [];

export const useCategoryStore = create<CategoryState>((set, get) => ({
    categories: DEFAULT_CATEGORIES,
    isLoading: false,

    fetchCategories: async () => {
        set({ isLoading: true });
        try {
            const res = await api.get('/categories');
            const serverCats = res.data;
            // Varsayılan yok, sadece sunucudan geleni koyuyoruz
            set({ categories: serverCats });
        } catch (error) {
            console.error("Kategoriler yüklenemedi", error);
        } finally {
            set({ isLoading: false });
        }
    },

    addCategory: async (cat) => {
        try {
            const res = await api.post('/categories', cat);
            const newCat = res.data;
            set((state) => ({ categories: [...state.categories, newCat] }));
        } catch (error) {
            console.error("Kategori eklenemedi", error);
            throw error;
        }
    },

    removeCategory: async (id) => {
        try {
            await api.delete(`/categories/${id}`);
            set((state) => ({
                categories: state.categories.filter((c) => c.id !== id)
            }));
        } catch (error) {
            console.error("Silme hatası", error);
        }
    }
}));