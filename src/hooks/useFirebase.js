import { useState, useEffect, useCallback } from 'react';
import { db, auth, onAuthStateChanged, doc, getDoc, setDoc, addDoc, collection, query, onSnapshot, serverTimestamp, signIn, appId } from '../services/firebase';

export const useAuth = () => {
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    useEffect(() => {
        signIn();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) setUserId(user.uid);
            else setUserId(null);
            setIsAuthReady(true);
        });
        return () => unsubscribe();
    }, []);

    return { userId, isAuthReady };
};

export const useProfile = (userId) => {
    const [profile, setProfile] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userId) return;
        const profileRef = doc(db, `artifacts/${appId}/users/${userId}/profile`, 'mainProfile');
        getDoc(profileRef).then(docSnap => {
            if (docSnap.exists()) setProfile(docSnap.data());
            else setProfile(null);
        }).catch(error => console.error("Error al obtener el perfil:", error))
        .finally(() => setIsLoading(false));
    }, [userId]);

    const saveProfile = useCallback(async (profileData) => {
        if (!userId) return;
        const profileRef = doc(db, `artifacts/${appId}/users/${userId}/profile`, 'mainProfile');
        try {
            await setDoc(profileRef, { ...profileData, createdAt: serverTimestamp() });
            setProfile(profileData);
        } catch (error) {
            console.error("Error al guardar el perfil:", error);
        }
    }, [userId]);

    return { profile, isLoading, saveProfile };
};

export const useRecords = (userId) => {
    const [records, setRecords] = useState([]);

    useEffect(() => {
        if (!userId) return;
        const recordsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/records`);
        const q = query(recordsCollectionRef);
        
        const unsubscribeRecords = onSnapshot(q, (querySnapshot) => {
            const recordsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            recordsData.sort((a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0));
            setRecords(recordsData);
        }, (error) => console.error("Error al obtener registros:", error));

        return () => unsubscribeRecords();
    }, [userId]);

    const addRecord = useCallback(async (recordData) => {
        if (!userId) return;
        const recordsCollectionRef = collection(db, `artifacts/${appId}/users/${userId}/records`);
        try {
            await addDoc(recordsCollectionRef, { ...recordData, timestamp: serverTimestamp() });
        } catch (error) {
            console.error("Error al añadir registro:", error);
        }
    }, [userId]);

    return { records, addRecord };
};
