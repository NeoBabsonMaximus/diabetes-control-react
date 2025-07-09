import React, { useState, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter, BarChart, Bar } from 'recharts';
import { format, differenceInMinutes, isWithinInterval, subHours, addHours } from 'date-fns';
import { es } from 'date-fns/locale';
import { Zap, Clock, TrendingUp, Apple, Calculator, AlertTriangle } from 'lucide-react';

export const FoodGlucoseCorrelationView = ({ meals, glucoseRecords }) => {
  const [analysisType, setAnalysisType] = useState('timing'); // timing, carbs, meal_type
  const [timeWindow, setTimeWindow] = useState(180); // minutos después de comer

  // Correlacionar comidas con glucosa
  const correlationData = useMemo(() => {
    const correlations = [];

    meals.forEach(meal => {
      const mealTime = meal.timestamp instanceof Date ? meal.timestamp : new Date(meal.timestamp);
      
      // Buscar mediciones de glucosa en ventana de tiempo después de la comida
      const windowStart = mealTime;
      const windowEnd = addHours(mealTime, timeWindow / 60);
      
      const relatedGlucose = glucoseRecords.filter(record => {
        const recordTime = record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp);
        return isWithinInterval(recordTime, { start: windowStart, end: windowEnd });
      });

      if (relatedGlucose.length > 0) {
        // Tomar la glucosa más cercana al final de la ventana de tiempo
        const sortedGlucose = relatedGlucose.sort((a, b) => {
          const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
          const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
          return Math.abs(differenceInMinutes(timeA, windowEnd)) - Math.abs(differenceInMinutes(timeB, windowEnd));
        });

        const targetGlucose = sortedGlucose[0];
        const targetTime = targetGlucose.timestamp instanceof Date ? targetGlucose.timestamp : new Date(targetGlucose.timestamp);
        const timeDiff = differenceInMinutes(targetTime, mealTime);

        // Buscar glucosa previa (baseline)
        const baselineWindow = subHours(mealTime, 1);
        const baselineGlucose = glucoseRecords.filter(record => {
          const recordTime = record.timestamp instanceof Date ? record.timestamp : new Date(record.timestamp);
          return isWithinInterval(recordTime, { start: baselineWindow, end: mealTime });
        });

        let baselineValue = null;
        if (baselineGlucose.length > 0) {
          const sortedBaseline = baselineGlucose.sort((a, b) => {
            const timeA = a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp);
            const timeB = b.timestamp instanceof Date ? b.timestamp : new Date(b.timestamp);
            return Math.abs(differenceInMinutes(timeA, mealTime)) - Math.abs(differenceInMinutes(timeB, mealTime));
          });
          baselineValue = sortedBaseline[0].glucoseLevel;
        }

        correlations.push({
          meal,
          glucose: targetGlucose.glucoseLevel,
          baselineGlucose: baselineValue,
          glucoseChange: baselineValue ? targetGlucose.glucoseLevel - baselineValue : null,
          timeDiff,
          date: format(mealTime, 'dd/MM'),
          time: format(mealTime, 'HH:mm'),
          mealType: meal.type,
          carbs: meal.nutrition.carbs,
          carbUnits: meal.carbUnits,
          calories: meal.nutrition.calories,
          protein: meal.nutrition.protein,
          fat: meal.nutrition.fat
        });
      }
    });

    return correlations;
  }, [meals, glucoseRecords, timeWindow]);

  // Análisis por tipo de comida
  const mealTypeAnalysis = useMemo(() => {
    const analysis = {};
    
    correlationData.forEach(item => {
      if (!analysis[item.mealType]) {
        analysis[item.mealType] = {
          type: item.mealType,
          count: 0,
          avgGlucose: 0,
          avgCarbs: 0,
          avgChange: 0,
          totalGlucose: 0,
          totalCarbs: 0,
          totalChange: 0,
          validChanges: 0
        };
      }
      
      const type = analysis[item.mealType];
      type.count++;
      type.totalGlucose += item.glucose;
      type.totalCarbs += item.carbs;
      
      if (item.glucoseChange !== null) {
        type.totalChange += item.glucoseChange;
        type.validChanges++;
      }
    });

    Object.values(analysis).forEach(type => {
      type.avgGlucose = Math.round(type.totalGlucose / type.count);
      type.avgCarbs = Math.round((type.totalCarbs / type.count) * 10) / 10;
      type.avgChange = type.validChanges > 0 ? Math.round((type.totalChange / type.validChanges) * 10) / 10 : 0;
    });

    return Object.values(analysis);
  }, [correlationData]);

  // Datos para gráficos según tipo de análisis
  const chartData = useMemo(() => {
    switch (analysisType) {
      case 'carbs':
        return correlationData.map(item => ({
          x: item.carbs,
          y: item.glucoseChange || item.glucose,
          label: `${item.carbs}g carbos`,
          meal: item.meal.foods.map(f => f.food.name).join(', ').substring(0, 30) + '...'
        }));
      
      case 'meal_type':
        return mealTypeAnalysis;
      
      case 'timing':
      default:
        return correlationData.map(item => ({
          x: item.timeDiff,
          y: item.glucose,
          label: `${item.timeDiff} min`,
          meal: item.meal.foods.map(f => f.food.name).join(', ').substring(0, 30) + '...',
          carbs: item.carbs
        }));
    }
  }, [correlationData, mealTypeAnalysis, analysisType]);

  const getMealTypeName = (type) => {
    const names = {
      desayuno: 'Desayuno',
      colacion_matutina: 'Colación Matutina',
      comida: 'Comida',
      colacion_vespertina: 'Colación Vespertina',
      cena: 'Cena',
      otro: 'Otro'
    };
    return names[type] || 'Comida';
  };

  const getCorrelationInsights = () => {
    if (correlationData.length < 3) {
      return "Necesitas más datos para generar insights significativos.";
    }

    const insights = [];
    
    // Análisis de carbohidratos
    const highCarbMeals = correlationData.filter(item => item.carbs > 45);
    const lowCarbMeals = correlationData.filter(item => item.carbs <= 30);
    
    if (highCarbMeals.length > 0 && lowCarbMeals.length > 0) {
      const avgHighCarb = highCarbMeals.reduce((sum, item) => sum + item.glucose, 0) / highCarbMeals.length;
      const avgLowCarb = lowCarbMeals.reduce((sum, item) => sum + item.glucose, 0) / lowCarbMeals.length;
      const difference = Math.round(avgHighCarb - avgLowCarb);
      
      if (Math.abs(difference) > 20) {
        insights.push(`Las comidas altas en carbohidratos (>45g) resultan en glucosa ${difference > 0 ? 'mayor' : 'menor'} por ${Math.abs(difference)}mg/dL en promedio.`);
      }
    }

    // Análisis por tipo de comida
    const bestMealType = mealTypeAnalysis.reduce((best, current) => 
      current.avgGlucose < best.avgGlucose ? current : best
    );
    const worstMealType = mealTypeAnalysis.reduce((worst, current) => 
      current.avgGlucose > worst.avgGlucose ? current : worst
    );

    if (bestMealType && worstMealType && bestMealType.type !== worstMealType.type) {
      insights.push(`Tu mejor control glucémico es en ${getMealTypeName(bestMealType.type).toLowerCase()} (${bestMealType.avgGlucose}mg/dL promedio) y el más desafiante en ${getMealTypeName(worstMealType.type).toLowerCase()} (${worstMealType.avgGlucose}mg/dL).`);
    }

    return insights.length > 0 ? insights : ["Los datos muestran patrones interesantes. Continúa registrando para obtener insights más específicos."];
  };

  if (correlationData.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <Zap size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">Sin Correlaciones Disponibles</h3>
        <p className="text-gray-500 mb-4">
          Para ver correlaciones entre comidas y glucosa, necesitas:
        </p>
        <ul className="text-left text-gray-500 space-y-1 max-w-md mx-auto">
          <li>• Registros de comidas</li>
          <li>• Mediciones de glucosa dentro de {timeWindow} minutos después de comer</li>
          <li>• Al menos 3 correlaciones para generar insights</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controles */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <Zap className="text-orange-600" />
              Correlación Comida-Glucosa
            </h2>
            <p className="text-gray-600 text-sm">
              Análisis de {correlationData.length} correlaciones encontradas
            </p>
          </div>
          
          <div className="flex flex-wrap gap-3">
            <select
              value={timeWindow}
              onChange={(e) => setTimeWindow(Number(e.target.value))}
              className="px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
            >
              <option value={60}>1 hora después</option>
              <option value={120}>2 horas después</option>
              <option value={180}>3 horas después</option>
              <option value={240}>4 horas después</option>
            </select>

            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="px-3 py-2 border rounded-md focus:ring-orange-500 focus:border-orange-500"
            >
              <option value="timing">Análisis Temporal</option>
              <option value="carbs">Carbohidratos vs Glucosa</option>
              <option value="meal_type">Por Tipo de Comida</option>
            </select>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-orange-800 mb-3 flex items-center gap-2">
          <TrendingUp size={20} />
          Insights Personalizados
        </h3>
        <div className="space-y-2">
          {getCorrelationInsights().map((insight, index) => (
            <div key={index} className="flex items-start gap-2">
              <AlertTriangle size={16} className="text-orange-600 mt-0.5 flex-shrink-0" />
              <p className="text-orange-700 text-sm">{insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Gráficos */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          {analysisType === 'timing' && 'Glucosa vs Tiempo Después de Comer'}
          {analysisType === 'carbs' && 'Glucosa vs Carbohidratos Consumidos'}
          {analysisType === 'meal_type' && 'Análisis por Tipo de Comida'}
        </h3>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {analysisType === 'meal_type' ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="type" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => getMealTypeName(value)}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'avgGlucose') return [`${value} mg/dL`, 'Glucosa Promedio'];
                    if (name === 'avgCarbs') return [`${value}g`, 'Carbohidratos Promedio'];
                    if (name === 'count') return [`${value}`, 'Número de Registros'];
                    return [value, name];
                  }}
                  labelFormatter={(value) => getMealTypeName(value)}
                />
                <Bar dataKey="avgGlucose" fill="#F59E0B" />
              </BarChart>
            ) : (
              <ScatterChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="x" 
                  name={analysisType === 'carbs' ? 'Carbohidratos' : 'Minutos'}
                  unit={analysisType === 'carbs' ? 'g' : 'min'}
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  dataKey="y" 
                  name="Glucosa" 
                  unit="mg/dL" 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ strokeDasharray: '3 3' }}
                  formatter={(value, name) => [
                    `${value} ${name === 'y' ? 'mg/dL' : analysisType === 'carbs' ? 'g' : 'min'}`,
                    name === 'y' ? 'Glucosa' : (analysisType === 'carbs' ? 'Carbohidratos' : 'Tiempo')
                  ]}
                  labelFormatter={() => 'Correlación'}
                />
                <Scatter dataKey="y" fill="#F59E0B" />
              </ScatterChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Estadísticas por tipo de comida */}
      {mealTypeAnalysis.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mealTypeAnalysis.map(analysis => (
            <div key={analysis.type} className="bg-white p-4 rounded-xl shadow-md">
              <h4 className="font-medium text-gray-800 mb-3">
                {getMealTypeName(analysis.type)}
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Registros:</span>
                  <span className="font-medium">{analysis.count}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Glucosa promedio:</span>
                  <span className="font-medium">{analysis.avgGlucose} mg/dL</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Carbos promedio:</span>
                  <span className="font-medium">{analysis.avgCarbs}g</span>
                </div>
                {analysis.validChanges > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cambio promedio:</span>
                    <span className={`font-medium ${analysis.avgChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      {analysis.avgChange > 0 ? '+' : ''}{analysis.avgChange} mg/dL
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Lista de correlaciones recientes */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <Clock size={20} />
          Correlaciones Recientes
        </h3>
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {correlationData.slice(0, 10).map((item, index) => (
            <div key={index} className="border-l-4 border-orange-400 pl-4 py-2">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-gray-800">
                    {getMealTypeName(item.mealType)} - {item.time}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.carbs}g carbos → {item.glucose} mg/dL ({item.timeDiff} min después)
                  </p>
                  {item.glucoseChange !== null && (
                    <p className={`text-sm ${item.glucoseChange > 0 ? 'text-red-600' : 'text-green-600'}`}>
                      Cambio: {item.glucoseChange > 0 ? '+' : ''}{item.glucoseChange} mg/dL
                    </p>
                  )}
                </div>
                <span className="text-xs text-gray-500">{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
