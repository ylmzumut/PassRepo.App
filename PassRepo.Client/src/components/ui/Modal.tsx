import React from 'react';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={{ y: 0 }}
                        exit={{ y: "100%" }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-x-0 bottom-0 mt-24 z-50 bg-zinc-900 rounded-t-[2rem] border-t border-zinc-800 shadow-2xl h-[92vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Handle bar for visual cue */}
                        <div className="w-full flex justify-center pt-3 pb-1" onTouchMove={onClose}>
                            <div className="w-12 h-1.5 rounded-full bg-zinc-700/50" />
                        </div>

                        <div className="px-6 py-4 flex justify-between items-center sticky top-0 bg-zinc-900 z-10">
                            <h2 className="text-xl font-bold text-white">{title}</h2>
                            <button onClick={onClose} className="p-2 bg-zinc-800 rounded-full text-zinc-400">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="p-6 pt-0 pb-24">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};
