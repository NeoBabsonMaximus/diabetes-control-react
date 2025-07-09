import React, { useState } from 'react';
import { Droplet } from 'lucide-react';

export const OnboardingScreen = ({ onSaveProfile }) => {
    const [name, setName] = useState('');
    const [diabetesType, setDiabetesType] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim() && diabetesType) {
            onSaveProfile({ name: name.trim(), diabetesType });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center p-4">
            <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 space-y-6">
                <div className="text-center">
                    <Droplet className="mx-auto h-12 w-12 text-blue-500" />
                    <h2 className="mt-4 text-3xl font-bold text-gray-900">Bienvenido/a</h2>
                    <p className="mt-2 text-sm text-gray-600">Completa tu perfil para comenzar</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="text-sm font-medium text-gray-700">Nombre del Paciente</label>
                        <input id="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500" placeholder="Ej: Ana López" />
                    </div>
                    <div>
                        <label htmlFor="diabetesType" className="text-sm font-medium text-gray-700">Tipo de Diabetes</label>
                        <select id="diabetesType" required value={diabetesType} onChange={(e) => setDiabetesType(e.target.value)} className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 bg-white">
                            <option value="" disabled>Selecciona una opción</option>
                            <option value="Tipo 1">Tipo 1</option>
                            <option value="Tipo 2">Tipo 2</option>
                            <option value="Gestacional">Gestacional</option>
                            <option value="LADA">LADA (Tipo 1.5)</option>
                            <option value="MODY">MODY</option>
                            <option value="Otro">Otro</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">Guardar Perfil</button>
                </form>
            </div>
        </div>
    );
};
