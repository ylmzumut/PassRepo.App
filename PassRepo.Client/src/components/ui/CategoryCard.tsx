import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

interface CategoryCardProps {
    title: string;
    icon: LucideIcon;
    count?: number;
    onClick?: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({ title, icon: Icon, count, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-start justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800/50",
                "hover:bg-zinc-800 transition-colors active:scale-95 duration-200",
                "h-28 w-full"
            )}
        >
            <div className="p-2 rounded-lg bg-zinc-800/50 text-indigo-400">
                <Icon className="h-6 w-6" />
            </div>
            <div className="text-left">
                <h3 className="text-sm font-semibold text-zinc-200">{title}</h3>
                {count !== undefined && <p className="text-xs text-zinc-500">{count} öğe</p>}
            </div>
        </button>
    );
};
