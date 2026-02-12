export interface Category {
    id: string;
    name: string; // Artık her şeyi yazabiliriz
    iconName: string; // Örn: 'Wallet', 'Mail', 'Key'
    color: string; // Tailwind class örn: 'bg-blue-500'
}

export interface VaultItem {
    id: string;
    serviceName: string;
    username?: string;
    password?: string;
    categoryId: string; // Artık ID ile bağlayacağız
    url: string;
    logoUrl?: string;
    notes?: string;
    createdAt: number;
}