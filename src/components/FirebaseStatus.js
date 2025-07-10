import React, { useState, useEffect } from 'react';
import { Cloud, CloudOff, Wifi, WifiOff, HardDrive } from 'lucide-react';

export const FirebaseStatus = () => {
    const [firebaseStatus, setFirebaseStatus] = useState('checking');
    const [isOnline, setIsOnline] = useState(navigator.onLine);

    useEffect(() => {
        // Verificar estado de Firebase
        const checkFirebase = async () => {
            try {
                const { db } = await import('../services/firebase');
                if (db) {
                    setFirebaseStatus('connected');
                } else {
                    setFirebaseStatus('disconnected');
                }
            } catch (error) {
                setFirebaseStatus('disconnected');
            }
        };

        // Verificar conexión online/offline
        const updateOnlineStatus = () => setIsOnline(navigator.onLine);
        
        window.addEventListener('online', updateOnlineStatus);
        window.addEventListener('offline', updateOnlineStatus);
        
        checkFirebase();

        return () => {
            window.removeEventListener('online', updateOnlineStatus);
            window.removeEventListener('offline', updateOnlineStatus);
        };
    }, []);

    const getStatusInfo = () => {
        if (!isOnline) {
            return {
                icon: WifiOff,
                color: 'text-red-500',
                bg: 'bg-red-50',
                border: 'border-red-200',
                text: 'Sin conexión'
            };
        }
        
        if (firebaseStatus === 'connected') {
            return {
                icon: Cloud,
                color: 'text-green-500',
                bg: 'bg-green-50',
                border: 'border-green-200',
                text: 'Sincronizado'
            };
        }
        
        if (firebaseStatus === 'disconnected') {
            return {
                icon: HardDrive,
                color: 'text-blue-500',
                bg: 'bg-blue-50',
                border: 'border-blue-200',
                text: 'Local'
            };
        }
        
        return {
            icon: CloudOff,
            color: 'text-yellow-500',
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            text: 'Verificando...'
        };
    };

    const status = getStatusInfo();
    const Icon = status.icon;

    return (
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${status.bg} ${status.border} border`}>
            <Icon size={14} className={status.color} />
            <span className={status.color}>{status.text}</span>
        </div>
    );
};
