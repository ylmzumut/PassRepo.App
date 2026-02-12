import React from 'react';
import { Copy, User, KeyRound, ChevronRight } from 'lucide-react';
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
        toast.success(`${label} kopyalandı`);
        if (navigator.vibrate) navigator.vibrate(50);
    };

    return (
        <div
            onClick={onSelect}
            className="group w-full h-[76px] flex items-center justify-between px-3 py-2 border-b border-white/5 active:bg-white/5 transition-colors cursor-pointer"
        >
            {/* Left: Logo */}
            <div className="h-12 w-12 min-w-[48px] rounded-2xl bg-gradient-to-br from-neutral-800 to-neutral-900 border border-white/10 flex items-center justify-center overflow-hidden shrink-0 shadow-inner">
                <LogoIcon title={item.url || item.serviceName} className="h-7 w-7 opacity-90" />
            </div>

            {/* Middle: Info */}
            <div className={cn("flex flex-col ml-4 flex-1 overflow-hidden justify-center h-full", !hasUsername && "py-1")}>
                <span className={cn("font-bold text-zinc-100 truncate tracking-tight transition-all", hasUsername ? "text-[16px]" : "text-[17px]")}>
                    {item.serviceName}
                </span>
                {hasUsername && (
                    <span className="text-[13px] text-neutral-500 truncate font-medium mt-0.5">
                        {item.username}
                    </span>
                )}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-3 pl-2">

                {/* User Copy Button (Only if username exists) */}
                {hasUsername && (
                    <button
                        onClick={(e) => copyToClipboard(item.username, 'Kullanıcı adı', e)}
                        className="h-11 w-11 flex items-center justify-center rounded-full bg-white/5 text-neutral-400 hover:text-white transition-all active:scale-90 active:bg-white/10"
                    >
                        <User size={20} strokeWidth={2} />
                    </button>
                )}

                {/* Password Copy Button (Large) */}
                <button
                    onClick={(e) => copyToClipboard(item.password, 'Parola', e)}
                    className={cn(
                        "flex items-center justify-center rounded-full bg-white/5 text-blue-400 active:bg-blue-500 active:text-white transition-all duration-200 active:scale-95 border border-white/5",
                        "h-11 w-11 p-2.5"
                    )}
                >
                    {hasUsername ? <Copy size={20} strokeWidth={2.5} /> : <KeyRound size={20} strokeWidth={2.5} />}
                </button>

                {!hasUsername && <ChevronRight size={20} className="text-neutral-600 ml-2" />}
            </div>
        </div>
    );
};
