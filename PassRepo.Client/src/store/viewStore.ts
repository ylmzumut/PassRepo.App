import { create } from 'zustand';
import type { Category, VaultItem } from '../types';

type ViewMode = 'GRID' | 'CATEGORY_DETAIL' | 'SEARCH' | 'VAULT_DETAIL';

interface ViewState {
    currentView: ViewMode;
    selectedCategory: Category['name'] | null;
    selectedItem: VaultItem | null;
    searchQuery: string;

    // Actions
    selectCategory: (category: Category['name']) => void;
    selectItem: (item: VaultItem) => void;
    closeCategory: () => void;
    closeItem: () => void;
    setSearchQuery: (query: string) => void;
    startSearch: () => void;
    resetView: () => void;
}

export const useViewStore = create<ViewState>((set) => ({
    currentView: 'GRID',
    selectedCategory: null,
    selectedItem: null,
    searchQuery: '',

    selectCategory: (category) => set({ currentView: 'CATEGORY_DETAIL', selectedCategory: category, searchQuery: '' }),
    selectItem: (item) => set({ currentView: 'VAULT_DETAIL', selectedItem: item }),
    closeCategory: () => set({ currentView: 'GRID', selectedCategory: null }),
    closeItem: () => set((state) => ({
        currentView: state.selectedCategory ? 'CATEGORY_DETAIL' : 'GRID',
        selectedItem: null
    })),
    setSearchQuery: (query) => set({ searchQuery: query }),
    startSearch: () => set({ currentView: 'SEARCH' }),
    resetView: () => set({ currentView: 'GRID', selectedCategory: null, selectedItem: null, searchQuery: '' }),
}));
