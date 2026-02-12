import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Plus, Trash2, ShieldCheck, LogOut } from 'lucide-react';
import { useCategoryStore } from '../store/categoryStore';
import { IconPicker } from '../components/ui/IconPicker';
import { cn } from '../lib/utils';
import * as LucideIcons from 'lucide-react';

export const Settings = () => {
    const { categories, addCategory, removeCategory } = useCategoryStore();
    const [isAdding, setIsAdding] = useState(false);

    // Yeni Kategori State'i
    const [newCat, setNewCat] = useState({ name: '', icon: 'Wallet', color: 'bg-blue-600' });

    const COLORS = [
        'bg-blue-600', 'bg-red-500', 'bg-emerald-500',
        'bg-orange-500', 'bg-purple-600', 'bg-pink-500',
        'bg-yellow-500', 'bg-zinc-600'
    ];

    const handleAdd = () => {
        if (!newCat.name) return;
        addCategory({
            id: Date.now().toString(),
            name: newCat.name,
            iconName: newCat.icon,
            color: newCat.color
        });
        setIsAdding(false);
        setNewCat({ name: '', icon: 'Wallet', color: 'bg-blue-600' });
    };

    return (
        <div className="min-h-screen bg-black text-white pb-24">
            {/* Header */}
            <div className="px-6 pt-12 pb-6">
                <h1 className="text-3xl font-bold tracking-tight">Ayarlar</h1>
                <p className="text-zinc-500 mt-1 font-medium">Uygulama tercihleri ve yönetim</p>
            </div>

            <div className="px-4 space-y-8">

                {/* Profil Kartı (Süs) */}
                <div className="bg-zinc-900 rounded-3xl p-5 flex items-center gap-4 border border-white/5">
                    <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-2xl font-bold">
                        U
                    </div>
                    <div>
                        <h3 className="font-bold text-lg">Umut Yılmaz</h3>
                        <p className="text-zinc-500 text-sm">PassRepo Pro</p>
                    </div>
                    <button className="ml-auto p-3 bg-zinc-800 rounded-full text-red-400">
                        <LogOut size={20} />
                    </button>
                </div>

                {/* Kategori Yönetimi */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between px-2">
                        <h2 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Kategoriler</h2>
                        <button
                            onClick={() => setIsAdding(!isAdding)}
                            className="text-blue-500 text-sm font-bold flex items-center gap-1 active:opacity-60"
                        >
                            <Plus size={16} /> Yeni Ekle
                        </button>
                    </div>

                    {/* Ekleme Formu (Animasyonlu) */}
                    <AnimatePresence>
                        {isAdding && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden bg-zinc-900/50 rounded-3xl border border-blue-500/30"
                            >
                                <div className="p-5 space-y-5">
                                    <input
                                        type="text"
                                        placeholder="Kategori Adı (Örn: Kripto)"
                                        value={newCat.name}
                                        onChange={e => setNewCat({ ...newCat, name: e.target.value })}
                                        className="w-full bg-black h-12 rounded-xl px-4 text-white border border-white/10 focus:border-blue-500 outline-none"
                                    />

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 ml-1">Renk Seç</label>
                                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                                            {COLORS.map(c => (
                                                <button
                                                    key={c}
                                                    onClick={() => setNewCat({ ...newCat, color: c })}
                                                    className={cn(
                                                        "h-8 w-8 rounded-full shrink-0 transition-transform",
                                                        c,
                                                        newCat.color === c ? "scale-125 ring-2 ring-white" : "opacity-50"
                                                    )}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 ml-1">İkon Seç</label>
                                        <IconPicker selectedIcon={newCat.icon} onSelect={(i) => setNewCat({ ...newCat, icon: i })} />
                                    </div>

                                    <button
                                        onClick={handleAdd}
                                        className="w-full h-12 bg-blue-600 rounded-xl font-bold text-white shadow-lg active:scale-95 transition-transform"
                                    >
                                        Oluştur
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Kategori Listesi */}
                    <div className="space-y-2">
                        {categories.map(cat => {
                            // @ts-ignore
                            const Icon = LucideIcons[cat.iconName] || LucideIcons.Circle;
                            return (
                                <div key={cat.id} className="flex items-center justify-between p-4 bg-zinc-900 rounded-2xl border border-white/5">
                                    <div className="flex items-center gap-4">
                                        <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center text-white shadow-lg", cat.color)}>
                                            <Icon size={20} />
                                        </div>
                                        <span className="font-semibold text-lg">{cat.name}</span>
                                    </div>
                                    <button
                                        onClick={() => removeCategory(cat.id)}
                                        className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Güvenlik Notu */}
                <div className="p-5 rounded-3xl bg-blue-500/10 border border-blue-500/20 flex gap-4">
                    <ShieldCheck className="text-blue-400 shrink-0" size={32} />
                    <div>
                        <h4 className="font-bold text-blue-400">Zero-Knowledge</h4>
                        <p className="text-sm text-blue-300/80 mt-1">
                            Verileriniz cihazınızda şifrelenir. Sunucularımız anahtarınızı asla görmez.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};