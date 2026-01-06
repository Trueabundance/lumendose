import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { ReactNode, FC } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
    className?: string;
}

export const Modal: FC<ModalProps> = ({ isOpen, onClose, title, children, className = '' }) => {
    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`w-full max-w-md max-h-[90vh] flex flex-col bg-gray-800/90 border border-white/10 rounded-2xl shadow-2xl overflow-hidden ${className}`}
                        >
                            <div className="flex justify-between items-center p-4 border-b border-white/10 shrink-0">
                                {title && <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>}
                                <button
                                    onClick={onClose}
                                    className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="p-6 overflow-y-auto custom-scrollbar">
                                {children}
                            </div>
                        </motion.div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
};
