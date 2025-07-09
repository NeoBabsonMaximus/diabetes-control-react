import React from 'react';
import { X, Syringe, BookOpen } from 'lucide-react';
import { getGlucoseColor } from '../utils/helpers';

export const RecordModal = ({ record, onClose }) => {
    if (!record) return null;

    // Función para manejar tanto timestamps de Firebase como objetos Date normales
    const getDisplayDate = (timestamp) => {
        if (!timestamp) return new Date();
        
        // Si es un timestamp de Firebase (tiene método toDate)
        if (timestamp.toDate && typeof timestamp.toDate === 'function') {
            return timestamp.toDate();
        }
        
        // Si es un objeto Date normal
        if (timestamp instanceof Date) {
            return timestamp;
        }
        
        // Si es una string de fecha, convertir a Date
        if (typeof timestamp === 'string') {
            return new Date(timestamp);
        }
        
        // Fallback: fecha actual
        return new Date();
    };

    const displayDate = getDisplayDate(record.timestamp);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center sm:p-4" onClick={onClose}>
            <div className="bg-white sm:rounded-2xl shadow-xl w-full h-full sm:h-auto sm:max-w-lg p-6 sm:p-8 space-y-6 relative overflow-y-auto" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 p-2 rounded-lg hover:bg-gray-100 transition-colors z-10"
                >
                    <X size={24} />
                </button>
                
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
                    <span className={`px-4 py-3 text-xl sm:text-2xl font-bold rounded-full text-center ${getGlucoseColor(record.glucoseLevel)}`}>
                        {record.glucoseLevel} mg/dL
                    </span>
                    <div className="flex-1">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-700 leading-tight">
                            {displayDate.toLocaleDateString('es-MX', {
                                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                            })}
                        </h2>
                        <p className="text-sm font-normal text-gray-500 mt-1">
                            {record.recordTime || displayDate.toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </p>
                        {record.insulinType && (
                            <p className="text-sm font-medium text-blue-600 mt-2 p-2 bg-blue-50 rounded-lg">
                                {record.totalInsulin ? `Cantidad: ${record.totalInsulin}U - ` : ''}Tipo: {record.insulinType}
                            </p>
                        )}
                    </div>
                </div>

                {(record.rapidInsulin > 0 || record.otherInsulin > 0 || record.totalInsulin > 0) && (
                    <div className="border-t pt-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <Syringe className="text-gray-500" size={20}/> 
                            Dosis de Insulina
                        </h3>
                        <div className="text-gray-700 space-y-3 pl-6 sm:pl-8">
                            {record.totalInsulin > 0 && (
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <p className="font-semibold text-blue-700">
                                        Total Administrado: <span className="text-blue-900 text-lg">{record.totalInsulin} unidades</span>
                                    </p>
                                </div>
                            )}
                            {(record.rapidInsulin > 0 || record.otherInsulin > 0) && (
                                <div className="mt-3 text-sm space-y-2">
                                    <p className="text-gray-600 font-medium">Detalle por tipo:</p>
                                    {record.rapidInsulin > 0 && (
                                        <div className="ml-4 p-2 bg-gray-50 rounded-lg">
                                            <p>• Insulina Rápida: <strong className="text-gray-800">{record.rapidInsulin} unidades</strong></p>
                                        </div>
                                    )}
                                    {record.otherInsulin > 0 && (
                                        <div className="ml-4 p-2 bg-gray-50 rounded-lg">
                                            <p>• Otra Insulina: <strong className="text-gray-800">{record.otherInsulin} unidades</strong></p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {record.comments && (
                    <div className="border-t pt-6">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 flex items-center gap-2">
                            <BookOpen className="text-gray-500" size={20}/> 
                            Opinión / Notas
                        </h3>
                        <div className="pl-6 sm:pl-8">
                            <p className="text-gray-700 bg-gray-50 rounded-lg p-4 leading-relaxed border border-gray-200">
                                {record.comments}
                            </p>
                        </div>
                    </div>
                )}

                {/* Botón de cerrar en la parte inferior para móviles */}
                <div className="pt-6 sm:hidden">
                    <button 
                        onClick={onClose}
                        className="w-full py-3 px-4 bg-gray-600 text-white rounded-lg hover:bg-gray-700 active:bg-gray-800 transition-colors font-medium"
                    >
                        Cerrar
                    </button>
                </div>
            </div>
        </div>
    );
};
