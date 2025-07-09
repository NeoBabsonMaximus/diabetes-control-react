import { Capacitor } from '@capacitor/core';
import { App } from '@capacitor/app';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { Keyboard } from '@capacitor/keyboard';
import { StatusBar, Style } from '@capacitor/status-bar';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { LocalNotifications } from '@capacitor/local-notifications';
import { Preferences } from '@capacitor/preferences';

class MobileService {
    constructor() {
        this.initializeApp();
    }

    // Inicializar configuraciones de la app móvil
    async initializeApp() {
        if (Capacitor.isNativePlatform()) {
            // Configurar barra de estado
            await StatusBar.setStyle({ style: Style.Default });
            await StatusBar.setBackgroundColor({ color: '#3B82F6' });

            // Solicitar permisos de notificaciones
            await LocalNotifications.requestPermissions();

            // Configurar listeners de la app
            App.addListener('appStateChange', ({ isActive }) => {
                console.log('App state changed. Is active?', isActive);
            });

            App.addListener('backButton', ({ canGoBack }) => {
                if (!canGoBack) {
                    App.exitApp();
                } else {
                    window.history.back();
                }
            });
        }
    }

    // Vibración táctil para feedback
    async triggerHaptic(style = ImpactStyle.Medium) {
        if (Capacitor.isNativePlatform()) {
            await Haptics.impact({ style });
        }
    }

    // Tomar foto para registro de comidas
    async takePhoto() {
        try {
            const image = await Camera.getPhoto({
                quality: 80,
                allowEditing: true,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Camera,
                width: 800,
                height: 600
            });
            return image.dataUrl;
        } catch (error) {
            console.error('Error al tomar foto:', error);
            throw error;
        }
    }

    // Seleccionar imagen de galería
    async selectImage() {
        try {
            const image = await Camera.getPhoto({
                quality: 80,
                allowEditing: true,
                resultType: CameraResultType.DataUrl,
                source: CameraSource.Photos,
                width: 800,
                height: 600
            });
            return image.dataUrl;
        } catch (error) {
            console.error('Error al seleccionar imagen:', error);
            throw error;
        }
    }

    // Programar notificación de recordatorio
    async scheduleReminder(title, body, delay = 3600) { // 1 hora por defecto
        if (Capacitor.isNativePlatform()) {
            await LocalNotifications.schedule({
                notifications: [
                    {
                        title,
                        body,
                        id: Date.now(),
                        schedule: { at: new Date(Date.now() + delay * 1000) },
                        sound: undefined,
                        attachments: undefined,
                        actionTypeId: '',
                        extra: null
                    }
                ]
            });
        }
    }

    // Guardar datos localmente
    async setStorageItem(key, value) {
        await Preferences.set({
            key,
            value: JSON.stringify(value)
        });
    }

    // Obtener datos locales
    async getStorageItem(key) {
        const { value } = await Preferences.get({ key });
        return value ? JSON.parse(value) : null;
    }

    // Remover datos locales
    async removeStorageItem(key) {
        await Preferences.remove({ key });
    }

    // Verificar si está en dispositivo móvil
    isNative() {
        return Capacitor.isNativePlatform();
    }

    // Verificar si está en Android
    isAndroid() {
        return Capacitor.getPlatform() === 'android';
    }

    // Verificar si está en iOS
    isIOS() {
        return Capacitor.getPlatform() === 'ios';
    }

    // Ocultar/mostrar teclado
    async hideKeyboard() {
        if (Capacitor.isNativePlatform()) {
            await Keyboard.hide();
        }
    }

    // Configurar recordatorios automáticos
    async setupAutomaticReminders() {
        const reminders = [
            {
                title: 'Medición matutina',
                body: 'Es hora de medir tu glucosa en ayunas',
                hours: 7,
                minutes: 0
            },
            {
                title: 'Registro de almuerzo',
                body: 'No olvides registrar tu comida y medición',
                hours: 13,
                minutes: 0
            },
            {
                title: 'Medición nocturna',
                body: 'Registra tu última medición del día',
                hours: 21,
                minutes: 0
            }
        ];

        for (const reminder of reminders) {
            const now = new Date();
            const scheduledTime = new Date();
            scheduledTime.setHours(reminder.hours, reminder.minutes, 0, 0);
            
            // Si ya pasó la hora de hoy, programar para mañana
            if (scheduledTime <= now) {
                scheduledTime.setDate(scheduledTime.getDate() + 1);
            }

            await this.scheduleReminder(
                reminder.title,
                reminder.body,
                Math.floor((scheduledTime.getTime() - now.getTime()) / 1000)
            );
        }
    }
}

export default new MobileService();
