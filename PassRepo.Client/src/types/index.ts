import type { LucideIcon } from 'lucide-react';

export interface Category {
    id: string;
    name: 'Banka' | 'Mail' | 'Genel' | 'Sosyal' | 'İş' | 'Diğer';
    icon: LucideIcon;
    color: string; // Tailwind color class like 'bg-blue-500'
}

export interface VaultItem {
    id: string;
    serviceName: string;
    username?: string; // Optional now
    password?: string;
    category: Category['name'];
    url: string; // for logo
    logoUrl?: string;
    notes?: string;
}
