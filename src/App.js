import React, { useState } from 'react';
import { Spinner } from './components/Spinner';
import { OnboardingScreen } from './components/OnboardingScreen';
import { Dashboard } from './views/Dashboard';
import { RecordModal } from './components/RecordModal';
import { AuthScreen } from './components/AuthScreen';
// Importar hooks de autenticación con Firebase
import { useAuth, useProfile, useRecords, useMeals } from './hooks/useAuthData';

export default function App() {
    const { userId, isAuthReady, loading, isAuthenticated, user, signOut } = useAuth();
    const { profile, isLoading: isProfileLoading, saveProfile } = useProfile(userId);
    const { records, addRecord } = useRecords(userId);
    const { meals, addMeal } = useMeals(userId);
    const [selectedRecord, setSelectedRecord] = useState(null);

    const handleSelectRecord = (record) => {
        setSelectedRecord(record);
    };

    const handleCloseModal = () => {
        setSelectedRecord(null);
    };

    // Mostrar spinner mientras carga la autenticación
    if (loading || !isAuthReady) {
        return <Spinner />;
    }

    // Mostrar pantalla de login si no está autenticado
    if (!isAuthenticated) {
        return <AuthScreen />;
    }

    // Mostrar spinner mientras carga el perfil
    if (isProfileLoading) {
        return <Spinner />;
    }

    // Mostrar onboarding si no tiene perfil
    if (!profile) {
        return <OnboardingScreen onSaveProfile={saveProfile} />;
    }

    // Mostrar dashboard principal
    return (
        <>
            <Dashboard 
                profile={profile} 
                records={records} 
                meals={meals}
                onAddRecord={addRecord}
                onAddMeal={addMeal}
                onRecordSelect={handleSelectRecord}
                onSaveProfile={saveProfile}
                user={user}
                onSignOut={signOut}
            />
            <RecordModal 
                record={selectedRecord}
                onClose={handleCloseModal}
            />
        </>
    );
}
