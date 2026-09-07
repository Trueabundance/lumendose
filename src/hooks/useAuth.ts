import { useState, useEffect } from 'react';
import { onAuthStateChanged, type User, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../services/firebase';

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!auth) {
            setLoading(false);
            return;
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setUser(user);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const login = async (email: string, pass: string) => {
        if (!auth) throw new Error("Auth not initialized");
        return signInWithEmailAndPassword(auth, email, pass);
    };

    const signup = async (email: string, pass: string) => {
        if (!auth) throw new Error("Auth not initialized");
        return createUserWithEmailAndPassword(auth, email, pass);
    };

    const logout = async () => {
        if (!auth) throw new Error("Auth not initialized");
        return signOut(auth);
    };

    return { user, loading, login, signup, logout };
};
