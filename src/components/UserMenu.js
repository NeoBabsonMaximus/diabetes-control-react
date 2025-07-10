import React, { useState } from 'react';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';

export const UserMenu = ({ user, onSignOut }) => {
    const [isOpen, setIsOpen] = useState(false);

    const displayName = user?.displayName || user?.email?.split('@')[0] || 'Usuario';
    const email = user?.email || '';

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 p-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="hidden sm:block text-left">
                    <div className="font-medium text-xs truncate max-w-24">{displayName}</div>
                    <div className="text-xs text-gray-500 truncate max-w-24">{email}</div>
                </div>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-20">
                        {/* Info del usuario */}
                        <div className="px-4 py-3 border-b border-gray-100">
                            <div className="font-medium text-sm text-gray-900">{displayName}</div>
                            <div className="text-xs text-gray-500">{email}</div>
                        </div>
                        
                        {/* Opciones del menú */}
                        <div className="py-1">
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    // Aquí puedes agregar navegación a configuración
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                            >
                                <Settings className="w-4 h-4" />
                                Configuración
                            </button>
                            
                            <button
                                onClick={() => {
                                    setIsOpen(false);
                                    onSignOut();
                                }}
                                className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};
