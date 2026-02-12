import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Edit3, Copy, Eye, EyeOff, Globe, Lock } from 'lucide-react';
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
        toast.success(`${label} kopyalandı!`, {
            style: { background: '#22c55e', color: '#fff', border: 'none' }
        });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    return (
        <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", stiffness: 350, damping: 35 }}
            className="fixed inset-0 z-[60] bg-black text-white flex flex-col"
        >
            {/* Navbar */}
            <div className="flex items-center justify-between px-4 py-3 pt-12 bg-black/80 backdrop-blur-md sticky top-0 z-10 border-b border-white/5">
                <button
                    onClick={closeItem}
                    className="flex items-center text-blue-500 font-medium text-[17px] active:opacity-60 transition-opacity"
                >
                    <ChevronLeft size={26} className="-ml-2" />
                    Listeye Dön
                </button>
                <button className="h-10 w-10 flex items-center justify-center rounded-full bg-zinc-900 text-zinc-400 active:text-white active:bg-zinc-800 transition-all">
                    <Edit3 size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 pb-20 no-scrollbar">

                {/* Hero Section (Logo & Title) */}
                <div className="flex flex-col items-center py-10 gap-6">
                    <div className="h-28 w-28 rounded-[2.5rem] bg-gradient-to-br from-zinc-800 to-black shadow-2xl shadow-blue-900/10 border border-white/10 flex items-center justify-center p-6 relative">
                        {/* Ambient Glow */}
                        <div className="absolute inset-0 bg-white/5 blur-xl rounded-full" />
                        <LogoIcon title={selectedItem.url || selectedItem.serviceName} className="h-16 w-16 z-10" />
                    </div>
                    <div className="text-center space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-white">{selectedItem.serviceName}</h1>
                        <span className="inline-flex items-center px-3 py-1 rounded-lg bg-zinc-900 text-zinc-500 text-xs font-bold uppercase tracking-widest border border-white/5">
                            {selectedItem.category}
                        </span>
                    </div>
                </div>

                {/* Info Cards */}
                <div className="space-y-6">

                    {/* Username Section */}
                    {selectedItem.username && (
                        <div className="bg-zinc-900/50 rounded-[1.5rem] p-1 border border-white/5">
                            <div className="px-5 py-4 flex flex-col gap-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Kullanıcı Adı</label>
                                <div className="flex items-center justify-between gap-4">
                                    <span className="text-[19px] font-medium text-white truncate select-all">{selectedItem.username}</span>
                                    <button
                                        onClick={() => copyToClipboard(selectedItem.username, 'Kullanıcı Adı')}
                                        className="h-10 w-10 flex items-center justify-center bg-zinc-800 rounded-full text-blue-400 active:bg-blue-500 active:text-white transition-all shadow-lg active:scale-90"
                                    >
                                        <Copy size={18} strokeWidth={2.5} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Password Section (The Star Show) */}
                    <div className="bg-zinc-900/80 rounded-[1.8rem] p-5 border border-white/10 shadow-lg relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-3 opacity-10">
                            <Lock size={100} />
                        </div>

                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest ml-1">Parola</label>

                        <div className="flex items-center justify-center min-h-[5rem] py-2">
                            {showPassword ? (
                                <span className="text-2xl font-mono text-white break-all text-center selection:bg-blue-500/30">
                                    {selectedItem.password}
                                </span>
                            ) : (
                                <span className="text-4xl font-bold text-zinc-600 tracking-[0.2em] select-none">
                                    ••••••••
                                </span>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-3 mt-4">
                            <button
                                onClick={() => setShowPassword(!showPassword)}
                                className="flex items-center justify-center gap-2 h-12 bg-zinc-800 rounded-xl text-zinc-300 font-semibold active:bg-zinc-700 transition-all active:scale-[0.98]"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                <span>{showPassword ? 'Gizle' : 'Göster'}</span>
                            </button>
                            <button
                                onClick={() => copyToClipboard(selectedItem.password, 'Parola')}
                                className="flex items-center justify-center gap-2 h-12 bg-white text-black rounded-xl font-bold active:bg-zinc-200 transition-all active:scale-[0.98] shadow-lg shadow-white/5"
                            >
                                <Copy size={20} strokeWidth={2.5} />
                                <span>Kopyala</span>
                            </button>
                        </div>
                    </div>

                    {/* Website */}
                    <a
                        href={`https://${selectedItem.url || 'google.com'}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between p-5 bg-zinc-900/50 rounded-2xl border border-white/5 active:bg-zinc-800 transition-colors group"
                    >
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400 group-active:text-white">
                                <Globe size={20} />
                            </div>
                            <span className="text-[17px] font-medium text-zinc-300 group-active:text-white">Web Sitesini Aç</span>
                        </div>
                        <ChevronLeft size={20} className="rotate-180 text-zinc-600" />
                    </a>

                </div>
            </div>
        </motion.div>
    );
};