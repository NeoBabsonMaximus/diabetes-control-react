import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Clock, Utensils, Calculator, Eye, X, ChefHat, Apple } from 'lucide-react';

export const MealHistoryItem = ({ meal, onSelect }) => {
  const getMealTypeIcon = (type) => {
    const icons = {
      desayuno: '🌅',
      colacion_matutina: '🍎',
      comida: '🍽️',
      colacion_vespertina: '🥨',
      cena: '🌙',
      otro: '🍽️'
    };
    return icons[type] || '🍽️';
  };

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

  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
          <span className="text-xl sm:text-2xl flex-shrink-0">{getMealTypeIcon(meal.type)}</span>
          <div className="min-w-0 flex-1">
            <h3 className="font-medium text-gray-800 text-sm sm:text-base truncate">{getMealTypeName(meal.type)}</h3>
            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-1">
              <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
              <span className="truncate">
                {format(meal.timestamp, 'dd/MM/yyyy HH:mm', { locale: es })}
              </span>
            </p>
          </div>
        </div>
        <button
          onClick={() => onSelect(meal)}
          className="text-blue-600 hover:text-blue-800 transition-colors p-1 rounded-lg hover:bg-blue-50 flex-shrink-0"
        >
          <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>

      <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-3">
        <div className="text-center bg-blue-50 p-2 rounded">
          <p className="text-xs sm:text-sm font-bold text-blue-600">{meal.nutrition.carbs}g</p>
          <p className="text-xs text-blue-700">Carbos</p>
        </div>
        <div className="text-center bg-purple-50 p-2 rounded">
          <p className="text-xs sm:text-sm font-bold text-purple-600">{meal.carbUnits}</p>
          <p className="text-xs text-purple-700">Unidades</p>
        </div>
        <div className="text-center bg-green-50 p-2 rounded">
          <p className="text-xs sm:text-sm font-bold text-green-600">{meal.nutrition.protein}g</p>
          <p className="text-xs text-green-700">Proteína</p>
        </div>
        <div className="text-center bg-red-50 p-2 rounded">
          <p className="text-xs sm:text-sm font-bold text-red-600">{meal.nutrition.calories}</p>
          <p className="text-xs text-red-700">Calorías</p>
        </div>
      </div>

      <div className="text-xs sm:text-sm text-gray-600">
        <p className="font-medium mb-1">Alimentos ({meal.foods.length}):</p>
        <p className="truncate leading-relaxed">
          {meal.foods.map(item => item.food.name).join(', ')}
        </p>
      </div>

      {meal.notes && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs sm:text-sm text-gray-600">
          <p className="font-medium">Notas:</p>
          <p>{meal.notes}</p>
        </div>
      )}
    </div>
  );
};

export const MealDetailModal = ({ meal, onClose }) => {
  if (!meal) return null;

  const getMealTypeIcon = (type) => {
    const icons = {
      desayuno: '🌅',
      colacion_matutina: '🍎',
      comida: '🍽️',
      colacion_vespertina: '🥨',
      cena: '🌙',
      otro: '🍽️'
    };
    return icons[type] || '🍽️';
  };

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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center sm:p-4 z-50">
      <div className="bg-white sm:rounded-xl w-full h-full sm:max-w-2xl sm:w-full sm:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 sm:p-6 flex justify-between items-center">
          <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
            <span className="text-2xl sm:text-3xl flex-shrink-0">{getMealTypeIcon(meal.type)}</span>
            <div className="min-w-0 flex-1">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{getMealTypeName(meal.type)}</h2>
              <p className="text-sm sm:text-base text-gray-600 flex items-center gap-1">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">
                  {format(meal.timestamp, 'dd/MM/yyyy HH:mm', { locale: es })}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100 flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Resumen nutricional */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-3 sm:p-4 rounded-lg">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
              <Calculator className="w-4 h-4 sm:w-5 sm:h-5" />
              Resumen Nutricional
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              <div className="text-center bg-white p-2 sm:p-3 rounded-lg">
                <p className="text-lg sm:text-2xl font-bold text-blue-600">{meal.nutrition.carbs}g</p>
                <p className="text-xs sm:text-sm text-blue-700">Carbohidratos</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{meal.nutrition.protein}g</p>
                <p className="text-sm text-green-700">Proteínas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">{meal.nutrition.fat}g</p>
                <p className="text-sm text-yellow-700">Grasas</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{meal.carbUnits}</p>
                <p className="text-sm text-purple-700">Unidades Carbo</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{meal.nutrition.calories}</p>
                <p className="text-sm text-red-700">Calorías</p>
              </div>
            </div>
          </div>

          {/* Lista detallada de alimentos */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Utensils size={20} />
              Alimentos Consumidos
            </h3>
            <div className="space-y-3">
              {meal.foods.map(item => {
                const multiplier = item.quantity / item.food.servingSize;
                const itemCarbs = Math.round(item.food.carbs * multiplier * 10) / 10;
                const itemProtein = Math.round(item.food.protein * multiplier * 10) / 10;
                const itemFat = Math.round(item.food.fat * multiplier * 10) / 10;
                const itemCalories = Math.round(item.food.calories * multiplier);

                return (
                  <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium text-gray-800">{item.food.name}</h4>
                        <p className="text-sm text-gray-600">
                          {item.quantity}g (porción: {item.food.servingSize}g)
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div className="text-center bg-blue-50 p-2 rounded">
                        <p className="font-bold text-blue-600">{itemCarbs}g</p>
                        <p className="text-xs text-blue-700">Carbos</p>
                      </div>
                      <div className="text-center bg-green-50 p-2 rounded">
                        <p className="font-bold text-green-600">{itemProtein}g</p>
                        <p className="text-xs text-green-700">Proteína</p>
                      </div>
                      <div className="text-center bg-yellow-50 p-2 rounded">
                        <p className="font-bold text-yellow-600">{itemFat}g</p>
                        <p className="text-xs text-yellow-700">Grasa</p>
                      </div>
                      <div className="text-center bg-red-50 p-2 rounded">
                        <p className="font-bold text-red-600">{itemCalories}</p>
                        <p className="text-xs text-red-700">Cal</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Notas */}
          {meal.notes && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Notas</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700">{meal.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const MealHistoryView = ({ meals, onMealSelect }) => {
  const [selectedMeal, setSelectedMeal] = useState(null);

  const handleMealSelect = (meal) => {
    setSelectedMeal(meal);
    if (onMealSelect) onMealSelect(meal);
  };

  if (meals.length === 0) {
    return (
      <div className="bg-white p-8 rounded-xl shadow-md text-center">
        <ChefHat size={48} className="mx-auto mb-4 text-gray-400" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">No hay comidas registradas</h3>
        <p className="text-gray-500">
          Comienza registrando tus comidas para ver el historial aquí
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-xl shadow-md">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 flex items-center gap-2">
          <Apple className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />
          Historial de Comidas
        </h2>
        <p className="text-gray-600 text-sm">
          Total de comidas registradas: <span className="font-semibold">{meals.length}</span>
        </p>
      </div>

      <div className="space-y-3">
        {meals.map(meal => (
          <MealHistoryItem
            key={meal.id}
            meal={meal}
            onSelect={handleMealSelect}
          />
        ))}
      </div>

      {selectedMeal && (
        <MealDetailModal
          meal={selectedMeal}
          onClose={() => setSelectedMeal(null)}
        />
      )}
    </div>
  );
};
