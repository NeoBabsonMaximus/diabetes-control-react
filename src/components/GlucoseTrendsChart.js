import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { format, subDays, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { TrendingUp, Calendar, Target } from 'lucide-react';

export const GlucoseTrendsChart = ({ records, profile }) => {
    const [timeRange, setTimeRange] = useState('7'); // 7, 14, 30 días
    const [showTarget, setShowTarget] = useState(true);

    // Rangos objetivo por defecto según tipo de diabetes
    const getTargetRanges = () => {
        if (!profile) return { min: 80, max: 180 };
        
        switch (profile.diabetesType) {
            case 'Tipo 1':
                return { min: 80, max: 180 };
            case 'Tipo 2':
                return { min: 80, max: 180 };
            case 'Gestacional':
                return { min: 70, max: 140 };
            case 'LADA':
                return { min: 80, max: 180 };
            case 'MODY':
                return { min: 80, max: 160 };
            default:
                return { min: 80, max: 180 };
        }
    };

    const targetRange = getTargetRanges();

    // Filtrar y procesar datos
    const chartData = useMemo(() => {
        if (!records || records.length === 0) return [];

        const days = parseInt(timeRange);
        const startDate = subDays(new Date(), days);
        
        return records
            .filter(record => {
                const recordDate = record.timestamp instanceof Date 
                    ? record.timestamp 
                    : new Date(record.timestamp);
                return isWithinInterval(recordDate, { start: startDate, end: new Date() });
            })
            .map(record => {
                const date = record.timestamp instanceof Date 
                    ? record.timestamp 
                    : new Date(record.timestamp);
                
                return {
                    date: format(date, 'MMM dd', { locale: es }),
                    fullDate: date,
                    time: record.recordTime || format(date, 'HH:mm'),
                    glucose: record.glucoseLevel,
                    insulin: record.totalInsulin || 0,
                    insulinType: record.insulinType || '',
                    comments: record.comments || ''
                };
            })
            .sort((a, b) => a.fullDate - b.fullDate);
    }, [records, timeRange]);

    // Calcular estadísticas
    const stats = useMemo(() => {
        if (chartData.length === 0) return null;

        const glucoseValues = chartData.map(d => d.glucose);
        const avg = glucoseValues.reduce((sum, val) => sum + val, 0) / glucoseValues.length;
        const min = Math.min(...glucoseValues);
        const max = Math.max(...glucoseValues);
        
        const inRange = glucoseValues.filter(g => g >= targetRange.min && g <= targetRange.max).length;
        const percentInRange = (inRange / glucoseValues.length) * 100;

        return {
            average: Math.round(avg),
            min,
            max,
            count: glucoseValues.length,
            percentInRange: Math.round(percentInRange)
        };
    }, [chartData, targetRange]);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            const data = payload[0].payload;
            return (
                <div className="bg-white p-3 border rounded-lg shadow-md">
                    <p className="font-medium">{`${label} - ${data.time}`}</p>
                    <p className="text-blue-600">{`Glucosa: ${data.glucose} mg/dL`}</p>
                    {data.insulin > 0 && (
                        <p className="text-green-600">{`Insulina: ${data.insulin}U`}</p>
                    )}
                    {data.insulinType && (
                        <p className="text-gray-600">{`Tipo: ${data.insulinType}`}</p>
                    )}
                    {data.comments && (
                        <p className="text-gray-500 text-sm">{data.comments}</p>
                    )}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Tendencias de Glucosa
                </h3>
                <div className="flex items-center gap-4">
                    <select 
                        value={timeRange} 
                        onChange={(e) => setTimeRange(e.target.value)}
                        className="px-3 py-1 border rounded-md text-sm focus:ring-blue-500 focus:border-blue-500"
                    >
                        <option value="7">Últimos 7 días</option>
                        <option value="14">Últimos 14 días</option>
                        <option value="30">Últimos 30 días</option>
                    </select>
                    <button
                        onClick={() => setShowTarget(!showTarget)}
                        className={`px-3 py-1 text-sm rounded-md border ${
                            showTarget 
                                ? 'bg-blue-100 border-blue-300 text-blue-700' 
                                : 'bg-gray-100 border-gray-300 text-gray-600'
                        }`}
                    >
                        <Target className="h-4 w-4 inline mr-1" />
                        Rango objetivo
                    </button>
                </div>
            </div>

            {/* Estadísticas */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 bg-gray-50 p-4 rounded-lg">
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Promedio</p>
                        <p className="text-lg font-semibold text-blue-600">{stats.average} mg/dL</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Mínimo</p>
                        <p className="text-lg font-semibold text-green-600">{stats.min} mg/dL</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Máximo</p>
                        <p className="text-lg font-semibold text-red-600">{stats.max} mg/dL</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">En rango</p>
                        <p className="text-lg font-semibold text-purple-600">{stats.percentInRange}%</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm text-gray-600">Mediciones</p>
                        <p className="text-lg font-semibold text-gray-600">{stats.count}</p>
                    </div>
                </div>
            )}

            {/* Gráfico */}
            <div className="h-80">
                {chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis 
                                dataKey="date" 
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                            />
                            <YAxis 
                                domain={['dataMin - 20', 'dataMax + 20']}
                                tick={{ fontSize: 12 }}
                                stroke="#666"
                                label={{ value: 'Glucosa (mg/dL)', angle: -90, position: 'insideLeft' }}
                            />
                            <Tooltip content={<CustomTooltip />} />
                            
                            {/* Líneas de rango objetivo */}
                            {showTarget && (
                                <>
                                    <ReferenceLine 
                                        y={targetRange.min} 
                                        stroke="#22c55e" 
                                        strokeDasharray="5 5" 
                                        label="Mín objetivo"
                                    />
                                    <ReferenceLine 
                                        y={targetRange.max} 
                                        stroke="#ef4444" 
                                        strokeDasharray="5 5" 
                                        label="Máx objetivo"
                                    />
                                </>
                            )}
                            
                            {/* Línea principal de glucosa */}
                            <Line 
                                type="monotone" 
                                dataKey="glucose" 
                                stroke="#3b82f6" 
                                strokeWidth={2}
                                dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-500">
                        <div className="text-center">
                            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                            <p>No hay datos para mostrar en este período</p>
                            <p className="text-sm">Agrega algunos registros para ver las tendencias</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Información del rango objetivo */}
            {showTarget && (
                <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-md">
                    <p className="font-medium text-blue-800">Rango objetivo para {profile?.diabetesType || 'tu tipo de diabetes'}:</p>
                    <p>{targetRange.min} - {targetRange.max} mg/dL</p>
                </div>
            )}
        </div>
    );
};
