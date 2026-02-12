import React, { useState } from 'react';
import { Copy, Eye, EyeOff, Trash2, ExternalLink } from 'lucide-react';
import { LogoIcon } from './LogoIcon';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

interface VaultDetailProps {
    item: {
        id: string;
        url: string;
        username: string;
        decryptedPassword?: string;
        notes: string;
    };
    onClose: () => void;
    onDelete: (id: string) => void;
}

export const VaultDetail: React.FC<VaultDetailProps> = ({ item, onClose, onDelete }) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleCopy = (text: string, label: string) => {
        navigator.clipboard.writeText(text);
        toast.success(`${label} kopyalandı`);
    };

    const handleDelete = () => {
        if (confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
            onDelete(item.id);
            onClose();
        }
    };

    return (
        <div className="flex flex-col items-center space-y-8">
            {/* Header / Logo */}
            <div className="flex flex-col items-center space-y-4">
                <LogoIcon title={item.url} className="h-24 w-24 text-4xl shadow-2xl shadow-indigo-500/20" />
                <h2 className="text-2xl font-bold text-white max-w-[250px] text-center truncate">{item.url}</h2>
            </div>

            {/* Actions / Details */}
            <div className="w-full space-y-4">

                {/* Username Field */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest pl-1">Kullanıcı Adı</label>
                    <div className="flex items-center gap-2 bg-zinc-800/50 p-1 rounded-2xl border border-zinc-800">
                        <div className="flex-1 px-4 py-3 text-zinc-200 truncate font-mono">
                            {item.username}
                        </div>
                        <button
                            onClick={() => handleCopy(item.username, 'Kullanıcı adı')}
                            className="p-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                            <Copy className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest pl-1">Parola</label>
                    <div className="flex items-center gap-2 bg-zinc-800/50 p-1 rounded-2xl border border-zinc-800">
                        <div className="flex-1 px-4 py-3 text-zinc-200 truncate font-mono tracking-widest">
                            {showPassword ? item.decryptedPassword : '••••••••••••••••'}
                        </div>
                        <button
                            onClick={() => setShowPassword(!showPassword)}
                            className="p-3 text-zinc-400 hover:text-white transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                        </button>
                        <button
                            onClick={() => handleCopy(item.decryptedPassword || '', 'Parola')}
                            className="p-3 bg-zinc-800 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                        >
                            <Copy className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                {/* Website Link */}
                <div className="space-y-2">
                    <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest pl-1">Website</label>
                    <a
                        href={item.url.startsWith('http') ? item.url : `https://${item.url}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between gap-2 bg-zinc-800/30 p-4 rounded-2xl border border-zinc-800/50 hover:bg-zinc-800 hover:border-zinc-700 transition-all group"
                    >
                        <span className="text-indigo-400 group-hover:text-indigo-300 truncate">{item.url}</span>
                        <ExternalLink className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400" />
                    </a>
                </div>

                {/* Notes Field */}
                {item.notes && (
                    <div className="space-y-2">
                        <label className="text-xs font-medium text-zinc-500 uppercase tracking-widest pl-1">Notlar</label>
                        <div className="bg-zinc-800/30 p-4 rounded-2xl border border-zinc-800/50 text-zinc-400 text-sm whitespace-pre-wrap">
                            {item.notes}
                        </div>
                    </div>
                )}

            </div>

            {/* Delete Action */}
            <div className="pt-4 w-full">
                <button
                    onClick={handleDelete}
                    className="w-full py-4 text-red-500 font-medium hover:bg-red-500/10 rounded-2xl transition-colors flex items-center justify-center gap-2"
                >
                    <Trash2 className="h-5 w-5" />
                    Kaydı Sil
                </button>
            </div>
        </div>
    );
};
