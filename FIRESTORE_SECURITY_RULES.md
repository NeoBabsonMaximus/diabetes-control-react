# Reglas de Seguridad de Firestore para Control de Diabetes

## Configuración en Firebase Console

Ve a Firebase Console → Firestore Database → Reglas y pega este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Reglas para perfiles de usuario
    match /profiles/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Reglas para datos de usuarios
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
      
      // Registros de glucosa
      match /records/{recordId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
      
      // Registros de comidas
      match /meals/{mealId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

## Explicación de las Reglas

### Seguridad por Usuario
- **Solo usuarios autenticados** pueden acceder a datos
- **Cada usuario solo ve sus propios datos**
- **Nadie puede acceder a datos de otros usuarios**

### Estructura Protegida
```
/profiles/{userId} → Solo el usuario propietario
/users/{userId}/records/{recordId} → Solo el usuario propietario
/users/{userId}/meals/{mealId} → Solo el usuario propietario
```

### Operaciones Permitidas
- ✅ **Lectura**: Usuario puede leer sus propios datos
- ✅ **Escritura**: Usuario puede crear/modificar sus propios datos
- ❌ **Acceso cruzado**: Usuario NO puede ver datos de otros
- ❌ **Acceso anónimo**: Solo usuarios autenticados

## Cómo Aplicar las Reglas

1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto: `diabetescontrol-2194b`
3. Ve a **Firestore Database** → **Reglas**
4. Reemplaza las reglas existentes con el código de arriba
5. Click en **Publicar**

## Verificación de Seguridad

Las reglas protegen:
- 🔒 **Datos médicos privados** de cada usuario
- 🔒 **Registros de glucosa e insulina** 
- 🔒 **Historial de comidas**
- 🔒 **Perfiles personales**
- 🔒 **Configuraciones individuales**
