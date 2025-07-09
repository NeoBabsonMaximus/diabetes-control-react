// Base de datos de alimentos comunes en México con información nutricional
// Valores por cada 100g del alimento

export const foodDatabase = {
  // Cereales y Granos
  cereales: [
    {
      id: 'tortilla_maiz',
      name: 'Tortilla de maíz',
      category: 'cereales',
      carbs: 48.3,
      protein: 6.7,
      fat: 1.5,
      fiber: 4.5,
      calories: 231,
      servingSize: 30, // gramos por tortilla
      carbsPerServing: 14.5,
      common: true
    },
    {
      id: 'tortilla_harina',
      name: 'Tortilla de harina',
      category: 'cereales',
      carbs: 51.2,
      protein: 8.1,
      fat: 9.2,
      fiber: 2.8,
      calories: 304,
      servingSize: 40,
      carbsPerServing: 20.5,
      common: true
    },
    {
      id: 'arroz_blanco',
      name: 'Arroz blanco cocido',
      category: 'cereales',
      carbs: 28.2,
      protein: 2.7,
      fat: 0.3,
      fiber: 0.4,
      calories: 130,
      servingSize: 150,
      carbsPerServing: 42.3,
      common: true
    },
    {
      id: 'avena',
      name: 'Avena cocida',
      category: 'cereales',
      carbs: 12.0,
      protein: 2.4,
      fat: 1.4,
      fiber: 1.7,
      calories: 68,
      servingSize: 200,
      carbsPerServing: 24.0,
      common: true
    },
    {
      id: 'pan_blanco',
      name: 'Pan blanco (bolillo)',
      category: 'cereales',
      carbs: 49.4,
      protein: 9.0,
      fat: 3.2,
      fiber: 2.7,
      calories: 265,
      servingSize: 60,
      carbsPerServing: 29.6,
      common: true
    },
    {
      id: 'pasta_cocida',
      name: 'Pasta cocida',
      category: 'cereales',
      carbs: 25.0,
      protein: 5.0,
      fat: 0.9,
      fiber: 1.8,
      calories: 131,
      servingSize: 200,
      carbsPerServing: 50.0,
      common: true
    }
  ],

  // Leguminosas
  leguminosas: [
    {
      id: 'frijoles_negros',
      name: 'Frijoles negros cocidos',
      category: 'leguminosas',
      carbs: 23.0,
      protein: 8.9,
      fat: 0.5,
      fiber: 8.7,
      calories: 132,
      servingSize: 200,
      carbsPerServing: 46.0,
      common: true
    },
    {
      id: 'frijoles_bayos',
      name: 'Frijoles bayos cocidos',
      category: 'leguminosas',
      carbs: 22.8,
      protein: 9.0,
      fat: 0.5,
      fiber: 6.4,
      calories: 133,
      servingSize: 200,
      carbsPerServing: 45.6,
      common: true
    },
    {
      id: 'lentejas',
      name: 'Lentejas cocidas',
      category: 'leguminosas',
      carbs: 20.1,
      protein: 9.0,
      fat: 0.4,
      fiber: 7.9,
      calories: 116,
      servingSize: 200,
      carbsPerServing: 40.2,
      common: true
    },
    {
      id: 'garbanzos',
      name: 'Garbanzos cocidos',
      category: 'leguminosas',
      carbs: 27.4,
      protein: 8.9,
      fat: 2.6,
      fiber: 7.6,
      calories: 164,
      servingSize: 200,
      carbsPerServing: 54.8,
      common: true
    }
  ],

  // Frutas
  frutas: [
    {
      id: 'manzana',
      name: 'Manzana',
      category: 'frutas',
      carbs: 14.0,
      protein: 0.3,
      fat: 0.2,
      fiber: 2.4,
      calories: 52,
      servingSize: 150,
      carbsPerServing: 21.0,
      common: true
    },
    {
      id: 'platano',
      name: 'Plátano',
      category: 'frutas',
      carbs: 23.0,
      protein: 1.1,
      fat: 0.3,
      fiber: 2.6,
      calories: 89,
      servingSize: 120,
      carbsPerServing: 27.6,
      common: true
    },
    {
      id: 'naranja',
      name: 'Naranja',
      category: 'frutas',
      carbs: 12.0,
      protein: 0.9,
      fat: 0.1,
      fiber: 2.4,
      calories: 47,
      servingSize: 150,
      carbsPerServing: 18.0,
      common: true
    },
    {
      id: 'mango',
      name: 'Mango',
      category: 'frutas',
      carbs: 15.0,
      protein: 0.8,
      fat: 0.4,
      fiber: 1.6,
      calories: 60,
      servingSize: 150,
      carbsPerServing: 22.5,
      common: true
    },
    {
      id: 'papaya',
      name: 'Papaya',
      category: 'frutas',
      carbs: 11.0,
      protein: 0.5,
      fat: 0.3,
      fiber: 1.7,
      calories: 43,
      servingSize: 150,
      carbsPerServing: 16.5,
      common: true
    },
    {
      id: 'sandia',
      name: 'Sandía',
      category: 'frutas',
      carbs: 8.0,
      protein: 0.6,
      fat: 0.2,
      fiber: 0.4,
      calories: 30,
      servingSize: 200,
      carbsPerServing: 16.0,
      common: true
    }
  ],

  // Verduras
  verduras: [
    {
      id: 'jitomate',
      name: 'Jitomate (tomate rojo)',
      category: 'verduras',
      carbs: 3.9,
      protein: 0.9,
      fat: 0.2,
      fiber: 1.2,
      calories: 18,
      servingSize: 100,
      carbsPerServing: 3.9,
      common: true
    },
    {
      id: 'cebolla',
      name: 'Cebolla',
      category: 'verduras',
      carbs: 9.3,
      protein: 1.1,
      fat: 0.1,
      fiber: 1.7,
      calories: 40,
      servingSize: 50,
      carbsPerServing: 4.7,
      common: true
    },
    {
      id: 'chile_poblano',
      name: 'Chile poblano',
      category: 'verduras',
      carbs: 4.6,
      protein: 1.0,
      fat: 0.2,
      fiber: 2.0,
      calories: 20,
      servingSize: 100,
      carbsPerServing: 4.6,
      common: true
    },
    {
      id: 'nopales',
      name: 'Nopales',
      category: 'verduras',
      carbs: 3.3,
      protein: 1.3,
      fat: 0.1,
      fiber: 2.9,
      calories: 16,
      servingSize: 100,
      carbsPerServing: 3.3,
      common: true
    },
    {
      id: 'lechuga',
      name: 'Lechuga',
      category: 'verduras',
      carbs: 2.9,
      protein: 1.4,
      fat: 0.2,
      fiber: 1.3,
      calories: 15,
      servingSize: 100,
      carbsPerServing: 2.9,
      common: true
    },
    {
      id: 'zanahoria',
      name: 'Zanahoria',
      category: 'verduras',
      carbs: 9.6,
      protein: 0.9,
      fat: 0.2,
      fiber: 2.8,
      calories: 41,
      servingSize: 100,
      carbsPerServing: 9.6,
      common: true
    }
  ],

  // Proteínas
  proteinas: [
    {
      id: 'pollo_pechuga',
      name: 'Pechuga de pollo sin piel',
      category: 'proteinas',
      carbs: 0.0,
      protein: 31.0,
      fat: 3.6,
      fiber: 0.0,
      calories: 165,
      servingSize: 100,
      carbsPerServing: 0.0,
      common: true
    },
    {
      id: 'carne_res',
      name: 'Carne de res magra',
      category: 'proteinas',
      carbs: 0.0,
      protein: 26.0,
      fat: 15.0,
      fiber: 0.0,
      calories: 250,
      servingSize: 100,
      carbsPerServing: 0.0,
      common: true
    },
    {
      id: 'pescado_blanco',
      name: 'Pescado blanco',
      category: 'proteinas',
      carbs: 0.0,
      protein: 20.0,
      fat: 2.0,
      fiber: 0.0,
      calories: 96,
      servingSize: 100,
      carbsPerServing: 0.0,
      common: true
    },
    {
      id: 'huevo_entero',
      name: 'Huevo entero',
      category: 'proteinas',
      carbs: 0.7,
      protein: 13.0,
      fat: 11.0,
      fiber: 0.0,
      calories: 155,
      servingSize: 60,
      carbsPerServing: 0.4,
      common: true
    },
    {
      id: 'queso_panela',
      name: 'Queso panela',
      category: 'proteinas',
      carbs: 4.0,
      protein: 18.0,
      fat: 14.0,
      fiber: 0.0,
      calories: 215,
      servingSize: 40,
      carbsPerServing: 1.6,
      common: true
    }
  ],

  // Lácteos
  lacteos: [
    {
      id: 'leche_entera',
      name: 'Leche entera',
      category: 'lacteos',
      carbs: 4.8,
      protein: 3.2,
      fat: 3.3,
      fiber: 0.0,
      calories: 61,
      servingSize: 240,
      carbsPerServing: 11.5,
      common: true
    },
    {
      id: 'leche_descremada',
      name: 'Leche descremada',
      category: 'lacteos',
      carbs: 5.0,
      protein: 3.4,
      fat: 0.2,
      fiber: 0.0,
      calories: 34,
      servingSize: 240,
      carbsPerServing: 12.0,
      common: true
    },
    {
      id: 'yogur_natural',
      name: 'Yogur natural',
      category: 'lacteos',
      carbs: 4.7,
      protein: 3.5,
      fat: 3.3,
      fiber: 0.0,
      calories: 61,
      servingSize: 150,
      carbsPerServing: 7.1,
      common: true
    }
  ],

  // Comida Mexicana Típica
  comida_mexicana: [
    {
      id: 'tacos_carnitas',
      name: 'Tacos de carnitas (2 piezas)',
      category: 'comida_mexicana',
      carbs: 30.0,
      protein: 20.0,
      fat: 15.0,
      fiber: 3.0,
      calories: 320,
      servingSize: 150,
      carbsPerServing: 30.0,
      common: true
    },
    {
      id: 'quesadilla_queso',
      name: 'Quesadilla de queso',
      category: 'comida_mexicana',
      carbs: 35.0,
      protein: 15.0,
      fat: 18.0,
      fiber: 2.0,
      calories: 340,
      servingSize: 120,
      carbsPerServing: 35.0,
      common: true
    },
    {
      id: 'tamales_dulces',
      name: 'Tamal dulce',
      category: 'comida_mexicana',
      carbs: 45.0,
      protein: 8.0,
      fat: 12.0,
      fiber: 3.0,
      calories: 300,
      servingSize: 120,
      carbsPerServing: 45.0,
      common: true
    },
    {
      id: 'pozole_rojo',
      name: 'Pozole rojo (1 tazón)',
      category: 'comida_mexicana',
      carbs: 25.0,
      protein: 18.0,
      fat: 8.0,
      fiber: 4.0,
      calories: 230,
      servingSize: 300,
      carbsPerServing: 25.0,
      common: true
    },
    {
      id: 'enchiladas_rojas',
      name: 'Enchiladas rojas (3 piezas)',
      category: 'comida_mexicana',
      carbs: 40.0,
      protein: 20.0,
      fat: 15.0,
      fiber: 4.0,
      calories: 350,
      servingSize: 200,
      carbsPerServing: 40.0,
      common: true
    }
  ],

  // Bebidas
  bebidas: [
    {
      id: 'refresco_cola',
      name: 'Refresco de cola',
      category: 'bebidas',
      carbs: 10.6,
      protein: 0.0,
      fat: 0.0,
      fiber: 0.0,
      calories: 42,
      servingSize: 355,
      carbsPerServing: 37.6,
      common: true
    },
    {
      id: 'jugo_naranja',
      name: 'Jugo de naranja natural',
      category: 'bebidas',
      carbs: 11.5,
      protein: 0.7,
      fat: 0.2,
      fiber: 0.2,
      calories: 45,
      servingSize: 240,
      carbsPerServing: 27.6,
      common: true
    },
    {
      id: 'agua_jamaica',
      name: 'Agua de jamaica (con azúcar)',
      category: 'bebidas',
      carbs: 8.0,
      protein: 0.0,
      fat: 0.0,
      fiber: 0.0,
      calories: 32,
      servingSize: 240,
      carbsPerServing: 19.2,
      common: true
    },
    {
      id: 'cafe_azucar',
      name: 'Café con azúcar',
      category: 'bebidas',
      carbs: 12.0,
      protein: 0.3,
      fat: 0.1,
      fiber: 0.0,
      calories: 48,
      servingSize: 240,
      carbsPerServing: 12.0,
      common: true
    }
  ]
};

