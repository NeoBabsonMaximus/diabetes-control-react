import { useState, useEffect, useCallback } from 'react';

// Hook de autenticación híbrido (localStorage + Firebase opcional)
export const useAuth = () => {
    const [userId] = useState('local-user-123'); // Usuario local fijo
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        // Simular carga rápida
        setTimeout(() => {
            setIsAuthReady(true);
        }, 500);
    }, []);

    return { userId, isAuthReady };
};

// Hook de perfil híbrido
export const useProfile = (userId) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        
        // Cargar desde localStorage inmediatamente
        setTimeout(() => {
            const savedProfile = localStorage.getItem('hybrid-profile');
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
            }
            setIsLoading(false);
        }, 300);
    }, [userId]);

    const saveProfile = useCallback(async (profileData) => {
        if (!userId) return;
        
        // Guardar en localStorage inmediatamente
        localStorage.setItem('hybrid-profile', JSON.stringify(profileData));
        setProfile(profileData);

        // Intentar guardar en Firebase en segundo plano (sin bloquear)
        try {
            const { db, doc, setDoc, serverTimestamp } = await import('../services/firebase');
            await setDoc(doc(db, 'profiles', userId), {
                ...profileData,
                updatedAt: serverTimestamp()
            });
            console.log('✅ Perfil sincronizado con Firebase');
        } catch (error) {
            console.log('⚠️ Firebase no disponible, usando solo localStorage:', error.message);
        }
    }, [userId]);

    return { profile, isLoading, saveProfile };
};

// Hook de registros híbrido
export const useRecords = (userId) => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        if (!userId) return;
        
        // Cargar desde localStorage inmediatamente
        const savedRecords = localStorage.getItem('hybrid-records');
        if (savedRecords) {
            const parsedRecords = JSON.parse(savedRecords);
            const recordsWithDates = parsedRecords.map(record => ({
                ...record,
                timestamp: record.timestamp ? new Date(record.timestamp) : new Date()
            }));
            recordsWithDates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            setRecords(recordsWithDates);
        }

        // Intentar sincronizar con Firebase en segundo plano
        syncWithFirebase(userId, setRecords);
    }, [userId]);

    const addRecord = useCallback(async (recordData) => {
        if (!userId) return;
        
        const newRecord = {
            id: Date.now().toString(),
            ...recordData,
            timestamp: new Date()
        };
        
        // Actualizar localStorage inmediatamente
        const updatedRecords = [newRecord, ...records];
        setRecords(updatedRecords);
        localStorage.setItem('hybrid-records', JSON.stringify(updatedRecords));

        // Intentar guardar en Firebase en segundo plano
        try {
            const { db, collection, addDoc, serverTimestamp } = await import('../services/firebase');
            await addDoc(collection(db, 'users', userId, 'records'), {
                ...recordData,
                timestamp: serverTimestamp()
            });
            console.log('✅ Registro sincronizado con Firebase');
        } catch (error) {
            console.log('⚠️ Firebase no disponible, guardado solo localmente:', error.message);
        }
    }, [userId, records]);

    return { records, addRecord };
};

// Hook de comidas híbrido
export const useMeals = (userId) => {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        if (!userId) return;
        
        // Cargar desde localStorage inmediatamente
        const savedMeals = localStorage.getItem('hybrid-meals');
        if (savedMeals) {
            const parsedMeals = JSON.parse(savedMeals);
            const mealsWithDates = parsedMeals.map(meal => ({
                ...meal,
                timestamp: meal.timestamp ? new Date(meal.timestamp) : new Date(),
                createdAt: meal.createdAt ? new Date(meal.createdAt) : new Date()
            }));
            mealsWithDates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            setMeals(mealsWithDates);
        } else {
            // Datos de demostración para comidas
            const demoMeals = generateDemoMeals();
            setMeals(demoMeals);
            localStorage.setItem('hybrid-meals', JSON.stringify(demoMeals));
        }
    }, [userId]);

    const addMeal = useCallback(async (mealData) => {
        if (!userId) return;
        
        const newMeal = {
            ...mealData,
            id: Date.now().toString()
        };
        
        // Actualizar localStorage inmediatamente
        const updatedMeals = [newMeal, ...meals];
        setMeals(updatedMeals);
        localStorage.setItem('hybrid-meals', JSON.stringify(updatedMeals));

        // Intentar guardar en Firebase en segundo plano
        try {
            const { db, collection, addDoc, serverTimestamp } = await import('../services/firebase');
            await addDoc(collection(db, 'users', userId, 'meals'), {
                ...mealData,
                timestamp: mealData.timestamp || serverTimestamp(),
                createdAt: serverTimestamp()
            });
            console.log('✅ Comida sincronizada con Firebase');
        } catch (error) {
            console.log('⚠️ Firebase no disponible, guardado solo localmente:', error.message);
        }
    }, [userId, meals]);

    return { meals, addMeal };
};

// Función para sincronizar con Firebase en segundo plano
const syncWithFirebase = async (userId, setRecords) => {
    try {
        const { db, collection, query, onSnapshot, orderBy } = await import('../services/firebase');
        const recordsRef = collection(db, 'users', userId, 'records');
        const q = query(recordsRef, orderBy('timestamp', 'desc'));

        onSnapshot(q, (snapshot) => {
            const recordsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
                timestamp: doc.data().timestamp?.toDate() || new Date()
            }));
            setRecords(recordsData);
            // Actualizar localStorage con datos de Firebase
            localStorage.setItem('hybrid-records', JSON.stringify(recordsData));
            console.log('✅ Registros sincronizados desde Firebase');
        });
    } catch (error) {
        console.log('⚠️ No se pudo conectar a Firebase para sincronización:', error.message);
    }
};

// Función para generar datos de demo de comidas
const generateDemoMeals = () => {
    const now = new Date();
    const demoMeals = [];

    // Generar comidas de los últimos 3 días
    for (let i = 0; i < 3; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Desayuno
        demoMeals.push({
            id: `demo-meal-${i}-breakfast`,
            timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 30),
            createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 30),
            type: 'desayuno',
            foods: [
                {
                    id: Date.now() + Math.random(),
                    food: {
                        id: 'avena',
                        name: 'Avena cocida',
                        carbs: 12.0,
                        protein: 2.4,
                        fat: 1.4,
                        fiber: 1.7,
                        calories: 68,
                        servingSize: 200
                    },
                    quantity: 200
                }
            ],
            nutrition: {
                carbs: 24.0,
                protein: 4.8,
                fat: 2.8,
                fiber: 3.4,
                calories: 136
            },
            carbUnits: 1.6,
            notes: 'Desayuno ligero'
        });
    }

    return demoMeals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};
