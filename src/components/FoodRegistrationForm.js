import React, { useState, useMemo } from 'react';
import { Search, Plus, X, Calculator, Clock, Utensils, ChefHat } from 'lucide-react';
import { searchFoods, getFoodsByCategory, foodCategories, calculateCarbUnits } from '../data/foodDatabase';

export const FoodRegistrationForm = ({ onAddMeal, profile }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [mealType, setMealType] = useState('desayuno');
  const [mealTime, setMealTime] = useState('');
  const [notes, setNotes] = useState('');

  // Resultados de búsqueda
  const searchResults = useMemo(() => {
    if (searchQuery.length < 2 && !selectedCategory) {
      // Mostrar alimentos comunes si no hay búsqueda
      return searchFoods('').filter(food => food.common).slice(0, 8);
    }
    return searchFoods(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Calcular totales nutricionales
  const nutritionTotals = useMemo(() => {
    return selectedFoods.reduce((totals, item) => {
      const multiplier = item.quantity / item.food.servingSize;
      return {
        carbs: totals.carbs + (item.food.carbs * multiplier),
        protein: totals.protein + (item.food.protein * multiplier),
        fat: totals.fat + (item.food.fat * multiplier),
        fiber: totals.fiber + (item.food.fiber * multiplier),
        calories: totals.calories + (item.food.calories * multiplier)
      };
    }, { carbs: 0, protein: 0, fat: 0, fiber: 0, calories: 0 });
  }, [selectedFoods]);

  const carbUnits = calculateCarbUnits(nutritionTotals.carbs);

  const addFood = (food) => {
    const existingIndex = selectedFoods.findIndex(item => item.food.id === food.id);
    
    if (existingIndex >= 0) {
      // Si ya existe, incrementar cantidad
      const updated = [...selectedFoods];
      updated[existingIndex].quantity += food.servingSize;
      setSelectedFoods(updated);
    } else {
      // Agregar nuevo alimento
      setSelectedFoods([...selectedFoods, {
        food,
        quantity: food.servingSize,
        id: Date.now()
      }]);
    }
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFood(itemId);
      return;
    }
    
    setSelectedFoods(selectedFoods.map(item =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    ));
  };

  const removeFood = (itemId) => {
    setSelectedFoods(selectedFoods.filter(item => item.id !== itemId));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (selectedFoods.length === 0) {
      alert('Agrega al menos un alimento');
      return;
    }

    const mealData = {
      id: Date.now(),
      timestamp: mealTime ? new Date(`${new Date().toDateString()} ${mealTime}`) : new Date(),
      type: mealType,
      foods: selectedFoods,
      nutrition: {
        carbs: Math.round(nutritionTotals.carbs * 10) / 10,
        protein: Math.round(nutritionTotals.protein * 10) / 10,
        fat: Math.round(nutritionTotals.fat * 10) / 10,
        fiber: Math.round(nutritionTotals.fiber * 10) / 10,
        calories: Math.round(nutritionTotals.calories)
      },
      carbUnits: carbUnits,
      notes: notes.trim(),
      createdAt: new Date()
    };

    onAddMeal(mealData);
    
    // Limpiar formulario
    setSelectedFoods([]);
    setSearchQuery('');
    setSelectedCategory('');
    setMealTime('');
    setNotes('');
    setIsOpen(false);
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  if (!isOpen) {
    return (
      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
        <button
          onClick={() => {
            setIsOpen(true);
            setMealTime(getCurrentTime());
          }}
          className="w-full flex items-center justify-center gap-3 p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors font-medium text-base shadow-sm"
        >
          <Utensils size={20} />
          <span>Registrar Comida</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
      <div className="flex justify-between items-center mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
          <ChefHat className="text-green-600 w-5 h-5 sm:w-6 sm:h-6" />
          Registrar Comida
        </h2>
        <button
          onClick={() => setIsOpen(false)}
          className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de comida y hora */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Comida
            </label>
            <select
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
              className="w-full p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            >
              <option value="desayuno">🌅 Desayuno</option>
              <option value="colacion_matutina">🍎 Colación Matutina</option>
              <option value="comida">🍽️ Comida</option>
              <option value="colacion_vespertina">🥨 Colación Vespertina</option>
              <option value="cena">🌙 Cena</option>
              <option value="otro">🍽️ Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              Hora
            </label>
            <input
              type="time"
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              className="w-full p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
            />
          </div>
        </div>

        {/* Búsqueda de alimentos */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Buscar Alimentos
          </label>
          <div className="relative">
            <Search className="absolute left-3 top-3.5 sm:top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar alimentos..."
              className="w-full pl-10 pr-4 py-3 sm:py-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white"
              autoComplete="off"
            />
          </div>
        </div>

        {/* Filtro por categoría */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por Categoría
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setSelectedCategory('')}
              className={`px-3 py-2 rounded-full text-sm transition-colors min-h-[44px] ${
                selectedCategory === ''
                  ? 'bg-green-100 text-green-800 border border-green-300'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
              }`}
            >
              Todos
            </button>
            {foodCategories.map(category => (
              <button
                key={category.id}
                type="button"
                onClick={() => setSelectedCategory(category.id)}
                className={`px-3 py-2 rounded-full text-sm transition-colors min-h-[44px] ${
                  selectedCategory === category.id
                    ? 'bg-green-100 text-green-800 border border-green-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                }`}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Resultados de búsqueda */}
        <div>
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {searchQuery || selectedCategory ? 'Resultados' : 'Alimentos Comunes'}
          </h3>
          <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto border rounded-lg p-2 mobile-scroll">
            {searchResults.map(food => (
              <button
                key={food.id}
                type="button"
                onClick={() => addFood(food)}
                className="flex justify-between items-center p-3 text-left bg-gray-50 hover:bg-gray-100 active:bg-gray-200 rounded-lg transition-colors min-h-[60px]"
              >
                <div className="flex-1">
                  <p className="font-medium text-gray-800 text-sm sm:text-base">{food.name}</p>
                  <p className="text-xs text-gray-600">
                    {food.carbsPerServing}g carbos / {food.servingSize}g
                  </p>
                </div>
                <Plus size={20} className="text-green-600 ml-2 flex-shrink-0" />
              </button>
            ))}
          </div>
        </div>
        {/* Alimentos seleccionados */}
        {selectedFoods.length > 0 && (
          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">
              Alimentos Seleccionados
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto border rounded-lg p-3 mobile-scroll">
              {selectedFoods.map(item => (
                <div key={item.id} className="flex items-center gap-3 bg-green-50 p-3 rounded-lg">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-800 text-sm sm:text-base truncate">{item.food.name}</p>
                    <p className="text-xs text-gray-600">
                      {Math.round((item.food.carbs * item.quantity / item.food.servingSize) * 10) / 10}g carbos
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item.id, parseFloat(e.target.value) || 0)}
                      className="w-16 px-2 py-2 border rounded-lg text-sm text-center bg-white"
                      min="0"
                      step="10"
                    />
                    <span className="text-xs text-gray-500">g</span>
                    <button
                      type="button"
                      onClick={() => removeFood(item.id)}
                      className="text-red-500 hover:text-red-700 p-1 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resumen nutricional */}
        {selectedFoods.length > 0 && (
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <h3 className="text-sm font-medium text-blue-800 mb-3 flex items-center gap-2">
              <Calculator size={16} />
              Resumen Nutricional
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-center">
              <div className="p-2 bg-white rounded-lg">
                <p className="text-lg font-bold text-blue-600">{Math.round(nutritionTotals.carbs * 10) / 10}g</p>
                <p className="text-xs text-blue-700">Carbohidratos</p>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <p className="text-lg font-bold text-green-600">{Math.round(nutritionTotals.protein * 10) / 10}g</p>
                <p className="text-xs text-green-700">Proteínas</p>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <p className="text-lg font-bold text-yellow-600">{Math.round(nutritionTotals.fat * 10) / 10}g</p>
                <p className="text-xs text-yellow-700">Grasas</p>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <p className="text-lg font-bold text-purple-600">{carbUnits}</p>
                <p className="text-xs text-purple-700">Unidades</p>
              </div>
              <div className="p-2 bg-white rounded-lg">
                <p className="text-lg font-bold text-red-600">{Math.round(nutritionTotals.calories)}</p>
                <p className="text-xs text-red-700">Calorías</p>
              </div>
            </div>
          </div>
        )}

        {/* Notas */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Notas (opcional)
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observaciones sobre la comida..."
            rows={3}
            className="w-full p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 bg-white resize-none"
          />
        </div>

        {/* Botones */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="sm:flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 active:bg-gray-100 transition-colors font-medium"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={selectedFoods.length === 0}
            className="sm:flex-1 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 active:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
          >
            Registrar Comida
          </button>
        </div>
      </form>
    </div>
  );
};
