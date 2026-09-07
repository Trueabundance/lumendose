import { type FC, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Brain, Sparkles } from 'lucide-react';
import { Button } from '../components/Button';
import { Card } from '../components/Card';

export const AuthScreen: FC = () => {
    const { login, signup } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (isLogin) {
                await login(email, password);
            } else {
                await signup(email, password);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-gray-900 pointer-events-none" />

            <div className="w-full max-w-md relative z-10">
                <div className="flex flex-col items-center mb-8">
                    <div className="relative mb-4">
                        <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 rounded-full" />
                        <Brain className="text-blue-400 relative z-10" size={64} />
                    </div>
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">
                        LumenDose
                    </h1>
                    <p className="text-gray-400 mt-2">Mindful drinking, visualized.</p>
                </div>

                <Card>
                    <h2 className="text-2xl font-bold text-center mb-6 text-white">
                        {isLogin ? 'Welcome Back' : 'Create Account'}
                    </h2>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded-lg mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <input
                                type="email"
                                placeholder="Email address"
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full bg-gray-700/50 border border-gray-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <Button
                            className="w-full"
                            isLoading={loading}
                            icon={!loading && <Sparkles size={18} />}
                        >
                            {isLogin ? 'Sign In' : 'Get Started'}
                        </Button>
                    </form>

                    <p className="text-center text-gray-400 mt-6 text-sm">
                        {isLogin ? "Don't have an account?" : "Already have an account?"}
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="text-blue-400 hover:text-blue-300 ml-2 font-semibold transition-colors"
                        >
                            {isLogin ? 'Sign up' : 'Log in'}
                        </button>
                    </p>
                </Card>
            </div>
        </div>
    );
};
