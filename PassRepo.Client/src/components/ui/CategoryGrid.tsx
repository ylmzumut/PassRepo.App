import React from 'react';
import { useCategoryStore } from '../../store/categoryStore';
import { useViewStore } from '../../store/viewStore';
import * as LucideIcons from 'lucide-react'; // İkonları dinamik çağırmak için
import { cn } from '../../lib/utils';
import { motion } from 'framer-motion';

export const CategoryGrid = () => {
    const { categories } = useCategoryStore();
    const { selectCategory } = useViewStore();

    // Renklerin "Glow" (Parlama) efektini hesaplamak için yardımcı fonksiyon
    const getGlowColor = (bgClass: string) => {
        // bg-blue-600 -> shadow-blue-500/30 gibi bir dönüşüm yapar
        if (bgClass.includes('blue')) return 'shadow-blue-500/30 text-blue-400';
        if (bgClass.includes('red')) return 'shadow-red-500/30 text-red-400';
        if (bgClass.includes('emerald')) return 'shadow-emerald-500/30 text-emerald-400';
        if (bgClass.includes('orange')) return 'shadow-orange-500/30 text-orange-400';
        if (bgClass.includes('purple')) return 'shadow-purple-500/30 text-purple-400';
        if (bgClass.includes('pink')) return 'shadow-pink-500/30 text-pink-400';
        if (bgClass.includes('yellow')) return 'shadow-yellow-500/30 text-yellow-400';
        if (bgClass.includes('sky')) return 'shadow-sky-500/30 text-sky-400';
        return 'shadow-white/10 text-white';
    };

    return (
        <div className="grid grid-cols-2 gap-4">
            {categories.map((cat, index) => {
                // Dinamik İkon Seçimi (String -> Component)
                // @ts-ignore
                const IconComponent = LucideIcons[cat.iconName] || LucideIcons.Circle;
                const glowStyle = getGlowColor(cat.color);

                return (
                    <motion.button
                        key={cat.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => selectCategory(cat.name)}
                        className={cn(
                            "group relative aspect-square rounded-[2rem] p-5 flex flex-col justify-between text-left transition-all duration-300",
                            "bg-zinc-900 border border-white/5 hover:border-white/10 active:scale-95"
                        )}
                    >
                        {/* Arka Plan Gradient (Hafif) */}
                        <div className={cn(
                            "absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-10 transition-opacity bg-gradient-to-br",
                            cat.color.replace('bg-', 'from-').replace('-600', '-500').replace('-500', '-500') + " to-transparent"
                        )} />

                        {/* İkon Kutusu */}
                        <div className={cn(
                            "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-lg",
                            cat.color, // Arka plan rengi (Örn: bg-blue-600)
                            "text-white"
                        )}>
                            <IconComponent size={24} strokeWidth={2.5} />
                        </div>

                        {/* Yazılar */}
                        <div className="z-10">
                            <h3 className="text-lg font-bold text-white tracking-tight group-hover:translate-x-1 transition-transform">
                                {cat.name}
                            </h3>
                            {/* Buraya ilerde "5 Öğe" gibi sayaç ekleyebiliriz */}
                            <span className="text-xs font-medium text-zinc-500 group-hover:text-zinc-400 transition-colors">
                                Kasa
                            </span>
                        </div>

                        {/* Sağ Üst Ok (Hover Efekti) */}
                        <div className="absolute top-5 right-5 opacity-0 group-hover:opacity-100 transition-opacity text-zinc-500">
                            <LucideIcons.ArrowUpRight size={20} />
                        </div>
                    </motion.button>
                );
            })}

            {/* Boş Durumda (Hiç Kategori Yoksa) Uyarı */}
            {categories.length === 0 && (
                <div className="col-span-2 p-8 text-center border border-dashed border-zinc-800 rounded-3xl text-zinc-500">
                    <p>Henüz kategori yok. Ayarlardan ekleyebilirsin.</p>
                </div>
            )}
        </div>
    );
};