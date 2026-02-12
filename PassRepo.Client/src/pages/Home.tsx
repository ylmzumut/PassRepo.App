import React, { useEffect, useState, useCallback } from 'react';
import { Layout } from '../components/Layout';
import { CategoryGrid } from '../components/ui/CategoryGrid';
import { VaultItem } from '../components/ui/VaultItem';
import { BottomNav } from '../components/ui/BottomNav';
import { AddItemModal } from '../components/ui/AddItemModal';
import { Search, ChevronLeft, FolderOpen, Loader2 } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useViewStore } from '../store/viewStore';
import { useCategoryStore } from '../store/categoryStore';
import { cn } from '../lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { VaultDetailView } from '../components/VaultDetailView';
import api from '../services/ApiService';
import { CryptoService } from '../services/CryptoService';
import type { VaultItem as VaultItemType } from '../types';
import { toast } from 'sonner';

const Home = () => {
    const { user, encryptionKey } = useAuthStore();
    const { currentView, selectedCategory, searchQuery, setSearchQuery, closeCategory, startSearch, resetView } = useViewStore();

    // Gerçek Veriler
    const [vaultItems, setVaultItems] = useState<VaultItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // 1. Verileri Çek ve Çöz (DECRYPT FLOW)
    const fetchVault = useCallback(async () => {
        if (!encryptionKey) return;

        try {
            setIsLoading(true);
            const res = await api.get('/vault');
            const encryptedList = res.data;

            // Her bir kaydı tarayıcıda çözüyoruz
            const decryptedList = await Promise.all(encryptedList.map(async (item: any) => {
                try {
                    const decryptedData = await CryptoService.decrypt(item.encryptedBlob, item.nonce, encryptionKey);
                    return {
                        id: item.id,
                        ...decryptedData, // serviceName, username, password, category vb. buradan gelir
                        createdAt: item.createdAt
                    };
                } catch (e) {
                    console.error("Şifre çözme hatası:", item.id, e);
                    return null; // Bozuk veri varsa atla
                }
            }));

            setVaultItems(decryptedList.filter(Boolean)); // Null olanları temizle
        } catch (error) {
            console.error("Veri çekme hatası:", error);
            toast.error("Veriler yüklenemedi.");
        } finally {
            setIsLoading(false);
        }
    }, [encryptionKey]);

    useEffect(() => {
        fetchVault();
    }, [fetchVault]);

    // 2. Yeni Kayıt Ekle ve Şifrele (ENCRYPT FLOW)
    const handleSaveItem = async (data: any) => {
        if (!encryptionKey) {
            toast.error("Şifreleme anahtarı bulunamadı. Lütfen tekrar giriş yapın.");
            return;
        }

        const toastId = toast.loading("Şifreleniyor ve kaydediliyor...");

        try {
            // A. Veriyi Hazırla
            const payload = {
                serviceName: data.title,
                username: data.username,
                password: data.password,
                category: data.category,
                url: data.title, // İkon için basit eşleştirme
                notes: "",
                createdAt: Date.now()
            };

            // B. Tarayıcıda Şifrele (XChaCha20-Poly1305)
            const { encryptedBlob, nonce } = await CryptoService.encrypt(payload, encryptionKey);

            // C. Şifreli Veriyi Sunucuya Gönder (Sunucu içeriği göremez)
            await api.post('/vault', {
                encryptedBlob,
                nonce,
                isFavorite: false,
                logoId: 0, // İlerde logo ID sistemi yaparsak kullanırız
                categoryId: null // Şimdilik JSON içinde tutuyoruz kategoriyi
            });

            toast.success("Kayıt başarıyla şifrelendi ve saklandı!", { id: toastId });
            setIsAddModalOpen(false);

            // Listeyi yenile
            fetchVault();

        } catch (error) {
            console.error("Kaydetme hatası:", error);
            toast.error("Bir hata oluştu.", { id: toastId });
        }
    };

    // Filtreleme Mantığı
    const filteredItems = vaultItems.filter(item => {
        if (currentView === 'SEARCH') {
            const q = searchQuery.toLowerCase();
            return item.serviceName.toLowerCase().includes(q) ||
                (item.username && item.username.toLowerCase().includes(q));
        }
        if (currentView === 'CATEGORY_DETAIL') {
            return item.category === selectedCategory;
        }
        return false;
    });

    const handleBack = () => {
        if (currentView === 'SEARCH') {
            setSearchQuery('');
            resetView();
        } else {
            closeCategory();
        }
    };

    const { fetchCategories } = useCategoryStore();

    useEffect(() => {
        fetchCategories(); // Uygulama açılınca kategorileri çek
        fetchVault();
    }, [fetchVault, fetchCategories]);

    return (
        <Layout>
            {/* Header */}
            <header className="sticky top-0 z-30 bg-black/95 backdrop-blur-xl border-b border-white/5 px-5 py-3 transition-all">
                <div className="flex justify-between items-center mb-4 h-10">
                    {currentView === 'GRID' ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-between w-full items-center">
                            <h1 className="text-2xl font-bold tracking-tighter text-white">PassRepo</h1>
                            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-zinc-700 to-zinc-600 border border-white/10 flex items-center justify-center shadow-inner text-white font-bold">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="flex items-center gap-3 w-full">
                            <button onClick={handleBack} className="p-2 -ml-2 rounded-full hover:bg-zinc-800 text-zinc-300 active:text-white transition-colors">
                                <ChevronLeft size={24} />
                            </button>
                            <h2 className="text-xl font-semibold text-white">
                                {currentView === 'SEARCH' ? 'Arama' : selectedCategory}
                            </h2>
                        </motion.div>
                    )}
                </div>

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

            {/* Main Content */}
            <main className="flex-1 relative overflow-hidden">
                <AnimatePresence mode="popLayout">

                    {/* Yükleniyor Ekranı (İlk Açılış) */}
                    {isLoading && vaultItems.length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center z-50">
                            <Loader2 className="animate-spin text-blue-500" size={32} />
                        </div>
                    )}

                    {currentView === 'GRID' && (
                        <motion.div key="grid" className="p-6 pb-32 space-y-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -50 }}>
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-2xl font-bold tracking-tight text-white">Kategoriler</h2>
                                <button className="text-zinc-500 hover:text-white transition-colors text-sm font-medium">Düzenle</button>
                            </div>
                            <CategoryGrid />

                            {/* Son Kayıtlar */}
                            <div className="mt-8">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold tracking-tight text-white">Son Kayıtlar</h2>
                                </div>
                                <div className="space-y-1">
                                    {vaultItems.length > 0 ? (
                                        vaultItems.slice(0, 5).map(item => (
                                            <VaultItem
                                                key={item.id}
                                                item={item}
                                                onSelect={() => useViewStore.getState().selectItem(item)}
                                            />
                                        ))
                                    ) : (
                                        !isLoading && <p className="text-zinc-500 text-sm">Henüz kayıt yok.</p>
                                    )}
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
                            {/* Kategori Başlığı ve İçerik */}
                            <div className="flex items-center p-4 border-b border-white/10 bg-black/80 backdrop-blur-md sticky top-0 z-20">
                                <button onClick={closeCategory} className="flex items-center text-blue-500">
                                    <ChevronLeft size={24} />
                                    <span className="font-medium text-lg ml-1">Kategoriler</span>
                                </button>
                                <h1 className="ml-4 text-xl font-bold text-white">{selectedCategory}</h1>
                            </div>

                            <div className="flex-1 overflow-y-auto pb-32 no-scrollbar">
                                {filteredItems.length > 0 ? (
                                    filteredItems.map(item => (
                                        <VaultItem
                                            key={item.id}
                                            item={item}
                                            onSelect={() => useViewStore.getState().selectItem(item)}
                                        />
                                    ))
                                ) : (
                                    <div className="p-8 text-center text-zinc-500 mt-10 flex flex-col items-center">
                                        <div className="bg-zinc-900 p-4 rounded-full mb-4">
                                            <FolderOpen size={32} className="opacity-50" />
                                        </div>
                                        <p className="font-medium">Bu kategoride henüz kayıt yok.</p>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {currentView === 'VAULT_DETAIL' && (
                        <VaultDetailView />
                    )}

                    {currentView === 'SEARCH' && (
                        <motion.div key="search" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="p-4 pt-4 pb-32 overflow-y-auto h-full">
                            <div className="space-y-1">
                                {filteredItems.map(item => (
                                    <VaultItem key={item.id} item={item} onSelect={() => useViewStore.getState().selectItem(item)} />
                                ))}
                                {searchQuery && filteredItems.length === 0 && (
                                    <p className="text-center text-zinc-500 mt-10">Sonuç bulunamadı.</p>
                                )}
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