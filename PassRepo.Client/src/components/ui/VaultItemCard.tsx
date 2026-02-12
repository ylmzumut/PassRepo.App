import React from 'react';
import { Copy, ChevronRight } from 'lucide-react';
import { LogoIcon } from './LogoIcon';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

interface VaultItemCardProps {
    title: string; // The decrypted URL or custom title
    username: string;
    onClick: () => void;
    onCopyPassword?: () => void; // Optional direct action
}

export const VaultItemCard: React.FC<VaultItemCardProps> = ({ title, username, onClick, onCopyPassword }) => {

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (onCopyPassword) {
            onCopyPassword();
        } else {
            toast.info("Şifre kopyalama için detaya gidin");
        }
    };

    return (
        <div
            onClick={onClick}
            className={cn(
                "flex items-center p-4 gap-4 rounded-xl bg-zinc-900 border border-zinc-800/50",
                "hover:bg-zinc-800/80 active:bg-zinc-800 transition-colors cursor-pointer"
            )}
        >
            {/* Icon */}
            <div className="shrink-0">
                <LogoIcon title={title} className="h-12 w-12 rounded-2xl" />
            </div>

            {/* Text Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-base font-medium text-zinc-100 truncate">{title}</h4>
                <p className="text-sm text-zinc-500 truncate">{username}</p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
                <button
                    onClick={handleCopy}
                    className="p-2 rounded-full text-zinc-400 hover:text-indigo-400 hover:bg-zinc-700/50 transition-colors"
                >
                    <Copy className="h-5 w-5" />
                </button>
                <ChevronRight className="h-5 w-5 text-zinc-600" />
            </div>
        </div>
    );
};
