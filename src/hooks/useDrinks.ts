import { useState, useEffect } from 'react';
import { collection, query, onSnapshot, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db, appId } from '../services/firebase';
import type { Drink } from '../types';

export const useDrinks = (userId: string | null) => {
    const [drinks, setDrinks] = useState<Drink[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db || !userId) {
            setDrinks([]);
            setLoading(false);
            return;
        }

        const q = query(collection(db, `artifacts/${appId}/users/${userId}/drinks`));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const drinksData: Drink[] = [];
            snapshot.forEach((doc) => {
                drinksData.push({ id: doc.id, ...doc.data() } as Drink);
            });
            // Sort by timestamp desc
            drinksData.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
            setDrinks(drinksData);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const addDrink = async (drink: Omit<Drink, 'id'>) => {
        if (!db || !userId) return;
        await addDoc(collection(db, `artifacts/${appId}/users/${userId}/drinks`), drink);
    };

    const deleteDrink = async (id: string) => {
        if (!db || !userId) return;
        await deleteDoc(doc(db, `artifacts/${appId}/users/${userId}/drinks`, id));
    };

    return { drinks, loading, addDrink, deleteDrink };
};
