import { useState, useEffect, useCallback } from 'react';
import { 
    auth, 
    db, 
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
    logOut
} from '../services/firebase';

// Hook de autenticación real con Firebase
export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser(firebaseUser);
                setUserId(firebaseUser.uid);
            } else {
                setUser(null);
                setUserId(null);
            }
            setIsAuthReady(true);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const signOut = useCallback(async () => {
        try {
            await logOut();
            setUser(null);
            setUserId(null);
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }, []);

    return { 
        user, 
        userId, 
        isAuthReady, 
        loading,
        isAuthenticated: !!user,
        displayName: user?.displayName || user?.email || 'Usuario',
        email: user?.email,
        signOut
    };
};

// Hook de perfil con Firestore
export const useProfile = (userId) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setIsLoading(false);
            return;
        }

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
            const profileWithTimestamp = {
                ...profileData,
                updatedAt: serverTimestamp(),
                createdAt: profile?.createdAt || serverTimestamp()
            };
            
            await setDoc(doc(db, 'profiles', userId), profileWithTimestamp);
            setProfile(profileData);
        } catch (error) {
            console.error('Error guardando perfil:', error);
        }
    }, [userId, profile]);

    return { profile, isLoading, saveProfile };
};

// Hook de registros con Firestore
export const useRecords = (userId) => {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setRecords([]);
            setLoading(false);
            return;
        }

        const recordsRef = collection(db, 'users', userId, 'records');
        const q = query(recordsRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const recordsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
            setRecords(recordsData);
            setLoading(false);
        }, (error) => {
            console.error('Error cargando registros:', error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [userId]);

    const addRecord = useCallback(async (recordData) => {
        if (!userId) return;

        try {
            await addDoc(collection(db, 'users', userId, 'records'), {
                ...recordData,
                timestamp: serverTimestamp(),
                createdAt: serverTimestamp()
            });
        } catch (error) {
            console.error('Error agregando registro:', error);
        }
    }, [userId]);

    return { records, addRecord, loading };
};

// Hook de comidas con Firestore
export const useMeals = (userId) => {
    const [meals, setMeals] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!userId) {
            setMeals([]);
            setLoading(false);
            return;
        }

        const mealsRef = collection(db, 'users', userId, 'meals');
        const q = query(mealsRef, orderBy('timestamp', 'desc'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const mealsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date(),
                createdAt: doc.data().createdAt?.toDate() || new Date()
            }));
            setMeals(mealsData);
            setLoading(false);
        }, (error) => {
            console.error('Error cargando comidas:', error);
            setLoading(false);
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

    return { meals, addMeal, loading };
};
