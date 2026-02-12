import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Edit2, Copy, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { useViewStore } from '../store/viewStore';
import { LogoIcon } from './ui/LogoIcon';
import { toast } from 'sonner';

export const VaultDetailView = () => {
    const { selectedItem, closeItem } = useViewStore();
    const [showPassword, setShowPassword] = useState(false);

    if (!selectedItem) return null;

    const copyToClipboard = (text: string | undefined, label: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        toast.success(`${label} kopyalandı!`);
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 z-50 bg-black text-white flex flex-col overflow-hidden"
        >
            {/* Header */}
            <div className="flex items-center justify-between p-4 pt-12 pb-2 bg-gradient-to-b from-black/80 to-transparent backdrop-blur-sm sticky top-0 z-10">
                <button
                    onClick={closeItem}
                    className="flex items-center text-blue-500 font-medium text-lg active:opacity-70"
                >
                    <ChevronLeft size={28} className="-ml-2" />
                    Geri
                </button>
                <button className="text-white/80 p-2 rounded-full hover:bg-white/10 active:scale-95 transition-all">
                    <Edit2 size={22} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-20">

                {/* Hero Section */}
                <div className="flex flex-col items-center py-8 gap-4">
                    <div className="h-24 w-24 rounded-[2rem] bg-gradient-to-br from-neutral-800 to-neutral-900 shadow-2xl shadow-black border border-white/10 flex items-center justify-center p-4">
                        <LogoIcon title={selectedItem.url || selectedItem.serviceName} className="h-14 w-14" />
                    </div>
                    <div className="text-center space-y-2">
                        <h1 className="text-4xl font-bold tracking-tight">{selectedItem.serviceName}</h1>
                        <span className="inline-block px-3 py-1 rounded-full bg-neutral-800/80 text-neutral-400 text-sm font-semibold border border-white/5">
                            {selectedItem.category}
                        </span>
                    </div>
                </div>

                {/* Data Section */}
                <div className="space-y-6 mt-4">

                    {/* Username Section */}
                    {selectedItem.username && (
                        <div className="bg-neutral-900/50 rounded-3xl p-1 border border-white/5">
                            <div className="px-5 py-4 flex flex-col gap-1 relative group">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Kullanıcı Adı</label>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-xl font-medium text-zinc-100 truncate select-all">{selectedItem.username}</span>
                                    <button
                                        onClick={() => copyToClipboard(selectedItem.username, 'Kullanıcı Adı')}
                                        className="p-3 bg-neutral-800 rounded-xl text-blue-400 active:bg-blue-500 active:text-white transition-all shadow-lg active:scale-95"
                                    >
                                        <Copy size={20} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Password Section */}
                    <div className="bg-neutral-900/50 rounded-3xl p-1 border border-white/5">
                        <div className="px-5 py-4 flex flex-col gap-3 relative">
                            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Parola</label>

                            <div className="flex items-center justify-between gap-4 min-h-[3rem]">
                                {showPassword ? (
                                    <span className="text-2xl font-mono text-white tracking-wider break-all leading-tight">
                                        {selectedItem.password}
                                    </span>
                                ) : (
                                    <span className="text-3xl font-bold text-neutral-500 tracking-[0.2em] mt-1">
                                        ••••••••••••
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-3 mt-2">
                                <button
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="flex items-center justify-center gap-2 py-3 bg-neutral-800 rounded-xl text-zinc-300 font-medium active:bg-neutral-700 transition-all active:scale-[0.98]"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    <span>{showPassword ? 'Gizle' : 'Göster'}</span>
                                </button>
                                <button
                                    onClick={() => copyToClipboard(selectedItem.password, 'Parola')}
                                    className="flex items-center justify-center gap-2 py-3 bg-white text-black rounded-xl font-bold active:bg-zinc-200 transition-all active:scale-[0.98]"
                                >
                                    <Copy size={20} strokeWidth={2.5} />
                                    <span>Kopyala</span>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Website/URL */}
                    <div className="bg-neutral-900/50 rounded-3xl p-1 border border-white/5 opacity-80 hover:opacity-100 transition-opacity">
                        <button className="w-full px-5 py-4 flex items-center justify-between text-left">
                            <div className="flex flex-col">
                                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Web Sitesi</label>
                                <span className="text-lg text-blue-400 font-medium mt-1 truncate max-w-[200px]">google.com</span>
                            </div>
                            <ExternalLink size={20} className="text-neutral-600" />
                        </button>
                    </div>

                    {/* Notes (Placeholder) */}
                    <div className="bg-neutral-900/50 rounded-3xl p-5 border border-white/5 min-h-[100px]">
                        <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Notlar</label>
                        <p className="text-neutral-400 mt-2 text-base leading-relaxed">
                            Buraya eklenen notlar şifrelenerek saklanır.
                        </p>
                    </div>

                </div>
            </div>
        </motion.div>
    );
};
