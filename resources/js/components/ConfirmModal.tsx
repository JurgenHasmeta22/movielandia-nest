import { AnimatePresence, motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';

interface ConfirmModalProps {
    open: boolean;
    title?: string;
    message: string;
    confirmLabel?: string;
    confirmVariant?: 'danger' | 'primary';
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmModal({
    open,
    title = 'Confirm',
    message,
    confirmLabel = 'Confirm',
    confirmVariant = 'danger',
    onConfirm,
    onCancel,
}: ConfirmModalProps) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[200] flex items-center justify-center px-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.18 }}
                >
                    <motion.div
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        onClick={onCancel}
                    />
                    <motion.div
                        className="relative z-10 w-full max-w-sm bg-gray-900 border border-gray-700/80 rounded-2xl shadow-2xl overflow-hidden"
                        initial={{ scale: 0.88, opacity: 0, y: 16 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.88, opacity: 0, y: 16 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 36 }}
                    >
                        <div className="p-6">
                            <div className="flex items-start gap-4 mb-5">
                                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                                    confirmVariant === 'danger'
                                        ? 'bg-red-500/15 text-red-400'
                                        : 'bg-indigo-500/15 text-indigo-400'
                                }`}>
                                    <AlertTriangle size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-semibold text-white leading-tight">{title}</h3>
                                    <p className="text-sm text-gray-400 mt-1 leading-relaxed">{message}</p>
                                </div>
                            </div>
                            <div className="flex gap-3 justify-end">
                                <button
                                    onClick={onCancel}
                                    className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-150"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={onConfirm}
                                    className={`px-5 py-2 text-sm font-semibold rounded-xl transition-all duration-150 ${
                                        confirmVariant === 'danger'
                                            ? 'bg-red-600 hover:bg-red-500 text-white shadow-lg shadow-red-500/20'
                                            : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-500/20'
                                    }`}
                                >
                                    {confirmLabel}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
