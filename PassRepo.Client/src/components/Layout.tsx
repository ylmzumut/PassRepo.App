import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
    return (
        <div className="min-h-screen bg-zinc-950 flex justify-center bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
            {/* Mobile Container */}
            <div className="w-full max-w-[430px] min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-neutral-900 via-black to-black text-white relative shadow-2xl overflow-x-hidden border-x border-zinc-900/50">
                {children}
            </div>
        </div>
    );
};
