import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import type { Category } from '../../types';
import * as SimpleIcons from 'simple-icons';

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => void;
}

const CATEGORIES: Category['name'][] = ['Banka', 'Mail', 'Genel', 'Sosyal', 'İş', 'Diğer'];

export const AddItemModal: React.FC<AddItemModalProps> = ({ isOpen, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        title: '',
        username: '',
        password: '',
        category: 'Genel' as Category['name'],
        iconType: 'brand' as 'brand' | 'letter',
    });

    const handleSave = () => {
        if (!formData.title || !formData.password || !formData.category) return;
        onSave(formData);
        onClose();
        setFormData({ title: '', username: '', password: '', category: 'Genel', iconType: 'brand' });
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
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                    />

                    {/* Bottom Sheet */}
                    <motion.div
                        initial={{ y: '100%' }}
                        animate={{ y: 0 }}
                        exit={{ y: '100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className="fixed bottom-0 left-0 w-full h-[95%] bg-zinc-900 rounded-t-[2rem] border-t border-white/10 shadow-2xl z-50 flex flex-col items-center"
                    >
                        {/* Drag Handle */}
                        <div className="w-12 h-1.5 bg-zinc-700 rounded-full mt-4 mb-2 shrink-0" />

                        {/* Header */}
                        <div className="w-full flex items-center justify-between px-6 py-4">
                            <button onClick={onClose} className="text-lg text-zinc-400 font-medium">Vazgeç</button>
                            <h2 className="text-lg font-bold text-white">Yeni Ekle</h2>
                            <button
                                onClick={handleSave}
                                disabled={!formData.title || !formData.password}
                                className="text-lg text-blue-500 font-bold disabled:opacity-50"
                            >
                                Kaydet
                            </button>
                        </div>

                        {/* Validated Form Body */}
                        <div className="w-full flex-1 overflow-y-auto px-6 py-2 space-y-8">

                            {/* Category Selection (Horizontal Scroll) */}
                            <div className="space-y-4">
                                <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest pl-1">Kategori</label>
                                <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
                                    {CATEGORIES.map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setFormData({ ...formData, category: cat })}
                                            className={cn(
                                                "px-6 py-3 rounded-full text-base font-bold whitespace-nowrap transition-all duration-200 shrink-0",
                                                formData.category === cat
                                                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                                    : "bg-zinc-800 text-zinc-400"
                                            )}
                                        >
                                            {cat}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Service Inputs */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest pl-1">Servis</label>
                                    <div className="flex gap-4">
                                        <div className="h-14 w-14 rounded-xl bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5">
                                            {formData.title ? (
                                                <span className="text-2xl font-bold text-white uppercase">{formData.title.charAt(0)}</span>
                                            ) : (
                                                <Search className="text-zinc-500" size={24} />
                                            )}
                                        </div>
                                        <input
                                            type="text"
                                            placeholder="Servis Adı"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="flex-1 bg-zinc-800 rounded-xl px-5 h-14 text-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Credentials */}
                            <div className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-sm font-bold text-zinc-500 uppercase tracking-widest pl-1">Giriş Bilgileri</label>

                                    <input
                                        type="text"
                                        placeholder="Kullanıcı Adı (Opsiyonel)"
                                        value={formData.username}
                                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                        className="w-full bg-zinc-800 rounded-xl px-5 h-14 text-lg text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-medium mb-3"
                                    />

                                    <div className="relative">
                                        <input
                                            type="text"
                                            placeholder="Parola"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full bg-zinc-800 rounded-xl px-5 h-14 pr-20 text-lg text-white font-mono placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                                        />
                                        <button
                                            onClick={() => setFormData({ ...formData, password: Math.random().toString(36).slice(-10) + '!A1' })}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 bg-zinc-700/50 rounded-lg text-xs font-bold text-blue-400 hover:text-white transition-colors"
                                        >
                                            ÜRET
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-auto pt-8 pb-8">
                                <button
                                    onClick={handleSave}
                                    disabled={!formData.title || !formData.password}
                                    className="w-full bg-white text-black font-bold h-14 rounded-2xl text-lg shadow-xl shadow-white/10 active:scale-[0.98] transition-all disabled:opacity-50 disabled:shadow-none"
                                >
                                    Kaydet
                                </button>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
