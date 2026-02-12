import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Category } from '../types';

interface CategoryState {
    categories: Category[];
    addCategory: (category: Category) => void;
    removeCategory: (id: string) => void;
}

// Varsayılan Kategoriler
const DEFAULT_CATEGORIES: Category[] = [
    { id: '1', name: 'Banka', iconName: 'Landmark', color: 'bg-blue-600' },
    { id: '2', name: 'Mail', iconName: 'Mail', color: 'bg-red-500' },
    { id: '3', name: 'Sosyal', iconName: 'Share2', color: 'bg-sky-500' },
    { id: '4', name: 'İş', iconName: 'Briefcase', color: 'bg-orange-500' },
    { id: '5', name: 'Genel', iconName: 'Key', color: 'bg-emerald-500' },
];

export const useCategoryStore = create<CategoryState>()(
    persist(
        (set) => ({
            categories: DEFAULT_CATEGORIES,
            addCategory: (cat) => set((state) => ({ categories: [...state.categories, cat] })),
            removeCategory: (id) => set((state) => ({
                categories: state.categories.filter((c) => c.id !== id)
            })),
        }),
        {
            name: 'passrepo-categories', // LocalStorage'da bu isimle saklanacak
        }
    )
);