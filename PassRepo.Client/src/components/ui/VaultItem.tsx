import React from 'react';
import { Copy, User, ChevronRight, KeyRound } from 'lucide-react';
import { LogoIcon } from './LogoIcon';
import { toast } from 'sonner';
import { cn } from '../../lib/utils';
import type { VaultItem as VaultItemType } from '../../types';

interface VaultItemProps {
    item: VaultItemType;
    onSelect: () => void;
}

export const VaultItem: React.FC<VaultItemProps> = ({ item, onSelect }) => {
    const hasUsername = !!item.username;

    const copyToClipboard = (text: string | undefined, label: string, e: React.MouseEvent) => {
        e.stopPropagation();
        if (!text) return;

        navigator.clipboard.writeText(text);
        toast.success(`${label} kopyalandı`, {
            style: { background: '#333', color: '#fff', border: '1px solid #444' }
        });
        if (navigator.vibrate) navigator.vibrate(50);
    };

    return (
        <div
            onClick={onSelect}
            className="group w-full h-[88px] flex items-center justify-between px-4 py-3 border-b border-white/5 active:bg-white/5 transition-colors cursor-pointer select-none"
        >
            {/* Left: Logo Container */}
            <div className="h-14 w-14 min-w-[56px] rounded-2xl bg-zinc-800/50 border border-white/5 flex items-center justify-center overflow-hidden shrink-0 shadow-sm relative">
                {/* Logo Arkasına Hafif Glow */}
                <div className="absolute inset-0 bg-white/5 blur-md" />
                <LogoIcon title={item.url || item.serviceName} className="h-8 w-8 opacity-100 z-10" />
            </div>

            {/* Middle: Info */}
            <div className={cn("flex flex-col ml-5 flex-1 overflow-hidden justify-center h-full gap-0.5")}>
                <span className={cn(
                    "font-semibold text-white truncate tracking-tight leading-none",
                    hasUsername ? "text-[17px] mb-1" : "text-[18px]"
                )}>
                    {item.serviceName}
                </span>
                {hasUsername && (
                    <span className="text-[14px] text-zinc-500 truncate font-medium">
                        {item.username}
                    </span>
                )}
            </div>

            {/* Right: Actions (Genişletilmiş Alanlar) */}
            <div className="flex items-center gap-3 pl-2">

                {/* User Copy Button */}
                {hasUsername && (
                    <button
                        onClick={(e) => copyToClipboard(item.username, 'Kullanıcı adı', e)}
                        className="h-12 w-12 flex items-center justify-center rounded-full bg-white/5 text-zinc-400 hover:text-white hover:bg-white/10 active:scale-90 transition-all border border-transparent hover:border-white/5"
                    >
                        <User size={20} strokeWidth={2} />
                    </button>
                )}

                {/* Password Copy Button (Daha Belirgin) */}
                <button
                    onClick={(e) => copyToClipboard(item.password, 'Parola', e)}
                    className={cn(
                        "flex items-center justify-center rounded-full transition-all duration-200 active:scale-95",
                        "h-12 w-12 bg-zinc-800 text-blue-400 border border-white/5 hover:bg-blue-500/10 hover:border-blue-500/30 active:bg-blue-500 active:text-white"
                    )}
                >
                    {hasUsername ? <Copy size={20} strokeWidth={2.5} /> : <KeyRound size={22} strokeWidth={2.5} />}
                </button>

                {!hasUsername && <ChevronRight size={20} className="text-zinc-700 ml-1" />}
            </div>
        </div>
    );
};