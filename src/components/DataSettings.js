import React, { useState } from 'react';
import { Download, Trash2, Database, FileText, Calendar, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const DataSettings = ({ records, meals, profile }) => {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [dateRange, setDateRange] = useState({
        start: '',
        end: format(new Date(), 'yyyy-MM-dd')
    });
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const generateCSV = (data, type) => {
        if (type === 'records') {
            const headers = ['Fecha', 'Hora', 'Glucosa (mg/dL)', 'Insulina Rápida', 'Otra Insulina', 'Tipo Insulina', 'Notas'];
            const rows = data.map(record => [
                format(record.timestamp, 'dd/MM/yyyy', { locale: es }),
                format(record.timestamp, 'HH:mm', { locale: es }),
                record.glucose || '',
                record.rapidInsulin || '',
                record.otherInsulin || '',
                record.insulinType || '',
                record.notes || ''
            ]);
            return [headers, ...rows];
        } else if (type === 'meals') {
            const headers = ['Fecha', 'Hora', 'Tipo de Comida', 'Carbohidratos (g)', 'Proteínas (g)', 'Grasas (g)', 'Calorías', 'Unidades', 'Notas'];
            const rows = data.map(meal => [
                format(meal.timestamp, 'dd/MM/yyyy', { locale: es }),
                format(meal.timestamp, 'HH:mm', { locale: es }),
                meal.type || '',
                meal.nutrition?.carbs || '',
                meal.nutrition?.protein || '',
                meal.nutrition?.fat || '',
                meal.nutrition?.calories || '',
                meal.carbUnits || '',
                meal.notes || ''
            ]);
            return [headers, ...rows];
        }
        return [];
    };

    const downloadCSV = (csvData, filename) => {
        const csvContent = csvData.map(row => 
            row.map(field => `"${field}"`).join(',')
        ).join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleExportRecords = () => {
        setLoading(true);
        try {
            let filteredRecords = records;
            
            if (dateRange.start) {
                const startDate = new Date(dateRange.start);
                filteredRecords = filteredRecords.filter(record => 
                    record.timestamp >= startDate
                );
            }
            
            if (dateRange.end) {
                const endDate = new Date(dateRange.end);
                endDate.setHours(23, 59, 59, 999);
                filteredRecords = filteredRecords.filter(record => 
                    record.timestamp <= endDate
                );
            }

            const csvData = generateCSV(filteredRecords, 'records');
            const filename = `registros-glucosa-${format(new Date(), 'yyyy-MM-dd')}.csv`;
            downloadCSV(csvData, filename);
            
            setMessage(`${filteredRecords.length} registros exportados correctamente`);
        } catch (error) {
            setMessage('Error al exportar registros');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleExportMeals = () => {
        setLoading(true);
        try {
            let filteredMeals = meals;
            
            if (dateRange.start) {
                const startDate = new Date(dateRange.start);
                filteredMeals = filteredMeals.filter(meal => 
                    meal.timestamp >= startDate
                );
            }
            
            if (dateRange.end) {
                const endDate = new Date(dateRange.end);
                endDate.setHours(23, 59, 59, 999);
                filteredMeals = filteredMeals.filter(meal => 
                    meal.timestamp <= endDate
                );
            }

            const csvData = generateCSV(filteredMeals, 'meals');
            const filename = `registros-comidas-${format(new Date(), 'yyyy-MM-dd')}.csv`;
            downloadCSV(csvData, filename);
            
            setMessage(`${filteredMeals.length} comidas exportadas correctamente`);
        } catch (error) {
            setMessage('Error al exportar comidas');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleExportComplete = () => {
        setLoading(true);
        try {
            // Crear un reporte completo
            const completeData = {
                perfil: profile,
                resumen: {
                    totalRegistros: records.length,
                    totalComidas: meals.length,
                    periodoAnalisis: {
                        desde: records.length > 0 ? format(records[records.length - 1].timestamp, 'dd/MM/yyyy') : 'N/A',
                        hasta: records.length > 0 ? format(records[0].timestamp, 'dd/MM/yyyy') : 'N/A'
                    },
                    promedioGlucosa: records.length > 0 ? 
                        (records.reduce((sum, r) => sum + (r.glucose || 0), 0) / records.length).toFixed(1) : 'N/A'
                },
                registros: records,
                comidas: meals
            };

            const jsonContent = JSON.stringify(completeData, null, 2);
            const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `diabetes-datos-completos-${format(new Date(), 'yyyy-MM-dd')}.json`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            setMessage('Datos completos exportados correctamente');
        } catch (error) {
            setMessage('Error al exportar datos completos');
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleDeleteAllData = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDeleteAllData = () => {
        // Aquí implementarías la lógica para eliminar todos los datos
        // Por seguridad, esto requeriría confirmación adicional
        setMessage('Función de eliminación no implementada por seguridad');
        setShowDeleteConfirm(false);
    };

    const getDataStats = () => {
        const oldestRecord = records.length > 0 ? records[records.length - 1].timestamp : null;
        const newestRecord = records.length > 0 ? records[0].timestamp : null;
        
        return {
            totalRecords: records.length,
            totalMeals: meals.length,
            dateRange: oldestRecord && newestRecord ? {
                start: format(oldestRecord, 'dd/MM/yyyy', { locale: es }),
                end: format(newestRecord, 'dd/MM/yyyy', { locale: es })
            } : null,
            dataSize: new Blob([JSON.stringify({ records, meals })]).size
        };
    };

    const stats = getDataStats();

    return (
        <div className="space-y-6">
            {/* Mensaje */}
            {message && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-blue-700 text-sm font-medium">{message}</span>
                </div>
            )}

            {/* Resumen de datos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                    <Database className="w-5 h-5 text-blue-600" />
                    Resumen de Datos
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">{stats.totalRecords}</div>
                        <div className="text-sm text-blue-700">Registros de Glucosa</div>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">{stats.totalMeals}</div>
                        <div className="text-sm text-green-700">Registros de Comidas</div>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                            {(stats.dataSize / 1024).toFixed(1)} KB
                        </div>
                        <div className="text-sm text-purple-700">Tamaño de Datos</div>
                    </div>
                </div>

                {stats.dateRange && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                        <div className="text-sm text-gray-600">
                            Período de datos: <strong>{stats.dateRange.start}</strong> a <strong>{stats.dateRange.end}</strong>
                        </div>
                    </div>
                )}
            </div>

            {/* Configuración de exportación */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                    <Calendar className="w-5 h-5 text-green-600" />
                    Rango de Fechas para Exportación
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha inicial
                        </label>
                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Fecha final
                        </label>
                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>
                </div>

                <div className="text-sm text-gray-500">
                    Deja las fechas vacías para exportar todos los datos disponibles
                </div>
            </div>

            {/* Opciones de exportación */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                    <Download className="w-5 h-5 text-green-600" />
                    Exportar Datos
                </h3>
                
                <div className="space-y-3">
                    <button
                        onClick={handleExportRecords}
                        disabled={loading || records.length === 0}
                        className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-blue-600" />
                            </div>
                            <div className="text-left">
                                <div className="font-medium text-gray-900">Registros de Glucosa (CSV)</div>
                                <div className="text-sm text-gray-500">Exportar mediciones de glucosa e insulina</div>
                            </div>
                        </div>
                        <Download className="w-5 h-5 text-gray-400" />
                    </button>

                    <button
                        onClick={handleExportMeals}
                        disabled={loading || meals.length === 0}
                        className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-5 h-5 text-green-600" />
                            </div>
                            <div className="text-left">
                                <div className="font-medium text-gray-900">Registros de Comidas (CSV)</div>
                                <div className="text-sm text-gray-500">Exportar historial nutricional</div>
                            </div>
                        </div>
                        <Download className="w-5 h-5 text-gray-400" />
                    </button>

                    <button
                        onClick={handleExportComplete}
                        disabled={loading}
                        className="w-full flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                                <Database className="w-5 h-5 text-purple-600" />
                            </div>
                            <div className="text-left">
                                <div className="font-medium text-gray-900">Datos Completos (JSON)</div>
                                <div className="text-sm text-gray-500">Exportar perfil y todos los registros</div>
                            </div>
                        </div>
                        <Download className="w-5 h-5 text-gray-400" />
                    </button>
                </div>
            </div>

            {/* Gestión de datos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    Gestión de Datos
                </h3>
                
                <div className="space-y-4">
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-yellow-600" />
                            <span className="font-medium text-yellow-800">Zona de Peligro</span>
                        </div>
                        <p className="text-sm text-yellow-700 mb-3">
                            Estas acciones son irreversibles. Asegúrate de hacer una copia de seguridad antes de proceder.
                        </p>
                        
                        <button
                            onClick={handleDeleteAllData}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                            Eliminar Todos los Datos
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                            <h3 className="text-lg font-medium text-gray-900">Confirmar Eliminación</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-6">
                            ¿Estás seguro de que quieres eliminar todos tus datos? Esta acción no se puede deshacer.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDeleteAllData}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Eliminar Todo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