// Función para buscar alimentos
export const searchFoods = (query, category = null) => {
  const allFoods = Object.values(foodDatabase).flat();
  
  return allFoods.filter(food => {
    const matchesQuery = query === '' || 
      food.name.toLowerCase().includes(query.toLowerCase()) ||
      food.id.toLowerCase().includes(query.toLowerCase());
    
    const matchesCategory = !category || food.category === category;
    
    return matchesQuery && matchesCategory;
  });
};

// Función para obtener alimentos por categoría
export const getFoodsByCategory = (category) => {
  return foodDatabase[category] || [];
};

// Función para obtener alimentos comunes
export const getCommonFoods = () => {
  const allFoods = Object.values(foodDatabase).flat();
  return allFoods.filter(food => food.common);
};

// Función para calcular unidades de carbohidratos (1 unidad = 15g de carbohidratos)
export const calculateCarbUnits = (carbGrams) => {
  return Math.round((carbGrams / 15) * 10) / 10; // Redondear a 1 decimal
};

// Categorías disponibles
export const foodCategories = [
  { id: 'cereales', name: 'Cereales y Granos', icon: '🌾' },
  { id: 'leguminosas', name: 'Leguminosas', icon: '🫘' },
  { id: 'frutas', name: 'Frutas', icon: '🍎' },
  { id: 'verduras', name: 'Verduras', icon: '🥕' },
  { id: 'proteinas', name: 'Proteínas', icon: '🍗' },
  { id: 'lacteos', name: 'Lácteos', icon: '🥛' },
  { id: 'comida_mexicana', name: 'Comida Mexicana', icon: '🌮' },
  { id: 'bebidas', name: 'Bebidas', icon: '🥤' }
];
