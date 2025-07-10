import { useState, useEffect, useCallback } from 'react';
import { 
    auth, 
    db, 
    signIn, 
    onAuthStateChanged, 
    doc, 
    getDoc, 
    setDoc, 
    addDoc, 
    collection, 
    query, 
    onSnapshot, 
    serverTimestamp,
    orderBy,
    where
} from '../services/firebase';

// Hook de autenticación con Firebase
export const useAuth = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                setUserId(user.uid);
            } else {
                // Si no hay usuario, iniciar sesión anónima
                await signIn();
            }
            setIsAuthReady(true);
        });

        return () => unsubscribe();
    }, []);

    return { userId, isAuthReady };
};

// Hook de perfil con Firestore
export const useProfile = (userId) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;

        const loadProfile = async () => {
            try {
                const profileDoc = await getDoc(doc(db, 'profiles', userId));
                if (profileDoc.exists()) {
                    setProfile(profileDoc.data());
                }
            } catch (error) {
                console.error('Error cargando perfil:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadProfile();
    }, [userId]);

    const saveProfile = useCallback(async (profileData) => {
        if (!userId) return;

        try {
            await setDoc(doc(db, 'profiles', userId), {
                ...profileData,
                updatedAt: serverTimestamp()
            });
            setProfile(profileData);
        } catch (error) {
            console.error('Error guardando perfil:', error);
        }
    }, [userId]);

    return { profile, isLoading, saveProfile };
};

// Hook de registros con Firestore
export const useRecords = (userId) => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        if (!userId) return;

        const recordsRef = collection(db, 'users', userId, 'records');
        const q = query(recordsRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const recordsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convertir Firestore timestamp a Date
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
            setRecords(recordsData);
        });

        return () => unsubscribe();
    }, [userId]);

    const addRecord = useCallback(async (recordData) => {
        if (!userId) return;

        try {
            await addDoc(collection(db, 'users', userId, 'records'), {
                ...recordData,
                timestamp: serverTimestamp()
            });
        } catch (error) {
            console.error('Error agregando registro:', error);
        }
    }, [userId]);

    return { records, addRecord };
};

// Hook de comidas con Firestore
export const useMeals = (userId) => {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        if (!userId) return;

        const mealsRef = collection(db, 'users', userId, 'meals');
        const q = query(mealsRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const mealsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                // Convertir Firestore timestamps a Date
                timestamp: doc.data().timestamp?.toDate() || new Date(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            setMeals(mealsData);
        });

        return () => unsubscribe();
    }, [userId]);

    const addMeal = useCallback(async (mealData) => {
        if (!userId) return;

        try {
            await addDoc(collection(db, 'users', userId, 'meals'), {
                ...mealData,
                timestamp: mealData.timestamp || serverTimestamp(),
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error agregando comida:', error);
        }
    }, [userId]);

    return { meals, addMeal };
};
