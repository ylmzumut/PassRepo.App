import React from 'react';
import { Landmark, Mail, Key, Briefcase, Share2, MoreHorizontal } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useViewStore } from '../../store/viewStore';
import type { Category } from '../../types';

interface CategoryCardProps {
    name: Category['name'];
    icon: React.ElementType;
    color: string;
    count: number;
    onClick: () => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ name, icon: Icon, color, count, onClick }) => {
    // Extract color base (e.g. 'bg-blue-600' -> 'blue') might be complex with arbitrary tailwind classes.
    // For simplicity, let's assume 'color' prop passed is 'text-blue-400' or similar, OR we map generic colors.
    // However, the prompt says: "For 'Banka', the icon wrapper should have bg-blue-500/10 text-blue-400".
    // The current mock data sends 'bg-blue-600'. I'll adjust the rendering to try and derive the style or just use the passed color as bg with low opacity.

    // Quick fix: Map the incoming solid bg color to a corresponding style manually or use style prop.
    // Actually, let's do a simple mapping based on the color class string if possible, or just use the passed color with opacity if it's a tailwind class? 
    // Tailwind doesn't support dynamic class modification easily like `bg-blue-600/10`.
    // Let's rely on the `color` prop being the primary color and we style around it.

    // Better approach for this task: changing the prop usage. 
    // But to avoid breaking changes, let's rewrite the render to use inline styles or specific class logic.
    // Let's assume the `color` prop is exactly what we want for the icon background opacity.

    // To achieve the requested look, let's just make the card glass and the icon contain the color.

    return (
        <button
            onClick={onClick}
            className="aspect-square bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 active:scale-[0.98] transition-all duration-200 group relative overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]"
        >
            <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-110", color.replace('bg-', 'bg-').replace('600', '500/10').replace('500', '500/10') + " " + color.replace('bg-', 'text-').replace('600', '400').replace('500', '400'))}>
                <Icon size={28} strokeWidth={2} />
            </div>

            <div className="text-center z-10">
                <span className="block text-zinc-200 font-bold text-base tracking-tight">{name}</span>
                <span className="block text-neutral-500 text-xs font-medium mt-1">{count} Öğe</span>
            </div>
        </button>
    );
};

export const CategoryGrid = () => {
    const { selectCategory } = useViewStore();

    // In a real app, these counts would come from the store/database
    const categories = [
        { name: 'Banka', icon: Landmark, color: 'bg-blue-600' },
        { name: 'Mail', icon: Mail, color: 'bg-red-500' },
        { name: 'Sosyal', icon: Share2, color: 'bg-sky-500' },
        { name: 'İş', icon: Briefcase, color: 'bg-amber-600' },
        { name: 'Genel', icon: Key, color: 'bg-emerald-500' },
        { name: 'Diğer', icon: MoreHorizontal, color: 'bg-violet-500' },
    ] as const;

    return (
        <div className="grid grid-cols-2 gap-4 px-2 pb-24">
            {categories.map((cat) => (
                <CategoryCard
                    key={cat.name}
                    name={cat.name}
                    icon={cat.icon}
                    color={cat.color}
                    count={0} // Mock count for now
                    onClick={() => selectCategory(cat.name)}
                />
            ))}
        </div>
    );
};
