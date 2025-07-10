import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { signInWithEmail, signUp, resetPassword } from '../services/firebase';

export const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Limpiar errores cuando el usuario empiece a escribir
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!isLogin && !formData.name.trim()) {
            newErrors.name = 'El nombre es requerido';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'El email es requerido';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }

        if (!formData.password) {
            newErrors.password = 'La contraseña es requerida';
        } else if (!isLogin && formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }

        if (!isLogin && formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setLoading(true);
        setMessage('');
        setErrors({});

        try {
            if (isLogin) {
                const { user, error } = await signInWithEmail(formData.email, formData.password);
                if (error) {
                    setErrors({ general: getErrorMessage(error) });
                }
            } else {
                const { user, error } = await signUp(formData.email, formData.password, formData.name);
                if (error) {
                    setErrors({ general: getErrorMessage(error) });
                } else {
                    setMessage('¡Cuenta creada exitosamente! Iniciando sesión...');
                }
            }
        } catch (error) {
            setErrors({ general: 'Error de conexión. Intenta nuevamente.' });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = async () => {
        if (!formData.email) {
            setErrors({ email: 'Ingresa tu email para recuperar la contraseña' });
            return;
        }

        setLoading(true);
        try {
            const { error } = await resetPassword(formData.email);
            if (error) {
                setErrors({ general: getErrorMessage(error) });
            } else {
                setMessage('Email de recuperación enviado. Revisa tu bandeja de entrada.');
            }
        } catch (error) {
            setErrors({ general: 'Error al enviar email de recuperación.' });
        } finally {
            setLoading(false);
        }
    };

    const getErrorMessage = (error) => {
        switch (error) {
            case 'auth/user-not-found':
                return 'No existe una cuenta con este email';
            case 'auth/wrong-password':
                return 'Contraseña incorrecta';
            case 'auth/email-already-in-use':
                return 'Este email ya está registrado';
            case 'auth/weak-password':
                return 'La contraseña debe tener al menos 6 caracteres';
            case 'auth/invalid-email':
                return 'Email inválido';
            case 'auth/too-many-requests':
                return 'Demasiados intentos. Intenta más tarde';
            default:
                return error;
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <LogIn className="w-8 h-8 text-blue-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900 mb-2">
                            Control de Diabetes
                        </h1>
                        <p className="text-gray-600">
                            {isLogin ? 'Inicia sesión en tu cuenta' : 'Crea tu cuenta nueva'}
                        </p>
                    </div>

                    {/* Mensaje de éxito */}
                    {message && (
                        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700">{message}</p>
                        </div>
                    )}

                    {/* Error general */}
                    {errors.general && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                            <AlertCircle className="w-4 h-4 text-red-500" />
                            <p className="text-sm text-red-700">{errors.general}</p>
                        </div>
                    )}

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Nombre (solo registro) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre completo
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.name ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Tu nombre completo"
                                    />
                                    <UserPlus className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                </div>
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                )}
                            </div>
                        )}

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.email ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="tu@email.com"
                                />
                                <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                            </div>
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Contraseña
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                        errors.password ? 'border-red-300' : 'border-gray-300'
                                    }`}
                                    placeholder="Tu contraseña"
                                />
                                <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        {/* Confirmar contraseña (solo registro) */}
                        {!isLogin && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirmar contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        name="confirmPassword"
                                        value={formData.confirmPassword}
                                        onChange={handleInputChange}
                                        className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                            errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                                        }`}
                                        placeholder="Confirma tu contraseña"
                                    />
                                    <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                                </div>
                                {errors.confirmPassword && (
                                    <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                )}
                            </div>
                        )}

                        {/* Botón submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {loading ? (
                                <div className="flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                    {isLogin ? 'Iniciando sesión...' : 'Creando cuenta...'}
                                </div>
                            ) : (
                                isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'
                            )}
                        </button>
                    </form>

                    {/* Enlaces adicionales */}
                    <div className="mt-6 space-y-3">
                        {isLogin && (
                            <button
                                onClick={handleForgotPassword}
                                disabled={loading}
                                className="w-full text-sm text-blue-600 hover:text-blue-700 disabled:opacity-50"
                            >
                                ¿Olvidaste tu contraseña?
                            </button>
                        )}

                        <div className="text-center">
                            <span className="text-sm text-gray-600">
                                {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                            </span>
                            <button
                                onClick={() => {
                                    setIsLogin(!isLogin);
                                    setErrors({});
                                    setMessage('');
                                    setFormData({
                                        name: '',
                                        email: '',
                                        password: '',
                                        confirmPassword: ''
                                    });
                                }}
                                className="ml-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center mt-8">
                    <p className="text-xs text-gray-500">
                        Control de Diabetes - Herramienta de apoyo médico
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        No reemplaza el consejo médico profesional
                    </p>
                </div>
            </div>
        </div>
    );
};
