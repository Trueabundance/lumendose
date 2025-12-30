import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';
import type { FC } from 'react';

export const SplashScreen: FC = () => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="flex flex-col items-center relative z-10"
            >
                <motion.div
                    animate={{
                        boxShadow: ["0 0 20px rgba(59, 130, 246, 0.2)", "0 0 60px rgba(168, 85, 247, 0.4)", "0 0 20px rgba(59, 130, 246, 0.2)"]
                    }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    className="bg-black/60 p-8 rounded-3xl border border-white/20 backdrop-blur-xl mb-8 relative shadow-[0_0_50px_rgba(59,130,246,0.5)]"
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 rounded-3xl border border-cyan-400/30 border-t-cyan-400/80"
                    />
                    <Brain className="text-cyan-400 w-24 h-24 drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]" strokeWidth={1.5} />
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-center"
                >
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-teal-400 text-transparent bg-clip-text mb-2 tracking-tight">
                        LumenDose
                    </h1>
                    <p className="text-gray-400 text-sm tracking-widest uppercase">Mindful Drinking</p>
                </motion.div>
            </motion.div>
        </div>
    );
};
