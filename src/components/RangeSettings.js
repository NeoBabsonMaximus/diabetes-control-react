import React, { useState, useEffect } from 'react';
import { Target, Save, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';

export const RangeSettings = ({ profile, onSaveProfile }) => {
    const [formData, setFormData] = useState({
        targetRanges: {
            fasting: { min: 70, max: 100 },
            postprandial: { min: 80, max: 140 },
            bedtime: { min: 100, max: 140 },
            general: { min: 70, max: 180 }
        },
        hba1cTarget: 7.0,
        units: 'mg/dl', // mg/dl o mmol/l
        insulinRatios: {
            carbRatio: 15, // gramos de carbohidratos por unidad de insulina
            correctionFactor: 50, // mg/dl que baja 1 unidad de insulina
            basalUnits: 24 // unidades basales por día
        },
        alertLevels: {
            hypoglycemia: 70,
            severeHypoglycemia: 54,
            hyperglycemia: 250,
            severeHyperglycemia: 400
        }
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (profile) {
            setFormData(prev => ({
                ...prev,
                targetRanges: profile.targetRanges || prev.targetRanges,
                hba1cTarget: profile.hba1cTarget || prev.hba1cTarget,
                units: profile.units || prev.units,
                insulinRatios: profile.insulinRatios || prev.insulinRatios,
                alertLevels: profile.alertLevels || prev.alertLevels
            }));
        }
    }, [profile]);

    const handleRangeChange = (category, type, value) => {
        setFormData(prev => ({
            ...prev,
            targetRanges: {
                ...prev.targetRanges,
                [category]: {
                    ...prev.targetRanges[category],
                    [type]: parseFloat(value) || 0
                }
            }
        }));
    };

    const handleInsulinRatioChange = (ratio, value) => {
        setFormData(prev => ({
            ...prev,
            insulinRatios: {
                ...prev.insulinRatios,
                [ratio]: parseFloat(value) || 0
            }
        }));
    };

    const handleAlertLevelChange = (level, value) => {
        setFormData(prev => ({
            ...prev,
            alertLevels: {
                ...prev.alertLevels,
                [level]: parseFloat(value) || 0
            }
        }));
    };

    const validateRanges = () => {
        const newErrors = {};
        
        // Validar que min < max en todos los rangos
        Object.entries(formData.targetRanges).forEach(([category, range]) => {
            if (range.min >= range.max) {
                newErrors[`${category}_range`] = 'El valor mínimo debe ser menor que el máximo';
            }
        });

        // Validar niveles de alerta
        if (formData.alertLevels.severeHypoglycemia >= formData.alertLevels.hypoglycemia) {
            newErrors.severe_hypo = 'La hipoglucemia severa debe ser menor que la hipoglucemia';
        }

        if (formData.alertLevels.hyperglycemia >= formData.alertLevels.severeHyperglycemia) {
            newErrors.severe_hyper = 'La hiperglucemia severa debe ser mayor que la hiperglucemia';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateRanges()) return;

        setLoading(true);
        setMessage('');

        try {
            await onSaveProfile({
                ...profile,
                ...formData
            });
            setMessage('Rangos actualizados correctamente');
            
            setTimeout(() => {
                setMessage('');
            }, 3000);
        } catch (error) {
            setErrors({ general: 'Error al guardar los rangos' });
        } finally {
            setLoading(false);
        }
    };

    const rangeCategories = [
        {
            id: 'fasting',
            name: 'En Ayunas',
            description: 'Glucosa después de 8+ horas sin comer',
            icon: '🌅',
            defaultMin: 70,
            defaultMax: 100
        },
        {
            id: 'postprandial',
            name: 'Postprandial',
            description: '2 horas después de comer',
            icon: '🍽️',
            defaultMin: 80,
            defaultMax: 140
        },
        {
            id: 'bedtime',
            name: 'Antes de Dormir',
            description: 'Glucosa antes de acostarse',
            icon: '🌙',
            defaultMin: 100,
            defaultMax: 140
        },
        {
            id: 'general',
            name: 'General',
            description: 'Rango general durante el día',
            icon: '📊',
            defaultMin: 70,
            defaultMax: 180
        }
    ];

    const convertToMmol = (mgdl) => {
        return (mgdl / 18).toFixed(1);
    };

    return (
        <div className="space-y-6">
            {/* Mensaje de éxito */}
            {message && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-green-700 text-sm font-medium">{message}</span>
                </div>
            )}

            {/* Error general */}
            {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-red-700 text-sm">{errors.general}</span>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Configuración de unidades */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                        <Target className="w-5 h-5 text-blue-600" />
                        Unidades de Medida
                    </h3>
                    
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="units"
                                value="mg/dl"
                                checked={formData.units === 'mg/dl'}
                                onChange={(e) => setFormData(prev => ({ ...prev, units: e.target.value }))}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium">mg/dL (Estados Unidos/México)</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="units"
                                value="mmol/l"
                                checked={formData.units === 'mmol/l'}
                                onChange={(e) => setFormData(prev => ({ ...prev, units: e.target.value }))}
                                className="text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm font-medium">mmol/L (Internacional)</span>
                        </label>
                    </div>
                </div>

                {/* Rangos objetivo */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        Rangos Objetivo de Glucosa
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {rangeCategories.map((category) => (
                            <div key={category.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-2xl">{category.icon}</span>
                                    <div>
                                        <h4 className="font-medium text-gray-900">{category.name}</h4>
                                        <p className="text-xs text-gray-500">{category.description}</p>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Mínimo
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.targetRanges[category.id]?.min || ''}
                                            onChange={(e) => handleRangeChange(category.id, 'min', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder={category.defaultMin.toString()}
                                            min="1"
                                            max="500"
                                        />
                                        {formData.units === 'mmol/l' && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                {convertToMmol(formData.targetRanges[category.id]?.min || category.defaultMin)} mmol/L
                                            </p>
                                        )}
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Máximo
                                        </label>
                                        <input
                                            type="number"
                                            value={formData.targetRanges[category.id]?.max || ''}
                                            onChange={(e) => handleRangeChange(category.id, 'max', e.target.value)}
                                            className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            placeholder={category.defaultMax.toString()}
                                            min="1"
                                            max="500"
                                        />
                                        {formData.units === 'mmol/l' && (
                                            <p className="text-xs text-gray-400 mt-1">
                                                {convertToMmol(formData.targetRanges[category.id]?.max || category.defaultMax)} mmol/L
                                            </p>
                                        )}
                                    </div>
                                </div>
                                
                                {errors[`${category.id}_range`] && (
                                    <p className="text-xs text-red-600 mt-2">{errors[`${category.id}_range`]}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* HbA1c objetivo */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                        <Target className="w-5 h-5 text-purple-600" />
                        HbA1c Objetivo
                    </h3>
                    
                    <div className="max-w-xs">
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            HbA1c objetivo (%)
                        </label>
                        <input
                            type="number"
                            value={formData.hba1cTarget}
                            onChange={(e) => setFormData(prev => ({ ...prev, hba1cTarget: parseFloat(e.target.value) || 0 }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="7.0"
                            step="0.1"
                            min="4.0"
                            max="15.0"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            Objetivo recomendado por la ADA: &lt;7% para la mayoría de adultos
                        </p>
                    </div>
                </div>

                {/* Configuración de insulina */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                        Ratios de Insulina
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Ratio de Carbohidratos
                            </label>
                            <input
                                type="number"
                                value={formData.insulinRatios.carbRatio}
                                onChange={(e) => handleInsulinRatioChange('carbRatio', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="15"
                                min="1"
                                max="100"
                            />
                            <p className="text-xs text-gray-500 mt-1">Gramos de carbohidratos por unidad</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Factor de Corrección
                            </label>
                            <input
                                type="number"
                                value={formData.insulinRatios.correctionFactor}
                                onChange={(e) => handleInsulinRatioChange('correctionFactor', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="50"
                                min="1"
                                max="200"
                            />
                            <p className="text-xs text-gray-500 mt-1">mg/dL que baja 1 unidad</p>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Insulina Basal Diaria
                            </label>
                            <input
                                type="number"
                                value={formData.insulinRatios.basalUnits}
                                onChange={(e) => handleInsulinRatioChange('basalUnits', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                placeholder="24"
                                min="0"
                                max="100"
                                step="0.5"
                            />
                            <p className="text-xs text-gray-500 mt-1">Unidades basales por día</p>
                        </div>
                    </div>
                </div>

                {/* Niveles de alerta */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                        <TrendingDown className="w-5 h-5 text-red-600" />
                        Niveles de Alerta
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-red-700 mb-1">
                                Hipoglucemia
                            </label>
                            <input
                                type="number"
                                value={formData.alertLevels.hypoglycemia}
                                onChange={(e) => handleAlertLevelChange('hypoglycemia', e.target.value)}
                                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="70"
                                min="30"
                                max="100"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-red-700 mb-1">
                                Hipoglucemia Severa
                            </label>
                            <input
                                type="number"
                                value={formData.alertLevels.severeHypoglycemia}
                                onChange={(e) => handleAlertLevelChange('severeHypoglycemia', e.target.value)}
                                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="54"
                                min="20"
                                max="70"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-orange-700 mb-1">
                                Hiperglucemia
                            </label>
                            <input
                                type="number"
                                value={formData.alertLevels.hyperglycemia}
                                onChange={(e) => handleAlertLevelChange('hyperglycemia', e.target.value)}
                                className="w-full px-3 py-2 border border-orange-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                placeholder="250"
                                min="150"
                                max="400"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-red-700 mb-1">
                                Hiperglucemia Severa
                            </label>
                            <input
                                type="number"
                                value={formData.alertLevels.severeHyperglycemia}
                                onChange={(e) => handleAlertLevelChange('severeHyperglycemia', e.target.value)}
                                className="w-full px-3 py-2 border border-red-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                                placeholder="400"
                                min="250"
                                max="600"
                            />
                        </div>
                    </div>
                    
                    {(errors.severe_hypo || errors.severe_hyper) && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            {errors.severe_hypo && <p className="text-sm text-red-600">{errors.severe_hypo}</p>}
                            {errors.severe_hyper && <p className="text-sm text-red-600">{errors.severe_hyper}</p>}
                        </div>
                    )}
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
                        {loading ? 'Guardando...' : 'Guardar Rangos'}
                    </button>
                </div>
            </form>
        </div>
    );
};
