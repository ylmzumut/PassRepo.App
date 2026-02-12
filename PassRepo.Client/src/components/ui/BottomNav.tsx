import { Home, Plus, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BottomNavProps {
    onAddClick?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ onAddClick }) => {
    return (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-[400px] z-40">
            <div className="bg-black/60 backdrop-blur-xl rounded-[2rem] px-6 py-3 flex justify-between items-center shadow-2xl shadow-black/50 border border-white/10">
                <Link to="/" className="p-3 text-white hover:text-neutral-300 transition-colors">
                    <Home size={26} fill="currentColor" />
                </Link>

                <button
                    className="bg-white text-black rounded-full p-4 -mt-8 shadow-lg shadow-white/10 hover:scale-105 active:scale-95 transition-all border-4 border-black"
                    onClick={onAddClick}
                >
                    <Plus size={28} strokeWidth={3} />
                </button>

                <Link to="/settings" className="p-3 text-neutral-500 hover:text-white transition-colors">
                    <Settings size={26} />
                </Link>
            </div>
        </div>
    );
};
