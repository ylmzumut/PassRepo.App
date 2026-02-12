import React, { useMemo } from 'react';
import * as SimpleIcons from 'simple-icons';
import { Shield } from 'lucide-react';
import { cn } from '../../lib/utils';

interface LogoIconProps {
    title: string;
    logoId?: number; // Future use if we store ID
    className?: string;
}

export const LogoIcon: React.FC<LogoIconProps> = ({ title, className }) => {

    // Normalize title to find icon (e.g. "GitHub" -> "github")
    const iconData = useMemo(() => {
        if (!title) return null;

        const normalized = title.toLowerCase().replace(/[^a-z0-9]/g, '');
        const iconName = 'si' + normalized.charAt(0).toUpperCase() + normalized.slice(1);

        // Check if simple-icons has it (it exports as siBrandname)
        // Dynamic access to the module
        // @ts-ignore - SimpleIcons structure
        const foundIcon = SimpleIcons[iconName] || Object.values(SimpleIcons).find(i => i.title.toLowerCase() === title.toLowerCase());

        return foundIcon;
    }, [title]);

    if (iconData) {
        return (
            <div
                className={cn("flex items-center justify-center rounded-xl bg-zinc-800 p-2 text-white", className)}
                style={{ backgroundColor: `#${iconData.hex}` }}
            >
                <svg
                    role="img"
                    viewBox="0 0 24 24"
                    className="h-6 w-6 fill-white"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path d={iconData.path} />
                </svg>
            </div>
        );
    }

    // Fallback: Generic Shield or Letter
    return (
        <div className={cn("flex items-center justify-center rounded-xl bg-zinc-700 text-zinc-300", className)}>
            <span className="text-lg font-bold">{title ? title.charAt(0).toUpperCase() : <Shield className="h-6 w-6" />}</span>
        </div>
    );
};
