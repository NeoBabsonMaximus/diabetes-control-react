# 🐳📱 Diabetes Control - Docker + Capacitor + Android

## 🚀 Desarrollo con Docker (Sin problemas de versiones)

### Prerrequisitos
- Docker y Docker Compose instalados
- Nada más! 🎉 (No necesitas Node.js, Android SDK, etc.)

### 🛠️ Comandos de Desarrollo

#### Iniciar desarrollo web
```bash
# Inicia el servidor React en http://localhost:3000
./docker-scripts.sh dev
```

#### Construir APK de Android
```bash
# Construye la app completa y genera APK
./docker-scripts.sh build-apk
```

#### Abrir terminal en el contenedor
```bash
# Para debug o comandos personalizados
./docker-scripts.sh shell
```

#### Sincronizar código con Android
```bash
# Actualiza el proyecto Android con cambios recientes
./docker-scripts.sh sync
```

#### Ver logs
```bash
./docker-scripts.sh logs
```

#### Limpiar contenedores
```bash
./docker-scripts.sh clean
```

### 📱 Funcionalidades Móviles Incluidas

- **📸 Cámara**: Para fotos de comidas
- **🔔 Notificaciones**: Recordatorios automáticos
- **📱 Haptics**: Feedback táctil
- **💾 Storage**: Datos offline
- **⌨️ Teclado**: Control inteligente
- **🎨 StatusBar**: Personalizada

### 🔧 Configuración Avanzada

#### Variables de entorno (archivo .env):
```env
REACT_APP_FIREBASE_API_KEY=tu-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto-id
```

#### Personalizar notificaciones:
El servicio móvil incluye recordatorios automáticos:
- 7:00 AM - Medición matutina
- 1:00 PM - Registro de almuerzo  
- 9:00 PM - Medición nocturna

### 📂 Estructura del Proyecto

```
├── src/
│   ├── services/
│   │   ├── firebase.js      # Configuración Firebase
│   │   └── mobileService.js # Funcionalidades móviles
│   ├── components/          # Componentes React
│   └── views/              # Vistas principales
├── android/                # Proyecto Android nativo
├── Dockerfile              # Configuración Docker
├── docker-compose.yml      # Orquestación servicios
└── docker-scripts.sh       # Scripts útiles
```

### 🔄 Flujo de Desarrollo

1. **Desarrollo Web**: `./docker-scripts.sh dev`
2. **Sincronizar**: `./docker-scripts.sh sync` 
3. **Construir APK**: `./docker-scripts.sh build-apk`
4. **APK ubicado en**: `android/app/build/outputs/apk/debug/`

### 🐛 Troubleshooting

#### Error de permisos:
```bash
chmod +x docker-scripts.sh
```

#### Limpiar cache:
```bash
./docker-scripts.sh clean
docker system prune -a
```

#### Ver logs detallados:
```bash
docker-compose logs -f diabetes-app
```

### 📦 Plugins de Capacitor Incluidos

- `@capacitor/app` - Control de la aplicación
- `@capacitor/camera` - Acceso a cámara
- `@capacitor/haptics` - Feedback táctil
- `@capacitor/keyboard` - Control del teclado
- `@capacitor/local-notifications` - Notificaciones locales
- `@capacitor/preferences` - Almacenamiento local
- `@capacitor/status-bar` - Personalización barra de estado

### 🎯 Próximos Pasos

1. Configurar Firebase real (opcional)
2. Personalizar icono y splash screen
3. Configurar firma para release
4. Publicar en Google Play Store

---

## 🆘 Comandos de Emergencia

Si algo falla, puedes regenerar todo desde cero:

```bash
# Borrar todo
rm -rf node_modules android
./docker-scripts.sh clean

# Reinstalar
npm install
npx cap add android
./docker-scripts.sh sync
```
