import React from 'react';
import * as Icons from 'lucide-react';
import { cn } from '../../lib/utils';

interface IconPickerProps {
    selectedIcon: string;
    onSelect: (iconName: string) => void;
}

const AVAILABLE_ICONS = [
    'Wallet', 'Landmark', 'CreditCard', 'Banknote', // Finans
    'Mail', 'AtSign', 'MessageCircle', // İletişim
    'Lock', 'Key', 'Shield', // Güvenlik
    'Briefcase', 'Building2', 'Laptop', // İş
    'Gamepad2', 'Headphones', 'Clapperboard', // Eğlence
    'ShoppingCart', 'Plane', 'Car', 'Home', // Yaşam
    'Bitcoin', 'Smartphone', 'Wifi' // Teknoloji
];

export const IconPicker: React.FC<IconPickerProps> = ({ selectedIcon, onSelect }) => {
    return (
        <div className="grid grid-cols-6 gap-2 p-2 bg-zinc-900/50 rounded-2xl border border-white/5">
            {AVAILABLE_ICONS.map((iconName) => {
                // @ts-ignore - Dinamik ikon çağırma
                const IconComponent = Icons[iconName] || Icons.HelpCircle;
                const isSelected = selectedIcon === iconName;

                return (
                    <button
                        key={iconName}
                        onClick={() => onSelect(iconName)}
                        className={cn(
                            "aspect-square flex items-center justify-center rounded-xl transition-all",
                            isSelected
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-900/50 scale-105"
                                : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
                        )}
                    >
                        <IconComponent size={20} />
                    </button>
                );
            })}
        </div>
    );
};