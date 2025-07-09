# � Control de Diabetes - App React

Una aplicación web moderna y completa para el control y monitoreo de diabetes, optimizada especialmente para dispositivos móviles.

![React](https://img.shields.io/badge/React-18.0+-blue.svg)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0+-38B2AC.svg)
![Firebase](https://img.shields.io/badge/Firebase-Ready-orange.svg)
![Mobile First](https://img.shields.io/badge/Mobile-First-green.svg)

## 🌟 Características Principales

### 📊 **Registro y Monitoreo**
- ✅ Registro de niveles de glucosa con timestamp preciso
- ✅ Control de insulina (rápida, lenta, mixta) con advertencias inteligentes
- ✅ Sistema de notas y comentarios personalizados
- ✅ Personalización según tipo de diabetes (Tipo 1, Tipo 2, Gestacional, LADA, MODY)

### 🍽️ **Control Alimentario**
- ✅ Base de datos extensa de alimentos mexicanos
- ✅ Cálculo automático de carbohidratos y unidades
- ✅ Registro de comidas por categorías (desayuno, comida, cena, colaciones)
- ✅ Información nutricional completa (proteínas, grasas, fibra, calorías)

### 📈 **Análisis Avanzado**
- ✅ Gráficos de tendencias con Recharts
- ✅ Promedios móviles (7, 30, 90 días)
- ✅ Análisis de variabilidad glucémica
- ✅ Correlaciones entre comidas y glucosa
- ✅ Rangos objetivo personalizables
- ✅ Exportación de datos a CSV

### 📱 **Experiencia Móvil Optimizada**
- ✅ Diseño mobile-first responsivo
- ✅ Touch targets de 44px+ para mejor usabilidad
- ✅ Navegación por pestañas intuitiva
- ✅ Inputs optimizados (sin zoom automático en iOS)
- ✅ Modales full-screen en dispositivos móviles

## 🚀 **Instalación y Uso**

### **Prerrequisitos**
- Node.js 16+ 
- npm o yarn

### **Instalación**
```bash
# Clonar el repositorio
git clone https://github.com/tuusuario/diabetes-control-react.git
cd diabetes-control-react

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start
```

### **Variables de Entorno (Opcional)**
Para usar Firebase, crear `.env` en la raíz:
```env
REACT_APP_FIREBASE_API_KEY=tu_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu_proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu_proyecto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=tu_proyecto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=tu_app_id
```

## 🏗️ **Arquitectura Técnica**

### **Frontend Stack**
- **React 18+** - Framework principal
- **Tailwind CSS** - Styling y diseño responsivo
- **Recharts** - Visualización de datos y gráficos
- **Lucide React** - Iconografía moderna
- **date-fns** - Manejo optimizado de fechas

### **Estructura del Proyecto**
```
src/
├── components/          # Componentes reutilizables
│   ├── AddRecordForm.js       # Formulario de glucosa/insulina
│   ├── FoodRegistrationForm.js # Formulario de comidas
│   ├── AnalyticsView.js       # Análisis y gráficos
│   ├── MealHistoryView.js     # Historial de comidas
│   └── ...
├── views/              # Vistas principales
│   └── Dashboard.js           # Vista principal
├── hooks/              # Hooks personalizados
│   └── useDemoData.js         # Gestión de datos demo
├── data/               # Base de datos local
│   └── foodDatabase.js        # Alimentos mexicanos
├── services/           # Servicios externos
│   └── firebase.js           # Configuración Firebase
└── utils/              # Utilidades
    └── helpers.js            # Funciones auxiliares
```

## 📊 **Funcionalidades Detalladas**

### **Sistema de Registros**
- Validación inteligente de rangos glucémicos
- Advertencias automáticas por tipo de diabetes
- Campos opcionales para control detallado
- Historial cronológico completo

### **Base de Datos de Alimentos**
- 200+ alimentos mexicanos comunes
- Categorización por grupos alimenticios
- Búsqueda inteligente y filtros
- Cálculo automático de unidades de carbohidratos

### **Análisis y Reportes**
- Estadísticas en tiempo real
- Tendencias visuales con gráficos interactivos
- Correlaciones comida-glucosa
- Identificación de patrones por horarios

## 📱 **Compatibilidad**

### **Navegadores Soportados**
- ✅ iOS Safari 14+
- ✅ Android Chrome 90+
- ✅ Desktop Chrome 90+
- ✅ Firefox 88+
- ✅ Edge 90+

### **Dispositivos Optimizados**
- 📱 Smartphones (320px - 480px)
- 📱 Tablets (481px - 768px)
- 💻 Desktop (769px+)

## 🔧 **Comandos Disponibles**

```bash
# Desarrollo
npm start          # Servidor de desarrollo
npm test           # Ejecutar pruebas
npm run build      # Build de producción

# Linting y formato
npm run lint       # Verificar código con ESLint
```

## 👨‍⚕️ **Descargo de Responsabilidad**

Esta aplicación es una herramienta de apoyo y **NO SUSTITUYE** el consejo médico profesional. Siempre consulta con tu médico para decisiones relacionadas con tu tratamiento de diabetes.

## 📄 **Licencia**

Este proyecto está bajo la Licencia MIT.

---

⭐ **¡Si este proyecto te ayuda, considera darle una estrella en GitHub!** ⭐

Una aplicación web moderna y completa para el control y análisis de diabetes, construida con React y diseñada con una arquitectura MVD (Model-View-Data).

## ✨ Características Principales

### 📊 Visualización y Análisis Avanzado
- **Gráficos interactivos**: Tendencias de glucosa con promedios móviles de 7, 30 y 90 días
- **Análisis de correlaciones**: Relación entre glucosa e insulina con gráficos de dispersión
- **Patrones temporales**: Análisis por horarios del día (mañana, tarde, noche, madrugada)
- **Análisis de insulina**: Seguimiento de insulina rápida vs. otras insulinas con gráficos apilados
- **Estadísticas detalladas**: Promedios, desviación estándar, rangos personalizables
- **Exportación de datos**: Descarga en formato CSV con todos los registros

### 🎯 Control Personalizado
- **Rangos objetivo configurables**: Personaliza tus metas de glucosa
- **Advertencias inteligentes**: Alertas contextuales según tipo de diabetes
- **Campos de insulina opcionales**: Insulina rápida y otras insulinas expandibles
- **Soporte para múltiples tipos**: Tipo 1, Tipo 2, Gestacional, MODY, etc.

### 📱 Interfaz Moderna
- **Diseño responsive**: Optimizado para móvil y escritorio
- **Navegación por pestañas**: Registro, Historial y Análisis
- **UI moderna con Tailwind CSS**: Diseño limpio y profesional
- **Iconos intuitivos con Lucide React**: Interfaz clara y fácil de usar

### 🔧 Arquitectura MVD
```
src/
├── components/     # Componentes UI reutilizables
├── views/         # Vistas principales de la aplicación
├── services/      # Lógica de datos y servicios (Firebase)
├── hooks/         # Hooks personalizados y lógica de estado
└── utils/         # Funciones de utilidad
```

## 🚀 Tecnologías Utilizadas

- **React 18**: Framework principal
- **Tailwind CSS**: Estilos y diseño responsive
- **Recharts**: Gráficos y visualización de datos
- **date-fns**: Manejo avanzado de fechas
- **Lucide React**: Iconos modernos
- **Firebase** (opcional): Base de datos en tiempo real

## 📈 Análisis y Métricas

### Gráficos Disponibles
1. **Tendencias de Glucosa**: Línea temporal con rangos objetivo
2. **Promedios Móviles**: 7, 30 y 90 días superpuestos
3. **Correlación Glucosa-Insulina**: Gráfico de dispersión
4. **Patrones por Horario**: Análisis de barras por tiempo del día
5. **Análisis de Insulina**: Gráficos apilados por tipo
6. **Distribución de Rangos**: Gráfico circular y barras de progreso

### Estadísticas Calculadas
- Promedio general y por períodos específicos
- Desviación estándar (índice de variabilidad)
- Porcentaje en rango objetivo vs. fuera de rango
- Valores mínimos y máximos
- Análisis de tendencias temporales

### Indicadores de Salud
- **Índice de Variabilidad**: Estable/Moderada/Alta
- **Tiempo en Rango (TIR)**: Porcentaje dentro del rango objetivo
- **Patrones de Insulina**: Promedio diario por tipo
- **Análisis Temporal**: Comportamiento por horarios

## 🛠️ Instalación y Uso

### Prerequisitos
- Node.js 16+
- npm o yarn

### Instalación
```bash
# Clonar el repositorio
git clone <tu-repositorio>
cd diabetes_controlReact

# Instalar dependencias
npm install

# Iniciar en modo desarrollo
npm start
```

### Configuración Firebase (Opcional)
1. Crear proyecto en Firebase Console
2. Configurar Firestore Database
3. Actualizar `src/services/firebase.js` con tus credenciales

## 📊 Uso de la Aplicación

### 1. Configuración Inicial
- Completa el perfil de onboarding
- Selecciona tu tipo de diabetes
- Configura rangos objetivo personalizados

### 2. Registro de Datos
- **Glucosa**: Valor obligatorio en mg/dL
- **Insulina Rápida**: Campo opcional expansible
- **Otra Insulina**: Campo opcional para lantus, etc.
- **Tipo de Insulina**: Clasificación del tipo usado
- **Comentarios**: Notas adicionales

### 3. Análisis de Datos
- **Pestaña Tendencias**: Gráficos de línea con promedios móviles
- **Pestaña Correlaciones**: Análisis de relaciones glucosa-insulina
- **Pestaña Patrones**: Comportamiento por horarios del día
- **Pestaña Insulina**: Análisis detallado de uso de insulina

### 4. Exportación
- Botón "Exportar CSV" en la vista de análisis
- Incluye todos los datos del período seleccionado
- Formato compatible con Excel y análisis externos

## 🎨 Características de UI/UX

### Diseño Responsive
- Adaptación automática a móvil, tablet y escritorio
- Gráficos responsivos que se ajustan al tamaño de pantalla
- Navegación táctil optimizada

### Accesibilidad
- Colores con contraste adecuado
- Iconos descriptivos
- Navegación por teclado
- Textos legibles en todos los tamaños

### Experiencia de Usuario
- Carga rápida con componentes optimizados
- Feedback visual inmediato
- Advertencias contextuales inteligentes
- Estados de carga y error manejados

## 📊 Tipos de Análisis Implementados

### 1. Análisis Temporal
- Promedios móviles de 7, 30 y 90 días
- Tendencias a corto y largo plazo
- Patrones estacionales y diarios

### 2. Análisis de Correlación
- Relación glucosa vs. insulina
- Identificación de patrones de respuesta
- Gráficos de dispersión interactivos

### 3. Análisis de Rangos
- Tiempo en rango (TIR) personalizable
- Distribución de valores altos/bajos
- Indicadores visuales de cumplimiento

### 4. Análisis de Variabilidad
- Desviación estándar como indicador de estabilidad
- Índices de variabilidad glucémica
- Identificación de patrones irregulares

## 🔮 Funcionalidades Futuras

- [ ] Análisis de comidas y carbohidratos
- [ ] Seguimiento de ejercicio y actividad
- [ ] Integración con dispositivos CGM
- [ ] Reportes médicos automatizados
- [ ] Alertas y recordatorios
- [ ] Modo offline con sincronización
- [ ] Compartir datos con médicos
- [ ] Análisis predictivo con IA

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature
3. Commit tus cambios
4. Push a la rama
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo LICENSE para detalles.

## 💡 Notas Importantes

### Advertencia Médica
Esta aplicación es una herramienta de seguimiento personal y **NO reemplaza** el consejo médico profesional. Siempre consulta con tu médico antes de hacer cambios en tu tratamiento.

### Privacidad de Datos
- Los datos se almacenan localmente por defecto
- Firebase es opcional y puede deshabilitarse
- No se comparten datos con terceros
- Control total sobre tu información de salud

### Personalización
La aplicación está diseñada para ser:
- **Inclusiva**: Diferentes tipos de diabetes y necesidades
- **Flexible**: Campos opcionales y rangos personalizables
- **Adaptable**: Funciona con o sin insulina
- **Cultural**: Interfaces y unidades apropiadas

---

Desarrollado con ❤️ para la comunidad diabética, priorizando la usabilidad, privacidad y análisis científico de los datos de salud.
# diabetes-control-react
