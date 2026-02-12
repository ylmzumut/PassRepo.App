import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import api from '../services/ApiService';
import { CryptoService } from '../services/CryptoService';
import { BottomNav } from '../components/ui/BottomNav';
import { CategoryCard } from '../components/ui/CategoryCard';
import { VaultItemCard } from '../components/ui/VaultItemCard';
import { Modal } from '../components/ui/Modal';
import { VaultDetail } from '../components/ui/VaultDetail';
import { Search, Briefcase, Mail, Key, CreditCard, X } from 'lucide-react';
import { LogoIcon } from '../components/ui/LogoIcon';
import { toast } from 'sonner';

interface VaultItem {
    id: string;
    username: string;
    url: string;
    notes: string;
    decryptedPassword?: string;
    logoId?: number;
    category?: string;
}

const Dashboard = () => {
    const { user, encryptionKey, isAuthenticated } = useAuthStore();
    const navigate = useNavigate();
    const [items, setItems] = useState<VaultItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedItem, setSelectedItem] = useState<VaultItem | null>(null);

    useEffect(() => {
        if (!isAuthenticated || !encryptionKey) {
            navigate('/login');
            return;
        }
        fetchItems();
    }, [isAuthenticated, encryptionKey]);

    const fetchItems = async () => {
        try {
            const res = await api.get('/vault');
            const encryptedItems = res.data;

            // Decrypt on the fly
            const decryptedItems = await Promise.all(encryptedItems.map(async (item: any) => {
                try {
                    const decryptedData = await CryptoService.decrypt(item.encryptedBlob, item.nonce, encryptionKey!);
                    return { ...item, ...decryptedData };
                } catch (e) {
                    return { ...item, username: 'Error', url: 'Decryption Failed', notes: '' };
                }
            }));

            setItems(decryptedItems);
        } catch (error) {
            console.error('Failed to fetch vault', error);
            toast.error("Veriler alınamadı");
        } finally {
            setLoading(false);
        }
    };

    const handleCopyPassword = (password: string) => {
        navigator.clipboard.writeText(password);
        toast.success("Şifre kopyalandı");
    };

    const toggleCategory = (category: string) => {
        if (selectedCategory === category) {
            setSelectedCategory(null);
        } else {
            setSelectedCategory(category);
        }
    };

    const filteredItems = items.filter(item => {
        const matchesSearch = item.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.username.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory ? (item.category === selectedCategory || (selectedCategory === 'Genel' && !item.category)) : true; // Simple logic for now
        return matchesSearch && matchesCategory;
    });

    // Mock category counts (In real app, calculate based on item.category)
    // For now, let's assume everything is 'Genel' unless specified
    const getCount = (cat: string) => {
        if (cat === 'Genel') return items.length;
        return items.filter(i => i.category === cat).length;
    };

    return (
        <div className="min-h-screen bg-zinc-950 text-white pb-24">
            {/* Header */}
            <header className="sticky top-0 z-10 bg-zinc-950/80 backdrop-blur-md px-6 py-4 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-zinc-400 text-sm font-medium">Günaydın,</p>
                        <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
                            {user?.email.split('@')[0]}
                        </h1>
                    </div>
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-lg">
                        {user?.email.charAt(0).toUpperCase()}
                    </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-500" />
                    <input
                        type="text"
                        placeholder="Kasa içinde ara..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                    />
                </div>
            </header>

            <main className="px-6 space-y-8 mt-2">
                {/* Sections: Quick Categories */}
                <section>
                    <div className="flex justify-between items-center mb-3">
                        <h2 className="text-sm font-semibold text-zinc-500 uppercase tracking-wider">Kategoriler</h2>
                        {selectedCategory && (
                            <button onClick={() => setSelectedCategory(null)} className="text-xs text-indigo-400 flex items-center gap-1">
                                <X className="h-3 w-3" /> Filtreyi Temizle
                            </button>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <CategoryCard
                            title="Genel"
                            icon={Key}
                            count={getCount('Genel')}
                            onClick={() => toggleCategory('Genel')}
                        />
                        <CategoryCard
                            title="Finans"
                            icon={CreditCard}
                            count={getCount('Finans')}
                            onClick={() => toggleCategory('Finans')}
                        />
                        <CategoryCard
                            title="İş"
                            icon={Briefcase}
                            count={getCount('İş')}
                            onClick={() => toggleCategory('İş')}
                        />
                        <CategoryCard
                            title="Sosyal"
                            icon={Mail}
                            count={getCount('Sosyal')}
                            onClick={() => toggleCategory('Sosyal')}
                        />
                    </div>
                </section>

                {/* Section: All Items */}
                <section>
                    <h2 className="text-sm font-semibold text-zinc-500 mb-3 uppercase tracking-wider">
                        {selectedCategory ? `${selectedCategory} Kayıtları` : "Tüm Kayıtlar"}
                    </h2>
                    <div className="space-y-3">
                        {loading ? (
                            <div className="text-center py-10 text-zinc-500 animate-pulse">Şifreler çözülüyor...</div>
                        ) : filteredItems.length > 0 ? (
                            filteredItems.map(item => (
                                <VaultItemCard
                                    key={item.id}
                                    title={item.url}
                                    username={item.username}
                                    onClick={() => setSelectedItem(item)}
                                    onCopyPassword={() => handleCopyPassword(item.decryptedPassword || '')}
                                />
                            ))
                        ) : (
                            <div className="text-center py-10 text-zinc-600 border border-dashed border-zinc-800 rounded-2xl">
                                <p>Kayıt bulunamadı.</p>
                                {selectedCategory && <p className="text-xs mt-1">Filtreyi temizlemeyi deneyin.</p>}
                            </div>
                        )}
                    </div>
                </section>
            </main>

            {/* Detail Modal */}
            <Modal
                isOpen={!!selectedItem}
                onClose={() => setSelectedItem(null)}
                title="Kayıt Detayı"
            >
                {selectedItem && (
                    <VaultDetail
                        item={selectedItem}
                        onClose={() => setSelectedItem(null)}
                        onDelete={(id) => {
                            // Implement delete logic here or pass down
                            console.log("Delete", id);
                            // Optimistic update for now or Refetch
                            setItems(current => current.filter(i => i.id !== id));
                        }}
                    />
                )}
            </Modal>

            <BottomNav />
        </div>
    );
};

export default Dashboard;
