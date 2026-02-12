import React from 'react';
import { Landmark, Mail, Key } from 'lucide-react';
import { cn } from '../../lib/utils'; // Assuming utils exists from previous tasks

interface QuickAccessCardProps {
    title: string;
    icon: React.ElementType;
    colorClass: string;
    columnSpan?: string;
    onClick?: () => void;
}

const QuickAccessCard: React.FC<QuickAccessCardProps> = ({ title, icon: Icon, colorClass, columnSpan = "col-span-1", onClick }) => {
    return (
        <button
            onClick={onClick}
            className={cn(
                "bg-zinc-900 rounded-3xl p-5 flex flex-col justify-between h-28 relative overflow-hidden group border border-zinc-800/50",
                "active:scale-95 transition-all duration-200",
                columnSpan
            )}
        >
            {/* Background Gradient Blob */}
            <div className={cn("absolute -right-4 -top-4 w-16 h-16 rounded-full blur-2xl opacity-20 group-hover:opacity-30 transition-opacity", colorClass)}></div>

            <div className={cn("p-2.5 rounded-full w-fit bg-zinc-800/80 backdrop-blur-sm text-white")}>
                <Icon size={20} strokeWidth={2} />
            </div>
            <span className="text-zinc-300 font-medium text-sm tracking-wide self-start">{title}</span>
        </button>
    );
};

export const QuickAccess = () => {
    return (
        <div className="grid grid-cols-2 gap-3 px-1 mt-4">
            <QuickAccessCard
                title="Banka"
                icon={Landmark}
                colorClass="bg-blue-500"
                onClick={() => console.log('Banka')}
            />
            <QuickAccessCard
                title="Mail"
                icon={Mail}
                colorClass="bg-red-500"
                onClick={() => console.log('Mail')}

            />
            <QuickAccessCard
                title="Genel"
                icon={Key}
                colorClass="bg-emerald-500"
                columnSpan="col-span-2"
                onClick={() => console.log('Genel')}
            />
        </div>
    );
};
