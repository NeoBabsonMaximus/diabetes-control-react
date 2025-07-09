import React, { useState } from 'react';
import { Spinner } from './components/Spinner';
import { OnboardingScreen } from './components/OnboardingScreen';
import { Dashboard } from './views/Dashboard';
import { RecordModal } from './components/RecordModal';
// Importar hooks demo en lugar de Firebase
import { useAuth, useProfile, useRecords, useMeals } from './hooks/useDemoData';

export default function App() {
    const { userId, isAuthReady } = useAuth();
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

    if (isProfileLoading || !isAuthReady) {
        return <Spinner />;
    }

    if (!profile) {
        return <OnboardingScreen onSaveProfile={saveProfile} />;
    }

    return (
        <>
            <Dashboard 
                profile={profile} 
                records={records} 
                meals={meals}
                onAddRecord={addRecord}
                onAddMeal={addMeal}
                onRecordSelect={handleSelectRecord}
            />
            <RecordModal 
                record={selectedRecord}
                onClose={handleCloseModal}
            />
        </>
    );
}
