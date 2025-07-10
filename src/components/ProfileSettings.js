import React, { useState, useEffect } from 'react';
import { Save, User, Calendar, Activity, AlertCircle } from 'lucide-react';

export const ProfileSettings = ({ profile, onSaveProfile }) => {
    const [formData, setFormData] = useState({
        name: '',
        age: '',
        diabetesType: 'type1',
        diagnosisDate: '',
        weight: '',
        height: '',
        gender: '',
        emergencyContact: '',
        emergencyPhone: '',
        doctor: '',
        doctorPhone: '',
        notes: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                age: profile.age || '',
                diabetesType: profile.diabetesType || 'type1',
                diagnosisDate: profile.diagnosisDate || '',
                weight: profile.weight || '',
                height: profile.height || '',
                gender: profile.gender || '',
                emergencyContact: profile.emergencyContact || '',
                emergencyPhone: profile.emergencyPhone || '',
                doctor: profile.doctor || '',
                doctorPhone: profile.doctorPhone || '',
                notes: profile.notes || ''
            });
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Limpiar errores
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }
        
        if (formData.age && (isNaN(formData.age) || formData.age < 1 || formData.age > 120)) {
            newErrors.age = 'Edad inválida';
        }
        
        if (formData.weight && (isNaN(formData.weight) || formData.weight < 10 || formData.weight > 300)) {
            newErrors.weight = 'Peso inválido';
        }
        
        if (formData.height && (isNaN(formData.height) || formData.height < 50 || formData.height > 250)) {
            newErrors.height = 'Altura inválida';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setMessage('');

        try {
            await onSaveProfile(formData);
            setMessage('Perfil actualizado correctamente');
            
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (error) {
            setErrors({ general: 'Error al guardar el perfil' });
        } finally {
            setLoading(false);
        }
    };

    const diabetesTypes = [
        { value: 'type1', label: 'Tipo 1', description: 'Diabetes tipo 1 (insulinodependiente)' },
        { value: 'type2', label: 'Tipo 2', description: 'Diabetes tipo 2 (no insulinodependiente)' },
        { value: 'gestational', label: 'Gestacional', description: 'Diabetes gestacional' },
        { value: 'mody', label: 'MODY', description: 'Diabetes MODY (genética)' },
        { value: 'lada', label: 'LADA', description: 'Diabetes LADA (latente autoinmune)' },
        { value: 'other', label: 'Otro', description: 'Otro tipo de diabetes' }
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            {/* Mensaje de éxito */}
            {message && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 text-sm font-medium">{message}</span>
                </div>
            )}

            {/* Error general */}
            {errors.general && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-700 text-sm">{errors.general}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Información básica */}
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                        <User className="w-5 h-5 text-blue-600" />
                        Información Básica
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre completo *
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.name ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Tu nombre completo"
                            />
                            {errors.name && (
                                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>

                        {/* Edad */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Edad
                            </label>
                            <input
                                type="number"
                                name="age"
                                value={formData.age}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.age ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Años"
                                min="1"
                                max="120"
                            />
                            {errors.age && (
                                <p className="mt-1 text-sm text-red-600">{errors.age}</p>
                            )}
                        </div>

                        {/* Género */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Género
                            </label>
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="">Seleccionar</option>
                                <option value="male">Masculino</option>
                                <option value="female">Femenino</option>
                                <option value="other">Otro</option>
                                <option value="prefer-not-to-say">Prefiero no decir</option>
                            </select>
                        </div>

                        {/* Peso */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Peso (kg)
                            </label>
                            <input
                                type="number"
                                name="weight"
                                value={formData.weight}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.weight ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="70.5"
                                step="0.1"
                                min="10"
                                max="300"
                            />
                            {errors.weight && (
                                <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                            )}
                        </div>

                        {/* Altura */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Altura (cm)
                            </label>
                            <input
                                type="number"
                                name="height"
                                value={formData.height}
                                onChange={handleInputChange}
                                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.height ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="170"
                                min="50"
                                max="250"
                            />
                            {errors.height && (
                                <p className="mt-1 text-sm text-red-600">{errors.height}</p>
                            )}
                        </div>

                        {/* Fecha de diagnóstico */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Fecha de diagnóstico
                            </label>
                            <input
                                type="date"
                                name="diagnosisDate"
                                value={formData.diagnosisDate}
                                onChange={handleInputChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                        </div>
                    </div>
                </div>

                {/* Información médica */}
                <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                        <Activity className="w-5 h-5 text-green-600" />
                        Información Médica
                    </h3>
                    
                    <div className="space-y-4">
                        {/* Tipo de diabetes */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Tipo de diabetes
                            </label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {diabetesTypes.map((type) => (
                                    <label
                                        key={type.value}
                                        className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                                            formData.diabetesType === type.value
                                                ? 'border-blue-500 bg-blue-50'
                                                : 'border-gray-200 hover:bg-gray-50'
                                        }`}
                                    >
                                        <input
                                            type="radio"
                                            name="diabetesType"
                                            value={type.value}
                                            checked={formData.diabetesType === type.value}
                                            onChange={handleInputChange}
                                            className="mt-1 text-blue-600 focus:ring-blue-500"
                                        />
                                        <div>
                                            <div className="font-medium text-sm text-gray-900">{type.label}</div>
                                            <div className="text-xs text-gray-500">{type.description}</div>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Médico */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Médico tratante
                                </label>
                                <input
                                    type="text"
                                    name="doctor"
                                    value={formData.doctor}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Dr. Juan Pérez"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono del médico
                                </label>
                                <input
                                    type="tel"
                                    name="doctorPhone"
                                    value={formData.doctorPhone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="+52 55 1234 5678"
                                />
                            </div>
                        </div>

                        {/* Contacto de emergencia */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Contacto de emergencia
                                </label>
                                <input
                                    type="text"
                                    name="emergencyContact"
                                    value={formData.emergencyContact}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="Nombre del contacto"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono de emergencia
                                </label>
                                <input
                                    type="tel"
                                    name="emergencyPhone"
                                    value={formData.emergencyPhone}
                                    onChange={handleInputChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                    placeholder="+52 55 1234 5678"
                                />
                            </div>
                        </div>

                        {/* Notas */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Notas adicionales
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleInputChange}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Alergias, medicamentos, condiciones especiales..."
                            />
                        </div>
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
                        {loading ? 'Guardando...' : 'Guardar Cambios'}
                    </button>
                </div>
            </form>
        </div>
    );
};
