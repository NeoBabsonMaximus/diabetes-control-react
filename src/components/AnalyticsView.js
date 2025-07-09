import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, ReferenceLine, ScatterChart, Scatter, PieChart, Pie, Cell } from 'recharts';
import { format, subDays, startOfDay, endOfDay, isWithinInterval } from 'date-fns';
import { TrendingUp, Calendar, Download, Target, AlertCircle, Activity, Zap, Clock, Heart } from 'lucide-react';

export const AnalyticsView = ({ records, profile }) => {
    const [timeRange, setTimeRange] = useState('7d'); // 7d, 30d, 90d
    const [targetRange, setTargetRange] = useState({ min: 70, max: 180 });
    const [activeTab, setActiveTab] = useState('trends'); // trends, correlations, patterns, insulin

    // Filtrar datos por rango de tiempo
    const filteredData = useMemo(() => {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const startDate = startOfDay(subDays(new Date(), days));
        const endDate = endOfDay(new Date());
        
        return records.filter(record => {
            const recordDate = record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp);
            return isWithinInterval(recordDate, { start: startDate, end: endDate });
        }).sort((a, b) => {
            const dateA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
            const dateB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
            return dateA.getTime() - dateB.getTime();
        });
    }, [records, timeRange]);

    // Preparar datos para gráficos
    const chartData = useMemo(() => {
        return filteredData.map(record => {
            const date = record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp);
            return {
                date: format(date, 'dd/MM'),
                time: format(date, 'HH:mm'),
                fullDate: format(date, 'dd/MM/yyyy HH:mm'),
                glucose: record.glucoseLevel,
                insulin: record.totalInsulin || (record.rapidInsulin || 0) + (record.otherInsulin || 0),
                insulinType: record.insulinType || 'No especificado',
                timestamp: date.getTime()
            };
        });
    }, [filteredData]);

    // Estadísticas calculadas
    const stats = useMemo(() => {
        if (filteredData.length === 0) return null;

        const glucoseValues = filteredData.map(r => r.glucoseLevel);
        const avg = glucoseValues.reduce((sum, val) => sum + val, 0) / glucoseValues.length;
        const inRange = glucoseValues.filter(val => val >= targetRange.min && val <= targetRange.max).length;
        const highCount = glucoseValues.filter(val => val > targetRange.max).length;
        const lowCount = glucoseValues.filter(val => val < targetRange.min).length;

        // Promedios móviles de diferentes períodos
        const recent7Days = filteredData.slice(-7);
        const recent30Days = filteredData.slice(-30);
        const recent90Days = filteredData.slice(-90);
        
        const avg7d = recent7Days.length > 0 
            ? recent7Days.reduce((sum, r) => sum + r.glucoseLevel, 0) / recent7Days.length 
            : avg;
        const avg30d = recent30Days.length > 0 
            ? recent30Days.reduce((sum, r) => sum + r.glucoseLevel, 0) / recent30Days.length 
            : avg;
        const avg90d = recent90Days.length > 0 
            ? recent90Days.reduce((sum, r) => sum + r.glucoseLevel, 0) / recent90Days.length 
            : avg;

        // Variabilidad glucémica
        const variance = glucoseValues.reduce((sum, val) => sum + Math.pow(val - avg, 2), 0) / glucoseValues.length;
        const standardDeviation = Math.sqrt(variance);

        return {
            average: Math.round(avg),
            average7d: Math.round(avg7d),
            average30d: Math.round(avg30d),
            average90d: Math.round(avg90d),
            standardDeviation: Math.round(standardDeviation),
            inRangePercent: Math.round((inRange / glucoseValues.length) * 100),
            highPercent: Math.round((highCount / glucoseValues.length) * 100),
            lowPercent: Math.round((lowCount / glucoseValues.length) * 100),
            totalReadings: glucoseValues.length,
            min: Math.min(...glucoseValues),
            max: Math.max(...glucoseValues)
        };
    }, [filteredData, targetRange]);

    // Exportar datos
    const exportData = () => {
        const csvContent = [
            ['Fecha', 'Hora', 'Glucosa (mg/dL)', 'Insulina Total (U)', 'Tipo Insulina', 'Notas'],
            ...filteredData.map(record => [
                format(record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp), 'dd/MM/yyyy'),
                format(record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp), 'HH:mm'),
                record.glucoseLevel,
                record.totalInsulin || (record.rapidInsulin || 0) + (record.otherInsulin || 0),
                record.insulinType || '',
                record.comments || ''
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `glucosa_${profile?.name || 'datos'}_${format(new Date(), 'yyyy-MM-dd')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    // Análisis de correlaciones
    const correlationData = useMemo(() => {
        const dataWithInsulin = filteredData.filter(record => {
            const totalInsulin = record.totalInsulin || (record.rapidInsulin || 0) + (record.otherInsulin || 0);
            return totalInsulin > 0;
        });

        // Correlación glucosa vs insulina
        const insulinCorrelation = dataWithInsulin.map(record => ({
            glucose: record.glucoseLevel,
            insulin: record.totalInsulin || (record.rapidInsulin || 0) + (record.otherInsulin || 0),
            time: format(record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp), 'HH:mm'),
            date: format(record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp), 'dd/MM')
        }));

        // Análisis por tiempo del día
        const timePatterns = filteredData.reduce((acc, record) => {
            const hour = new Date(record.timestamp).getHours();
            let timeSlot;
            
            if (hour >= 6 && hour < 12) timeSlot = 'Mañana';
            else if (hour >= 12 && hour < 18) timeSlot = 'Tarde';
            else if (hour >= 18 && hour < 22) timeSlot = 'Noche';
            else timeSlot = 'Madrugada';

            if (!acc[timeSlot]) {
                acc[timeSlot] = { total: 0, count: 0, values: [] };
            }
            acc[timeSlot].total += record.glucoseLevel;
            acc[timeSlot].count += 1;
            acc[timeSlot].values.push(record.glucoseLevel);
            
            return acc;
        }, {});

        const timeAnalysis = Object.entries(timePatterns).map(([time, data]) => ({
            time,
            average: Math.round(data.total / data.count),
            count: data.count,
            min: Math.min(...data.values),
            max: Math.max(...data.values)
        }));

        return { insulinCorrelation, timeAnalysis };
    }, [filteredData]);

    // Datos para gráfico de promedios móviles
    const movingAverageData = useMemo(() => {
        if (chartData.length < 7) return [];

        return chartData.map((item, index) => {
            const window7 = chartData.slice(Math.max(0, index - 6), index + 1);
            const window30 = chartData.slice(Math.max(0, index - 29), index + 1);
            
            const avg7 = window7.reduce((sum, d) => sum + d.glucose, 0) / window7.length;
            const avg30 = window30.reduce((sum, d) => sum + d.glucose, 0) / window30.length;

            return {
                ...item,
                movingAvg7: Math.round(avg7),
                movingAvg30: Math.round(avg30)
            };
        });
    }, [chartData]);

    // Datos para análisis de insulina
    const insulinAnalysis = useMemo(() => {
        const insulinData = filteredData.filter(record => {
            const total = record.totalInsulin || (record.rapidInsulin || 0) + (record.otherInsulin || 0);
            return total > 0;
        });

        const dailyInsulin = insulinData.reduce((acc, record) => {
            const date = format(record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp), 'dd/MM');
            const total = record.totalInsulin || (record.rapidInsulin || 0) + (record.otherInsulin || 0);
            
            if (!acc[date]) {
                acc[date] = { date, rapid: 0, other: 0, total: 0, count: 0 };
            }
            
            acc[date].rapid += record.rapidInsulin || 0;
            acc[date].other += record.otherInsulin || 0;
            acc[date].total += total;
            acc[date].count += 1;
            
            return acc;
        }, {});

        return Object.values(dailyInsulin);
    }, [filteredData]);

    return (
        <div className="space-y-4 sm:space-y-6">
            {/* Header con controles */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                <div className="flex flex-col gap-4">
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 flex items-center gap-2">
                            <TrendingUp className="text-blue-600 w-5 h-5 sm:w-6 sm:h-6" />
                            Análisis de Datos
                        </h2>
                        <p className="text-sm sm:text-base text-gray-600 mt-1">Tendencias y estadísticas de tu control glucémico</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3">
                        {/* Selector de rango */}
                        <select 
                            value={timeRange} 
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="w-full sm:w-auto px-3 py-3 sm:py-2 text-base sm:text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                        >
                            <option value="7d">Últimos 7 días</option>
                            <option value="30d">Últimos 30 días</option>
                            <option value="90d">Últimos 90 días</option>
                        </select>

                        {/* Botón exportar */}
                        <button
                            onClick={exportData}
                            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors font-medium text-base sm:text-sm"
                        >
                            <Download size={16} />
                            Exportar CSV
                        </button>
                    </div>
                </div>
            </div>

            {/* Estadísticas principales */}
            {stats && (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
                    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-xs sm:text-sm text-gray-600">Promedio General</p>
                                <p className="text-lg sm:text-xl font-bold text-gray-800">{stats.average} mg/dL</p>
                            </div>
                            <Activity className="text-blue-500 self-end sm:self-auto w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-xs sm:text-sm text-gray-600">Últimos 7 días</p>
                                <p className="text-lg sm:text-xl font-bold text-green-600">{stats.average7d} mg/dL</p>
                            </div>
                            <Calendar className="text-green-500 self-end sm:self-auto w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-xs sm:text-sm text-gray-600">Últimos 30 días</p>
                                <p className="text-lg sm:text-xl font-bold text-blue-600">{stats.average30d} mg/dL</p>
                            </div>
                            <Clock className="text-blue-500 self-end sm:self-auto w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-xs sm:text-sm text-gray-600">En Rango</p>
                                <p className="text-lg sm:text-xl font-bold text-green-600">{stats.inRangePercent}%</p>
                            </div>
                            <Target className="text-green-500 self-end sm:self-auto w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                    </div>

                    <div className="bg-white p-3 sm:p-4 rounded-xl shadow-md col-span-2 sm:col-span-1">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div className="mb-2 sm:mb-0">
                                <p className="text-xs sm:text-sm text-gray-600">Variabilidad</p>
                                <p className="text-lg sm:text-xl font-bold text-orange-600">{stats.standardDeviation}</p>
                                <p className="text-xs text-gray-500">Desv. estándar</p>
                            </div>
                            <AlertCircle className="text-orange-500 self-end sm:self-auto w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                    </div>
                </div>
            )}

            {/* Configuración de rangos objetivo */}
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Rangos Objetivo Personalizados</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Mínimo (mg/dL)</label>
                        <input
                            type="number"
                            value={targetRange.min}
                            onChange={(e) => setTargetRange({...targetRange, min: Number(e.target.value)})}
                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            min="50"
                            max="150"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-600 mb-2">Máximo (mg/dL)</label>
                        <input
                            type="number"
                            value={targetRange.max}
                            onChange={(e) => setTargetRange({...targetRange, max: Number(e.target.value)})}
                            className="w-full p-2 border rounded-md focus:ring-blue-500 focus:border-blue-500"
                            min="100"
                            max="300"
                        />
                    </div>
                </div>
            </div>

            {/* Pestañas de navegación */}
            <div className="bg-white rounded-xl shadow-md">
                <div className="border-b border-gray-200">
                    <nav className="flex overflow-x-auto scrollbar-hide space-x-1 p-3 sm:p-4">
                        {[
                            { id: 'trends', label: 'Tendencias', icon: TrendingUp },
                            { id: 'correlations', label: 'Correlaciones', icon: Zap },
                            { id: 'patterns', label: 'Patrones', icon: Clock },
                            { id: 'insulin', label: 'Insulina', icon: Heart }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-3 py-2 sm:px-4 rounded-lg font-medium transition-colors flex-shrink-0 text-sm sm:text-base ${
                                    activeTab === tab.id
                                        ? 'bg-blue-50 text-blue-600 border border-blue-200'
                                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50 active:bg-gray-100'
                                }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{tab.label}</span>
                                <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
                            </button>
                        ))}
                    </nav>
                </div>

                <div className="p-4 sm:p-6">
                    {/* Contenido de pestañas */}
                    {activeTab === 'trends' && (
                        <div className="space-y-4 sm:space-y-6">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800">Tendencias y Promedios Móviles</h3>
                            <div className="h-64 sm:h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={movingAverageData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis 
                                            dataKey="date" 
                                            tick={{ fontSize: 10 }} 
                                            className="text-xs sm:text-sm"
                                        />
                                        <YAxis 
                                            domain={['dataMin - 20', 'dataMax + 20']} 
                                            tick={{ fontSize: 10 }} 
                                            className="text-xs sm:text-sm"
                                        />
                                        <Tooltip 
                                            labelFormatter={(value) => `Fecha: ${value}`}
                                            formatter={(value, name) => {
                                                let label = '';
                                                switch(name) {
                                                    case 'glucose': label = 'Glucosa'; break;
                                                    case 'movingAvg7': label = 'Promedio 7d'; break;
                                                    case 'movingAvg30': label = 'Promedio 30d'; break;
                                                    default: label = name;
                                                }
                                                return [`${value} mg/dL`, label];
                                            }}
                                        />
                                        <ReferenceLine y={targetRange.min} stroke="#10B981" strokeDasharray="5 5" />
                                        <ReferenceLine y={targetRange.max} stroke="#10B981" strokeDasharray="5 5" />
                                        <Line type="monotone" dataKey="glucose" stroke="#3B82F6" strokeWidth={2} dot={{ fill: '#3B82F6', strokeWidth: 2, r: 3 }} />
                                        <Line type="monotone" dataKey="movingAvg7" stroke="#10B981" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                                        <Line type="monotone" dataKey="movingAvg30" stroke="#F59E0B" strokeWidth={2} strokeDasharray="10 5" dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    )}

                    {activeTab === 'correlations' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Análisis de Correlaciones</h3>
                            {correlationData.insulinCorrelation.length > 0 ? (
                                <div>
                                    <h4 className="text-md font-medium text-gray-700 mb-4">Glucosa vs Insulina</h4>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <ScatterChart data={correlationData.insulinCorrelation}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="insulin" name="Insulina" unit="U" tick={{ fontSize: 12 }} />
                                                <YAxis dataKey="glucose" name="Glucosa" unit="mg/dL" tick={{ fontSize: 12 }} />
                                                <Tooltip cursor={{ strokeDasharray: '3 3' }} 
                                                    formatter={(value, name) => [
                                                        `${value} ${name === 'glucose' ? 'mg/dL' : 'U'}`,
                                                        name === 'glucose' ? 'Glucosa' : 'Insulina'
                                                    ]}
                                                />
                                                <Scatter dataKey="glucose" fill="#3B82F6" />
                                            </ScatterChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Zap size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No hay suficientes datos de insulina para mostrar correlaciones</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'patterns' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Patrones por Horario</h3>
                            {correlationData.timeAnalysis.length > 0 ? (
                                <div>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={correlationData.timeAnalysis}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                                                <YAxis tick={{ fontSize: 12 }} />
                                                <Tooltip 
                                                    formatter={(value, name) => [
                                                        `${value} mg/dL`,
                                                        'Promedio'
                                                    ]}
                                                />
                                                <Bar dataKey="average" fill="#3B82F6" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
                                        {correlationData.timeAnalysis.map(pattern => (
                                            <div key={pattern.time} className="bg-gray-50 p-4 rounded-lg">
                                                <h4 className="font-medium text-gray-800">{pattern.time}</h4>
                                                <p className="text-sm text-gray-600">{pattern.count} lecturas</p>
                                                <p className="text-lg font-bold text-blue-600">{pattern.average} mg/dL</p>
                                                <p className="text-xs text-gray-500">Rango: {pattern.min}-{pattern.max}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Clock size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No hay suficientes datos para mostrar patrones horarios</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'insulin' && (
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-800">Análisis de Insulina</h3>
                            {insulinAnalysis.length > 0 ? (
                                <div>
                                    <div className="h-80">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={insulinAnalysis}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                                <YAxis tick={{ fontSize: 12 }} />
                                                <Tooltip 
                                                    formatter={(value, name) => {
                                                        let label = '';
                                                        switch(name) {                                                        case 'rapid': label = 'Insulina Rápida'; break;
                                                        case 'other': label = 'Otra Insulina'; break;
                                                        case 'total': label = 'Total'; break;
                                                        default: label = name; break;
                                                        }
                                                        return [`${value} U`, label];
                                                    }}
                                                />
                                                <Bar dataKey="rapid" stackId="a" fill="#3B82F6" />
                                                <Bar dataKey="other" stackId="a" fill="#10B981" />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                                        <div className="bg-blue-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-blue-800">Insulina Rápida</h4>
                                            <p className="text-2xl font-bold text-blue-600">
                                                {Math.round(insulinAnalysis.reduce((sum, day) => sum + day.rapid, 0) / insulinAnalysis.length)} U
                                            </p>
                                            <p className="text-sm text-blue-600">Promedio diario</p>
                                        </div>
                                        <div className="bg-green-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-green-800">Otra Insulina</h4>
                                            <p className="text-2xl font-bold text-green-600">
                                                {Math.round(insulinAnalysis.reduce((sum, day) => sum + day.other, 0) / insulinAnalysis.length)} U
                                            </p>
                                            <p className="text-sm text-green-600">Promedio diario</p>
                                        </div>
                                        <div className="bg-gray-50 p-4 rounded-lg">
                                            <h4 className="font-medium text-gray-800">Total</h4>
                                            <p className="text-2xl font-bold text-gray-600">
                                                {Math.round(insulinAnalysis.reduce((sum, day) => sum + day.total, 0) / insulinAnalysis.length)} U
                                            </p>
                                            <p className="text-sm text-gray-600">Promedio diario</p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <Heart size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>No hay datos de insulina para mostrar el análisis</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Distribución de rangos */}
            {stats && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución por Rangos</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Bajo (&lt;{targetRange.min})</span>
                                <span className="text-blue-600 font-semibold">{stats.lowPercent}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: `${stats.lowPercent}%` }}></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">En Rango ({targetRange.min}-{targetRange.max})</span>
                                <span className="text-green-600 font-semibold">{stats.inRangePercent}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-green-500 h-3 rounded-full transition-all duration-500" style={{ width: `${stats.inRangePercent}%` }}></div>
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-600">Alto (&gt;{targetRange.max})</span>
                                <span className="text-red-600 font-semibold">{stats.highPercent}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3">
                                <div className="bg-red-500 h-3 rounded-full transition-all duration-500" style={{ width: `${stats.highPercent}%` }}></div>
                            </div>
                        </div>

                        {/* Gráfico circular */}
                        <div className="mt-6 h-40">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            { name: 'Bajo', value: stats.lowPercent, color: '#3B82F6' },
                                            { name: 'En Rango', value: stats.inRangePercent, color: '#10B981' },
                                            { name: 'Alto', value: stats.highPercent, color: '#EF4444' }
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={30}
                                        outerRadius={60}
                                        paddingAngle={2}
                                        dataKey="value"
                                    >
                                        {[
                                            { name: 'Bajo', value: stats.lowPercent, color: '#3B82F6' },
                                            { name: 'En Rango', value: stats.inRangePercent, color: '#10B981' },
                                            { name: 'Alto', value: stats.highPercent, color: '#EF4444' }
                                        ].map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip formatter={(value) => `${value}%`} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen Estadístico</h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="text-center p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-600">Valor mínimo</p>
                                    <p className="text-xl font-bold text-blue-800">{stats.min}</p>
                                    <p className="text-xs text-blue-600">mg/dL</p>
                                </div>
                                <div className="text-center p-3 bg-red-50 rounded-lg">
                                    <p className="text-sm text-red-600">Valor máximo</p>
                                    <p className="text-xl font-bold text-red-800">{stats.max}</p>
                                    <p className="text-xs text-red-600">mg/dL</p>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Rango total:</span>
                                    <span className="font-semibold">{stats.max - stats.min} mg/dL</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Desviación estándar:</span>
                                    <span className="font-semibold">{stats.standardDeviation} mg/dL</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Total de lecturas:</span>
                                    <span className="font-semibold">{stats.totalReadings}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Período:</span>
                                    <span className="font-semibold">
                                        {timeRange === '7d' ? '7 días' : timeRange === '30d' ? '30 días' : '90 días'}
                                    </span>
                                </div>
                            </div>

                            {/* Indicador de variabilidad */}
                            <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-green-50 to-yellow-50">
                                <p className="text-sm font-medium text-gray-700">Índice de Variabilidad</p>
                                <div className="flex items-center gap-2 mt-1">
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className={`h-2 rounded-full transition-all duration-500 ${
                                                stats.standardDeviation < 30 ? 'bg-green-500' :
                                                stats.standardDeviation < 50 ? 'bg-yellow-500' : 'bg-red-500'
                                            }`}
                                            style={{ width: `${Math.min(100, (stats.standardDeviation / 80) * 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className={`text-sm font-medium ${
                                        stats.standardDeviation < 30 ? 'text-green-600' :
                                        stats.standardDeviation < 50 ? 'text-yellow-600' : 'text-red-600'
                                    }`}>
                                        {stats.standardDeviation < 30 ? 'Estable' :
                                         stats.standardDeviation < 50 ? 'Moderada' : 'Alta'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
