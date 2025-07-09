import { useState, useEffect, useCallback } from 'react';

// Hook de autenticación simulado (sin Firebase)
export const useAuth = () => {
    const [userId] = useState('demo-user-123');
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        // Simular carga de autenticación
        setTimeout(() => {
            setIsAuthReady(true);
        }, 1000);
    }, []);

    return { userId, isAuthReady };
};

// Hook de perfil simulado (sin Firebase)
export const useProfile = (userId) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        
        // Simular carga del perfil
        setTimeout(() => {
            // Verificar si hay un perfil guardado en localStorage
            const savedProfile = localStorage.getItem('demo-profile');
            if (savedProfile) {
                setProfile(JSON.parse(savedProfile));
            }
            setIsLoading(false);
        }, 1500);
    }, [userId]);

    const saveProfile = useCallback(async (profileData) => {
        if (!userId) return;
        
        // Guardar en localStorage para demo
        localStorage.setItem('demo-profile', JSON.stringify(profileData));
        setProfile(profileData);
    }, [userId]);

    return { profile, isLoading, saveProfile };
};

// Hook de registros simulado (sin Firebase)
export const useRecords = (userId) => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        if (!userId) return;
        
        // Cargar registros desde localStorage
        const savedRecords = localStorage.getItem('demo-records');
        if (savedRecords) {
            const parsedRecords = JSON.parse(savedRecords);
            // Convertir timestamps de string a Date objects
            const recordsWithDates = parsedRecords.map(record => ({
                ...record,
                timestamp: record.timestamp ? new Date(record.timestamp) : new Date()
            }));
            // Ordenar por fecha (más reciente primero)
            recordsWithDates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            setRecords(recordsWithDates);
        }
    }, [userId]);

    const addRecord = useCallback(async (recordData) => {
        if (!userId) return;
        
        const newRecord = {
            id: Date.now().toString(),
            ...recordData,
            timestamp: new Date() // Usar Date normal en lugar de timestamp de Firebase
        };
        
        const updatedRecords = [newRecord, ...records];
        setRecords(updatedRecords);
        
        // Guardar en localStorage
        localStorage.setItem('demo-records', JSON.stringify(updatedRecords));
    }, [userId, records]);

    return { records, addRecord };
};

// Hook de comidas simulado (sin Firebase)
export const useMeals = (userId) => {
    const [meals, setMeals] = useState([]);

    useEffect(() => {
        if (!userId) return;
        
        // Cargar comidas desde localStorage
        const savedMeals = localStorage.getItem('demo-meals');
        if (savedMeals) {
            const parsedMeals = JSON.parse(savedMeals);
            // Convertir timestamps de string a Date objects
            const mealsWithDates = parsedMeals.map(meal => ({
                ...meal,
                timestamp: meal.timestamp ? new Date(meal.timestamp) : new Date(),
                createdAt: meal.createdAt ? new Date(meal.createdAt) : new Date()
            }));
            // Ordenar por fecha (más reciente primero)
            mealsWithDates.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            setMeals(mealsWithDates);
        } else {
            // Datos de demostración para comidas
            const demoMeals = generateDemoMeals();
            setMeals(demoMeals);
            localStorage.setItem('demo-meals', JSON.stringify(demoMeals));
        }
    }, [userId]);

    const addMeal = useCallback(async (mealData) => {
        if (!userId) return;
        
        const newMeal = {
            ...mealData,
            id: Date.now().toString()
        };
        
        const updatedMeals = [newMeal, ...meals];
        setMeals(updatedMeals);
        
        // Guardar en localStorage
        localStorage.setItem('demo-meals', JSON.stringify(updatedMeals));
    }, [userId, meals]);

    return { meals, addMeal };
};

// Función para generar datos de demo de comidas
const generateDemoMeals = () => {
    const now = new Date();
    const demoMeals = [];

    // Generar comidas de los últimos 7 días
    for (let i = 0; i < 7; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Desayuno
        if (Math.random() > 0.2) { // 80% de probabilidad
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
                    },
                    {
                        id: Date.now() + Math.random() + 1,
                        food: {
                            id: 'platano',
                            name: 'Plátano',
                            carbs: 23.0,
                            protein: 1.1,
                            fat: 0.3,
                            fiber: 2.6,
                            calories: 89,
                            servingSize: 120
                        },
                        quantity: 120
                    }
                ],
                nutrition: {
                    carbs: 51.6,
                    protein: 6.1,
                    fat: 3.2,
                    fiber: 6.8,
                    calories: 243
                },
                carbUnits: 3.4,
                notes: ''
            });
        }

        // Comida
        if (Math.random() > 0.1) { // 90% de probabilidad
            demoMeals.push({
                id: `demo-meal-${i}-lunch`,
                timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 14, 0),
                createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 14, 0),
                type: 'comida',
                foods: [
                    {
                        id: Date.now() + Math.random() + 2,
                        food: {
                            id: 'arroz_blanco',
                            name: 'Arroz blanco cocido',
                            carbs: 28.2,
                            protein: 2.7,
                            fat: 0.3,
                            fiber: 0.4,
                            calories: 130,
                            servingSize: 150
                        },
                        quantity: 150
                    },
                    {
                        id: Date.now() + Math.random() + 3,
                        food: {
                            id: 'pollo_pechuga',
                            name: 'Pechuga de pollo sin piel',
                            carbs: 0.0,
                            protein: 31.0,
                            fat: 3.6,
                            fiber: 0.0,
                            calories: 165,
                            servingSize: 100
                        },
                        quantity: 120
                    },
                    {
                        id: Date.now() + Math.random() + 4,
                        food: {
                            id: 'frijoles_negros',
                            name: 'Frijoles negros cocidos',
                            carbs: 23.0,
                            protein: 8.9,
                            fat: 0.5,
                            fiber: 8.7,
                            calories: 132,
                            servingSize: 200
                        },
                        quantity: 150
                    }
                ],
                nutrition: {
                    carbs: 59.5,
                    protein: 50.0,
                    fat: 4.7,
                    fiber: 6.5,
                    calories: 496
                },
                carbUnits: 4.0,
                notes: 'Comida casera'
            });
        }

        // Cena (algunas veces)
        if (Math.random() > 0.3) { // 70% de probabilidad
            demoMeals.push({
                id: `demo-meal-${i}-dinner`,
                timestamp: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 20, 30),
                createdAt: new Date(date.getFullYear(), date.getMonth(), date.getDate(), 20, 30),
                type: 'cena',
                foods: [
                    {
                        id: Date.now() + Math.random() + 5,
                        food: {
                            id: 'quesadilla_queso',
                            name: 'Quesadilla de queso',
                            carbs: 35.0,
                            protein: 15.0,
                            fat: 18.0,
                            fiber: 2.0,
                            calories: 340,
                            servingSize: 120
                        },
                        quantity: 120
                    }
                ],
                nutrition: {
                    carbs: 35.0,
                    protein: 15.0,
                    fat: 18.0,
                    fiber: 2.0,
                    calories: 340
                },
                carbUnits: 2.3,
                notes: ''
            });
        }
    }

    return demoMeals.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
};
