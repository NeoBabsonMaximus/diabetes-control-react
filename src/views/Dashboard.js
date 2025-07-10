import React, { useState } from 'react';
import { Droplet, Plus, History, BarChart3, Utensils, Zap, Settings } from 'lucide-react';
import { AddRecordForm } from '../components/AddRecordForm';
import { RecordListItem } from '../components/RecordListItem';
import { AnalyticsView } from '../components/AnalyticsView';
import { FoodRegistrationForm } from '../components/FoodRegistrationForm';
import { MealHistoryView } from '../components/MealHistoryView';
import { FoodGlucoseCorrelationView } from '../components/FoodGlucoseCorrelationView';
import { FirebaseStatus } from '../components/FirebaseStatus';
import { UserMenu } from '../components/UserMenu';
import { SettingsView } from '../components/SettingsView';

export const Dashboard = ({ profile, records, meals, onAddRecord, onAddMeal, onRecordSelect, onSaveProfile, user, onSignOut }) => {
    const [activeTab, setActiveTab] = useState('registro');

    const tabs = [
        { id: 'registro', label: 'Registro', icon: Plus },
        { id: 'historial', label: 'Historial', icon: History },
        { id: 'comidas', label: 'Comidas', icon: Utensils },
        { id: 'analisis', label: 'Análisis', icon: BarChart3 },
        { id: 'correlaciones', label: 'Correlaciones', icon: Zap },
        { id: 'configuracion', label: 'Configuración', icon: Settings }
    ];

    return (
        <div className="bg-gray-50 min-h-screen">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="px-4 py-3">
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <Droplet className="h-6 w-6 text-blue-600" />
                            <div>
                                <h1 className="text-lg font-bold text-gray-900 leading-tight">{profile.name}</h1>
                                <p className="text-xs text-gray-500">{profile.diabetesType}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <FirebaseStatus />
                            <UserMenu user={user} onSignOut={onSignOut} />
                        </div>
                    </div>

                    {/* Navegación por pestañas optimizada para móvil */}
                    <nav className="border-b border-gray-200 -mx-4 px-4">
                        <div className="flex overflow-x-auto scrollbar-hide space-x-1 pb-2">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex flex-col items-center gap-1 px-3 py-2 font-medium text-xs rounded-lg transition-colors min-w-0 flex-shrink-0 ${
                                        activeTab === tab.id
                                            ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                            : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                                    }`}
                                >
                                    <div className="relative">
                                        <tab.icon size={18} />
                                        {((tab.id === 'historial' && records.length > 0) || 
                                          (tab.id === 'comidas' && meals && meals.length > 0)) && (
                                            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center leading-none">
                                                {tab.id === 'historial' ? records.length : meals.length}
                                            </span>
                                        )}
                                    </div>
                                    <span className="text-xs leading-tight text-center">{tab.label}</span>
                                </button>
                            ))}
                        </div>
                    </nav>
                </div>
            </header>

            <main className="px-4 py-4">
                {/* Contenido de pestañas */}
                {activeTab === 'registro' && (
                    <div className="space-y-6">
                        <div className="space-y-4">
                            <AddRecordForm onAddRecord={onAddRecord} profile={profile} />
                            <FoodRegistrationForm onAddMeal={onAddMeal} profile={profile} />
                        </div>
                        
                        {/* Últimos registros y comidas */}
                        <div className="space-y-6">
                            {records.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">Últimas Mediciones</h3>
                                    <div className="space-y-3">
                                        {records.slice(0, 2).map(record => 
                                            <RecordListItem key={record.id} record={record} onSelect={onRecordSelect} />
                                        )}
                                    </div>
                                    {records.length > 2 && (
                                        <button
                                            onClick={() => setActiveTab('historial')}
                                            className="mt-3 w-full text-blue-600 hover:text-blue-800 text-sm font-medium py-2 border border-blue-200 rounded-lg bg-blue-50"
                                        >
                                            Ver todas las mediciones ({records.length})
                                        </button>
                                    )}
                                </div>
                            )}

                            {meals && meals.length > 0 && (
                                <div>
                                    <h3 className="text-lg font-bold text-gray-800 mb-3">Últimas Comidas</h3>
                                    <div className="space-y-3">
                                        {meals.slice(0, 2).map(meal => (
                                            <div key={meal.id} className="bg-white p-3 rounded-lg shadow-sm border">
                                                <div className="flex justify-between items-start">
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800 text-sm">
                                                            {meal.type === 'desayuno' ? '🌅 Desayuno' :
                                                             meal.type === 'comida' ? '🍽️ Comida' :
                                                             meal.type === 'cena' ? '🌙 Cena' :
                                                             meal.type === 'colacion_matutina' ? '🍎 Colación Matutina' :
                                                             meal.type === 'colacion_vespertina' ? '🥨 Colación Vespertina' : '🍽️ Otro'}
                                                        </p>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {meal.nutrition.carbs}g carbos • {meal.carbUnits} unidades
                                                        </p>
                                                    </div>
                                                    <span className="text-xs text-gray-500 ml-2">
                                                        {meal.timestamp instanceof Date ? 
                                                            meal.timestamp.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }) :
                                                            new Date(meal.timestamp).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' })
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    {meals.length > 2 && (
                                        <button
                                            onClick={() => setActiveTab('comidas')}
                                            className="mt-3 w-full text-green-600 hover:text-green-800 text-sm font-medium py-2 border border-green-200 rounded-lg bg-green-50"
                                        >
                                            Ver todas las comidas ({meals.length})
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'historial' && (
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Historial Completo de Mediciones</h2>
                        {records.length > 0 ? (
                            <div className="space-y-3">
                                {records.map(record => 
                                    <RecordListItem key={record.id} record={record} onSelect={onRecordSelect} />
                                )}
                            </div>
                        ) : (
                            <div className="text-center bg-white rounded-lg p-12">
                                <History size={48} className="mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-500 text-lg">Aún no tienes registros.</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Ve a la pestaña "Registro" para agregar tu primera medición.
                                </p>
                                <button
                                    onClick={() => setActiveTab('registro')}
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Crear Primer Registro
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'comidas' && (
                    <div>
                        {meals && meals.length > 0 ? (
                            <MealHistoryView meals={meals} />
                        ) : (
                            <div className="text-center bg-white rounded-lg p-12">
                                <Utensils size={48} className="mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-500 text-lg">No hay comidas registradas.</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Ve a la pestaña "Registro" para agregar tu primera comida.
                                </p>
                                <button
                                    onClick={() => setActiveTab('registro')}
                                    className="mt-4 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                                >
                                    Registrar Primera Comida
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'analisis' && (
                    <div>
                        {records.length > 0 ? (
                            <AnalyticsView records={records} profile={profile} />
                        ) : (
                            <div className="text-center bg-white rounded-lg p-12">
                                <BarChart3 size={48} className="mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-500 text-lg">No hay datos para analizar.</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Necesitas al menos algunos registros para ver análisis y gráficos.
                                </p>
                                <button
                                    onClick={() => setActiveTab('registro')}
                                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                >
                                    Agregar Registros
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'correlaciones' && (
                    <div>
                        {records.length > 0 && meals && meals.length > 0 ? (
                            <FoodGlucoseCorrelationView meals={meals} glucoseRecords={records} />
                        ) : (
                            <div className="text-center bg-white rounded-lg p-12">
                                <Zap size={48} className="mx-auto mb-4 text-gray-400" />
                                <p className="text-gray-500 text-lg">No hay datos suficientes para correlaciones.</p>
                                <p className="text-gray-500 text-sm mt-1">
                                    Necesitas registros de glucosa y comidas para ver correlaciones.
                                </p>
                                <div className="mt-4 space-x-2">
                                    <button
                                        onClick={() => setActiveTab('registro')}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        Agregar Datos
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {activeTab === 'configuracion' && (
                    <SettingsView
                        profile={profile}
                        onSaveProfile={onSaveProfile}
                        user={user}
                        onSignOut={onSignOut}
                        records={records}
                        meals={meals}
                    />
                )}
            </main>
        </div>
    );
};
