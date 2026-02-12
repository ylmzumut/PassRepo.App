import React, { useState } from 'react';
import { Search, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
// import type { Category } from '../../types'; // Buna artık gerek yok, store'dan alacağız
import { useCategoryStore } from '../../store/categoryStore'; // Store'u çağırdık

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onSave }) => {
    // Store'dan kategorileri çekiyoruz
    const { categories } = useCategoryStore();

    const [formData, setFormData] = useState({
        title: '',
        username: '',
        password: '',
        // Varsayılan olarak ilk kategoriyi veya 'Genel'i seçelim
        category: 'Genel',
        iconType: 'brand' as 'brand' | 'letter',
    });

    const handleSave = () => {
        if (!formData.title || !formData.password || !formData.category) return;
        onSave(formData);
        onClose();
        setFormData({
            title: '',
            username: '',
            password: '',
            category: 'Genel',
            iconType: 'brand'
        });
    };

    const generatePassword = () => {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let pass = "";
        for (let i = 0; i < 16; i++) {
            pass += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        setFormData({ ...formData, password: pass });
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50"
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
                        className="fixed bottom-0 left-0 w-full h-[92%] bg-zinc-950 rounded-t-[2.5rem] shadow-2xl z-50 flex flex-col items-center border-t border-white/10"
                    >
                        {/* Drag Handle */}
                        <div className="w-14 h-1.5 bg-zinc-800 rounded-full mt-5 mb-2 shrink-0 opacity-50" />

                        {/* Header */}
                        <div className="w-full flex items-center justify-between px-6 py-4 border-b border-white/5">
                            <button onClick={onClose} className="text-[17px] text-zinc-400 font-normal active:text-white">Vazgeç</button>
                            <h2 className="text-[17px] font-semibold text-white">Yeni Hesap</h2>
                            <button
                                onClick={handleSave}
                                disabled={!formData.title || !formData.password}
                                className="text-[17px] text-blue-500 font-bold disabled:opacity-40 disabled:text-zinc-600"
                            >
                                Bitti
                            </button>
                        </div>

                        {/* Scrollable Body */}
                        <div className="w-full flex-1 overflow-y-auto px-5 pt-6 pb-10 space-y-8 no-scrollbar">

                            {/* Section: Category - ARTIK DİNAMİK */}
                            <div className="space-y-3">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1">Kategori</label>
                                <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar scroll-smooth pl-1">
                                    {categories.map(cat => (
                                        <button
                                            key={cat.id}
                                            onClick={() => setFormData({ ...formData, category: cat.name })}
                                            className={cn(
                                                "px-5 py-3 rounded-2xl text-[15px] font-semibold whitespace-nowrap transition-all duration-200 shrink-0 border",
                                                formData.category === cat.name
                                                    ? cn("text-white shadow-lg shadow-blue-900/20 border-transparent", cat.color) // Dinamik renk kullanımı
                                                    : "bg-zinc-900 text-zinc-400 border-zinc-800 hover:bg-zinc-800"
                                            )}
                                        >
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Service Name */}
                            <div className="space-y-3">
                                <div className="flex gap-4 items-center">
                                    <div className="h-16 w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0">
                                        {formData.title ? (
                                            <span className="text-3xl font-bold text-white uppercase">{formData.title.charAt(0)}</span>
                                        ) : (
                                            <Search className="text-zinc-600" size={28} />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            placeholder="Servis (Örn: Netflix)"
                                            value={formData.title}
                                            autoFocus
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full bg-zinc-900 h-16 rounded-2xl px-5 text-[19px] text-white placeholder-zinc-600 focus:outline-none focus:ring-1 focus:ring-blue-500/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Credentials */}
                            <div className="space-y-4">
                                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-widest ml-1">Giriş Bilgileri</label>

                                <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800/50">
                                    <input
                                        type="text"
                                        placeholder="Kullanıcı Adı veya E-posta"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-transparent h-16 px-5 text-[17px] text-white placeholder-zinc-600 focus:outline-none focus:bg-zinc-800/50 transition-colors border-b border-zinc-800"
                                    />
                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Parola"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-transparent h-16 px-5 pr-24 text-[17px] text-white font-mono placeholder-zinc-600 focus:outline-none focus:bg-zinc-800/50 transition-colors"
                                        />
                                        <button
                                            onClick={generatePassword}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-blue-500/10 rounded-lg flex items-center gap-1.5 text-xs font-bold text-blue-400 active:bg-blue-500 active:text-white transition-colors"
                                        >
                                            <Wand2 size={12} />
                                            ÜRET
                                        </button>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};