import React, { useState, useEffect } from 'react';
import { Bell, Save, Clock, AlertTriangle } from 'lucide-react';

export const NotificationSettings = ({ profile, onSaveProfile }) => {
    const [formData, setFormData] = useState({
        notifications: {
            enabled: true,
            glucoseReminders: true,
            mealReminders: true,
            medicationReminders: true,
            exerciseReminders: false,
            weeklyReports: true
        },
        reminderTimes: {
            breakfast: '08:00',
            lunch: '13:00',
            dinner: '19:00',
            bedtime: '22:00',
            morningGlucose: '07:30',
            eveningGlucose: '21:30'
        },
        alertThresholds: {
            lowGlucose: true,
            highGlucose: true,
            trends: true,
            missedReadings: true
        }
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                notifications: profile.notifications || prev.notifications,
                reminderTimes: profile.reminderTimes || prev.reminderTimes,
                alertThresholds: profile.alertThresholds || prev.alertThresholds
            }));
        }
    }, [profile]);

    const handleNotificationChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            notifications: {
                ...prev.notifications,
                [key]: value
            }
        }));
    };

    const handleTimeChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            reminderTimes: {
                ...prev.reminderTimes,
                [key]: value
            }
        }));
    };

    const handleAlertChange = (key, value) => {
        setFormData(prev => ({
            ...prev,
            alertThresholds: {
                ...prev.alertThresholds,
                [key]: value
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await onSaveProfile({
                ...profile,
                ...formData
            });
            setMessage('Notificaciones actualizadas correctamente');
            
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (error) {
            setMessage('Error al guardar las notificaciones');
        } finally {
            setLoading(false);
        }
    };

    const requestNotificationPermission = async () => {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setMessage('Permisos de notificación otorgados');
            } else {
                setMessage('Permisos de notificación denegados');
            }
        }
    };

    return (
        <div className="space-y-6">
            {/* Mensaje */}
            {message && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-blue-700 text-sm font-medium">{message}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Configuración general */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                        <Bell className="w-5 h-5 text-blue-600" />
                        Configuración General
                    </h3>
                    
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-gray-900">Activar notificaciones</div>
                                <div className="text-sm text-gray-500">Habilitar todas las notificaciones</div>
                            </div>
                            <button
                                type="button"
                                onClick={() => handleNotificationChange('enabled', !formData.notifications.enabled)}
                                className={`w-12 h-6 rounded-full transition-colors ${
                                    formData.notifications.enabled ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                            >
                                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                    formData.notifications.enabled ? 'translate-x-7' : 'translate-x-1'
                                } mt-1`} />
                            </button>
                        </div>

                        {!('Notification' in window) ? (
                            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-700">
                                    Tu navegador no soporta notificaciones
                                </p>
                            </div>
                        ) : Notification.permission === 'default' ? (
                            <button
                                type="button"
                                onClick={requestNotificationPermission}
                                className="w-full p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-700 hover:bg-blue-100 transition-colors"
                            >
                                Permitir notificaciones del navegador
                            </button>
                        ) : Notification.permission === 'denied' ? (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-sm text-red-700">
                                    Notificaciones bloqueadas. Habilítalas en la configuración del navegador.
                                </p>
                            </div>
                        ) : (
                            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                                <p className="text-sm text-green-700">
                                    ✓ Notificaciones habilitadas
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Tipos de recordatorios */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                        <Clock className="w-5 h-5 text-green-600" />
                        Recordatorios
                    </h3>
                    
                    <div className="space-y-4">
                        {[
                            { key: 'glucoseReminders', label: 'Medición de glucosa', desc: 'Recordatorios para medir glucosa' },
                            { key: 'mealReminders', label: 'Comidas', desc: 'Recordatorios de horarios de comida' },
                            { key: 'medicationReminders', label: 'Medicamentos', desc: 'Recordatorios de medicamentos e insulina' },
                            { key: 'exerciseReminders', label: 'Ejercicio', desc: 'Recordatorios de actividad física' },
                            { key: 'weeklyReports', label: 'Reportes semanales', desc: 'Resumen semanal de datos' }
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-gray-900">{item.label}</div>
                                    <div className="text-sm text-gray-500">{item.desc}</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleNotificationChange(item.key, !formData.notifications[item.key])}
                                    className={`w-12 h-6 rounded-full transition-colors ${
                                        formData.notifications[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                        formData.notifications[item.key] ? 'translate-x-7' : 'translate-x-1'
                                    } mt-1`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Horarios de recordatorios */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Horarios de Recordatorios</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                            { key: 'morningGlucose', label: 'Glucosa matutina', icon: '🌅' },
                            { key: 'breakfast', label: 'Desayuno', icon: '🥞' },
                            { key: 'lunch', label: 'Comida', icon: '🍽️' },
                            { key: 'dinner', label: 'Cena', icon: '🍝' },
                            { key: 'eveningGlucose', label: 'Glucosa nocturna', icon: '🌙' },
                            { key: 'bedtime', label: 'Hora de dormir', icon: '😴' }
                        ].map((item) => (
                            <div key={item.key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                                <span className="text-2xl">{item.icon}</span>
                                <div className="flex-1">
                                    <label className="block font-medium text-gray-900 text-sm">
                                        {item.label}
                                    </label>
                                    <input
                                        type="time"
                                        value={formData.reminderTimes[item.key]}
                                        onChange={(e) => handleTimeChange(item.key, e.target.value)}
                                        className="mt-1 block w-full text-sm border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Alertas automáticas */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                        <AlertTriangle className="w-5 h-5 text-yellow-600" />
                        Alertas Automáticas
                    </h3>
                    
                    <div className="space-y-4">
                        {[
                            { key: 'lowGlucose', label: 'Glucosa baja', desc: 'Alerta cuando la glucosa esté por debajo del rango' },
                            { key: 'highGlucose', label: 'Glucosa alta', desc: 'Alerta cuando la glucosa esté por encima del rango' },
                            { key: 'trends', label: 'Tendencias', desc: 'Alerta sobre patrones preocupantes' },
                            { key: 'missedReadings', label: 'Lecturas perdidas', desc: 'Recordatorio cuando no hayas registrado datos' }
                        ].map((item) => (
                            <div key={item.key} className="flex items-center justify-between">
                                <div>
                                    <div className="font-medium text-gray-900">{item.label}</div>
                                    <div className="text-sm text-gray-500">{item.desc}</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => handleAlertChange(item.key, !formData.alertThresholds[item.key])}
                                    className={`w-12 h-6 rounded-full transition-colors ${
                                        formData.alertThresholds[item.key] ? 'bg-blue-600' : 'bg-gray-300'
                                    }`}
                                >
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                        formData.alertThresholds[item.key] ? 'translate-x-7' : 'translate-x-1'
                                    } mt-1`} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Botón guardar */}
                <div className="flex justify-end pt-6 border-t border-gray-200">
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Save className="w-4 h-4" />
                        )}
                        {loading ? 'Guardando...' : 'Guardar Notificaciones'}
                    </button>
                </div>
            </form>
        </div>
    );
};
