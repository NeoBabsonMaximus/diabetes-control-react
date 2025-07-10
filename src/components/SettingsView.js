import React, { useState } from 'react';
import { 
    Settings, 
    User, 
    Target, 
    Bell, 
    Shield, 
    Database, 
    Download, 
    Trash2,
    Moon,
    Sun,
    Globe,
    ChevronRight,
    Save,
    AlertTriangle
} from 'lucide-react';
import { ProfileSettings } from './ProfileSettings';
import { RangeSettings } from './RangeSettings';
import { NotificationSettings } from './NotificationSettings';
import { DataSettings } from './DataSettings';
import { SecuritySettings } from './SecuritySettings';

export const SettingsView = ({ 
    profile, 
    onSaveProfile, 
    user, 
    onSignOut,
    records,
    meals 
}) => {
    const [activeSection, setActiveSection] = useState('profile');
    const [darkMode, setDarkMode] = useState(false);
    const [language, setLanguage] = useState('es');

    const sections = [
        {
            id: 'profile',
            title: 'Perfil Personal',
            subtitle: 'Información básica y tipo de diabetes',
            icon: User,
            component: ProfileSettings
        },
        {
            id: 'ranges',
            title: 'Rangos Objetivo',
            subtitle: 'Metas de glucosa personalizadas',
            icon: Target,
            component: RangeSettings
        },
        {
            id: 'notifications',
            title: 'Notificaciones',
            subtitle: 'Recordatorios y alertas',
            icon: Bell,
            component: NotificationSettings
        },
        {
            id: 'data',
            title: 'Datos y Exportación',
            subtitle: 'Gestión de registros médicos',
            icon: Database,
            component: DataSettings
        },
        {
            id: 'security',
            title: 'Seguridad y Privacidad',
            subtitle: 'Cuenta y configuración de seguridad',
            icon: Shield,
            component: SecuritySettings
        }
    ];

    const getCurrentSection = () => {
        return sections.find(section => section.id === activeSection);
    };

    const currentSection = getCurrentSection();
    const CurrentComponent = currentSection?.component;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="px-4 py-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Settings className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">Configuración</h1>
                            <p className="text-sm text-gray-500">Personaliza tu experiencia</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row min-h-screen">
                {/* Sidebar de navegación */}
                <div className="lg:w-80 bg-white border-r border-gray-200">
                    <div className="p-4">
                        {/* Configuraciones rápidas */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Configuración Rápida</h3>
                            <div className="space-y-2">
                                {/* Modo oscuro */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        {darkMode ? (
                                            <Moon className="w-4 h-4 text-gray-600" />
                                        ) : (
                                            <Sun className="w-4 h-4 text-yellow-500" />
                                        )}
                                        <span className="text-sm font-medium text-gray-700">Modo Oscuro</span>
                                    </div>
                                    <button
                                        onClick={() => setDarkMode(!darkMode)}
                                        className={`w-10 h-6 rounded-full transition-colors ${
                                            darkMode ? 'bg-blue-600' : 'bg-gray-300'
                                        }`}
                                    >
                                        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${
                                            darkMode ? 'translate-x-5' : 'translate-x-1'
                                        } mt-1`} />
                                    </button>
                                </div>

                                {/* Idioma */}
                                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <Globe className="w-4 h-4 text-gray-600" />
                                        <span className="text-sm font-medium text-gray-700">Idioma</span>
                                    </div>
                                    <select
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="text-sm border-0 bg-transparent focus:ring-0 text-gray-600"
                                    >
                                        <option value="es">Español</option>
                                        <option value="en">English</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Secciones principales */}
                        <div>
                            <h3 className="text-sm font-medium text-gray-900 mb-3">Configuración Avanzada</h3>
                            <div className="space-y-1">
                                {sections.map((section) => (
                                    <button
                                        key={section.id}
                                        onClick={() => setActiveSection(section.id)}
                                        className={`w-full flex items-center gap-3 p-3 text-left rounded-lg transition-colors ${
                                            activeSection === section.id
                                                ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                                : 'text-gray-700 hover:bg-gray-50'
                                        }`}
                                    >
                                        <section.icon className={`w-5 h-5 ${
                                            activeSection === section.id ? 'text-blue-600' : 'text-gray-400'
                                        }`} />
                                        <div className="flex-1">
                                            <div className="font-medium text-sm">{section.title}</div>
                                            <div className="text-xs text-gray-500">{section.subtitle}</div>
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-400" />
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contenido principal */}
                <div className="flex-1 p-4 lg:p-6">
                    <div className="max-w-2xl">
                        {/* Header de la sección */}
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">
                                {currentSection?.title}
                            </h2>
                            <p className="text-gray-600">
                                {currentSection?.subtitle}
                            </p>
                        </div>

                        {/* Componente de la sección */}
                        {CurrentComponent && (
                            <CurrentComponent
                                profile={profile}
                                onSaveProfile={onSaveProfile}
                                user={user}
                                onSignOut={onSignOut}
                                records={records}
                                meals={meals}
                                darkMode={darkMode}
                                language={language}
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
