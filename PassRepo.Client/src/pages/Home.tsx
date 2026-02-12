import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { CategoryGrid } from '../components/ui/CategoryGrid';
import { VaultItem } from '../components/ui/VaultItem';
import { BottomNav } from '../components/ui/BottomNav';
import { AddItemModal } from '../components/ui/AddItemModal';
import { MOCK_VAULT_ITEMS } from '../store/mockData';
import { Search, ChevronLeft, FolderOpen } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useViewStore } from '../store/viewStore';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { VaultDetailView } from '../components/VaultDetailView';

const Home = () => {
    const { user } = useAuthStore();
    const { currentView, selectedCategory, searchQuery, setSearchQuery, closeCategory, startSearch, resetView } = useViewStore();
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // Mock Save Handler for now
    const handleSaveItem = (data: any) => {
        console.log("Saving Item:", data);
        MOCK_VAULT_ITEMS.push({
            id: Math.random().toString(),
            serviceName: data.title,
            username: data.username,
            password: data.password,
            category: data.category,
            url: data.title // simple mapping
        });
        // Force re-render or update logic would be needed in real app
        setIsAddModalOpen(false);
    };

    // Filter logic
    const filteredItems = MOCK_VAULT_ITEMS.filter(item => {
        if (currentView === 'SEARCH') {
            return item.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (item.username && item.username.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        if (currentView === 'CATEGORY_DETAIL') {
            const match = item.category === selectedCategory;
            // console.log(`Filtering: View=${currentView}, Category=${selectedCategory}, Item=${item.serviceName}, ItemCat=${item.category}, Match=${match}`);
            return match;
        }
        return false;
    });

    // Handle back button behavior
    const handleBack = () => {
        if (currentView === 'SEARCH') {
            setSearchQuery('');
            resetView();
        } else {
            closeCategory();
        }
    };

    return (
        <Layout>
            {/* Header Area */}
            <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-white/5 px-5 py-3 transition-all">

                {/* Top Row: Title/User OR Back Button */}
                <div className="flex justify-between items-center mb-4 h-10">
                    {currentView === 'GRID' ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between w-full items-center">
                            <h1 className="text-2xl font-bold tracking-tighter text-white">PassRepo</h1>
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 border border-white/10 flex items-center justify-center shadow-inner">
                                <span className="font-semibold text-sm">{user?.email?.charAt(0).toUpperCase() || 'U'}</span>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 w-full">
                            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-zinc-800 text-zinc-300">
                                <ChevronLeft size={24} />
                            </button>
                            <h2 className="text-xl font-semibold text-white">
                                {currentView === 'SEARCH' ? 'Arama' : selectedCategory}
                            </h2>
                        </motion.div>
                    )}
                </div>

                {/* Search Bar */}
                <div className="relative group">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500 group-focus-within:text-white transition-colors" />
                    <input
                        type="text"
                        placeholder="Kasa içinde ara..."
                        value={searchQuery}
                        onFocus={startSearch}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={cn(
                            "w-full bg-zinc-900/80 border border-zinc-800 rounded-xl py-2.5 pl-10 pr-4 text-[15px] text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-700 transition-all",
                            currentView === 'SEARCH' ? "bg-zinc-800 border-zinc-700" : ""
                        )}
                    />
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="popLayout">
                    {currentView === 'GRID' && (
                        // ... Grid JSX
                        <motion.div key="grid" className="p-6 pb-32 space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold tracking-tight">Kategoriler</h2>
                                <button className="text-zinc-500 hover:text-white transition-colors">Düzenle</button>
                            </div>
                            <CategoryGrid />

                            {/* Recent Items Section */}
                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold tracking-tight text-white">Son Kayıtlar</h2>
                                    <button className="text-zinc-500 text-sm hover:text-white transition-colors">Tümü</button>
                                </div>
                                <div className="space-y-1">
                                    {MOCK_VAULT_ITEMS.slice(0, 5).map(item => (
                                        <VaultItem
                                            key={item.id}
                                            item={item}
                                            onSelect={() => useViewStore.getState().selectItem(item)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {currentView === 'CATEGORY_DETAIL' && selectedCategory && (
                        <motion.div
                            key="detail"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute inset-0 bg-black z-10 flex flex-col"
                        >
                            <div className="flex items-center p-4 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-20">
                                <button onClick={closeCategory} className="flex items-center text-blue-500">
                                    <ChevronLeft size={24} />
                                    <span className="font-medium text-lg ml-1">Kategoriler</span>
                                </button>
                                <h1 className="ml-4 text-xl font-bold text-white">{selectedCategory}</h1>
                            </div>

                            <div className="flex-1 overflow-y-auto pb-32">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map(item => (
                                        <VaultItem
                                            key={item.id}
                                            item={item}
                                            onSelect={() => useViewStore.getState().selectItem(item)} // Select Item to open Detail
                                        />
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-zinc-500 mt-10">
                                        <FolderOpen size={48} className="mx-auto mb-4 opacity-50" />
                                        <p>Bu kategoride henüz kayıt yok.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {currentView === 'VAULT_DETAIL' && (
                        <VaultDetailView />
                    )}

                    {currentView === 'SEARCH' && (
                        // ... Search JSX
                        <motion.div key="search" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 pt-20">
                            {/* ... Search implementation ... */}
                            {/* Re-use VaultItem list here */}
                            <div className="mt-4">
                                {searchQuery && MOCK_VAULT_ITEMS.filter(i => i.serviceName.toLowerCase().includes(searchQuery.toLowerCase())).map(item => (
                                    <VaultItem key={item.id} item={item} onSelect={() => useViewStore.getState().selectItem(item)} />
                                ))}
                            </div>
                        </motion.div>
                    )}

                </AnimatePresence>
            </main>

            <BottomNav onAddClick={() => setIsAddModalOpen(true)} />

            <AddItemModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSave={handleSaveItem}
            />
        </Layout>
    );
};

export default Home;
