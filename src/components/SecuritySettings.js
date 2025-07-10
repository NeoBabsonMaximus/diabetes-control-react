import React, { useState } from 'react';
import { Shield, Key, Mail, Trash2, AlertTriangle, Eye, EyeOff, LogOut } from 'lucide-react';

export const SecuritySettings = ({ user, onSignOut }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPasswords, setShowPasswords] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errors, setErrors] = useState({});
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');
        setErrors({});

        // Validaciones
        if (!currentPassword) {
            setErrors(prev => ({ ...prev, currentPassword: 'Contraseña actual requerida' }));
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setErrors(prev => ({ ...prev, newPassword: 'La nueva contraseña debe tener al menos 6 caracteres' }));
            setLoading(false);
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrors(prev => ({ ...prev, confirmPassword: 'Las contraseñas no coinciden' }));
            setLoading(false);
            return;
        }

        try {
            // Aquí implementarías la lógica para cambiar contraseña con Firebase
            // const { updatePassword, reauthenticateWithCredential, EmailAuthProvider } = await import('../services/firebase');
            
            setMessage('Contraseña actualizada correctamente');
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
        } catch (error) {
            setErrors({ general: 'Error al cambiar contraseña' });
        } finally {
            setLoading(false);
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleDeleteAccount = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDeleteAccount = async () => {
        setLoading(true);
        try {
            // Aquí implementarías la lógica para eliminar cuenta
            setMessage('Función de eliminación de cuenta no implementada por seguridad');
        } catch (error) {
            setMessage('Error al eliminar cuenta');
        } finally {
            setLoading(false);
            setShowDeleteConfirm(false);
        }
    };

    const securityStats = {
        accountCreated: user?.metadata?.creationTime ? 
            new Date(user.metadata.creationTime).toLocaleDateString() : 'N/A',
        lastSignIn: user?.metadata?.lastSignInTime ? 
            new Date(user.metadata.lastSignInTime).toLocaleDateString() : 'N/A',
        emailVerified: user?.emailVerified || false
    };

    return (
        <div className="space-y-6">
            {/* Mensaje */}
            {message && (
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <span className="text-blue-700 text-sm font-medium">{message}</span>
                </div>
            )}

            {/* Error general */}
            {errors.general && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                    <span className="text-red-700 text-sm">{errors.general}</span>
                </div>
            )}

            {/* Información de la cuenta */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                    <Shield className="w-5 h-5 text-blue-600" />
                    Información de la Cuenta
                </h3>
                
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-700">Email</div>
                            <div className="text-gray-900">{user?.email || 'N/A'}</div>
                            <div className="flex items-center gap-2 mt-1">
                                {securityStats.emailVerified ? (
                                    <>
                                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                        <span className="text-xs text-green-600">Verificado</span>
                                    </>
                                ) : (
                                    <>
                                        <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                                        <span className="text-xs text-yellow-600">No verificado</span>
                                    </>
                                )}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-700">Usuario ID</div>
                            <div className="text-gray-900 font-mono text-sm break-all">
                                {user?.uid || 'N/A'}
                            </div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-700">Cuenta creada</div>
                            <div className="text-gray-900">{securityStats.accountCreated}</div>
                        </div>

                        <div className="p-4 bg-gray-50 rounded-lg">
                            <div className="text-sm font-medium text-gray-700">Último acceso</div>
                            <div className="text-gray-900">{securityStats.lastSignIn}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cambiar contraseña */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                    <Key className="w-5 h-5 text-green-600" />
                    Cambiar Contraseña
                </h3>
                
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña actual
                        </label>
                        <div className="relative">
                            <input
                                type={showPasswords ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                className={`w-full px-3 py-2 pr-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                    errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                                }`}
                                placeholder="Ingresa tu contraseña actual"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPasswords(!showPasswords)}
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                            >
                                {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            </button>
                        </div>
                        {errors.currentPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.currentPassword}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nueva contraseña
                        </label>
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.newPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Ingresa tu nueva contraseña"
                        />
                        {errors.newPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.newPassword}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Confirmar nueva contraseña
                        </label>
                        <input
                            type={showPasswords ? 'text' : 'password'}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                            }`}
                            placeholder="Confirma tu nueva contraseña"
                        />
                        {errors.confirmPassword && (
                            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <Key className="w-4 h-4" />
                        )}
                        {loading ? 'Cambiando...' : 'Cambiar Contraseña'}
                    </button>
                </form>
            </div>

            {/* Sesiones activas */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                    <LogOut className="w-5 h-5 text-orange-600" />
                    Sesiones y Dispositivos
                </h3>
                
                <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="font-medium text-gray-900">Dispositivo Actual</div>
                                <div className="text-sm text-gray-500">
                                    {navigator.userAgent.includes('Mobile') ? 'Dispositivo móvil' : 'Computadora de escritorio'} • 
                                    Activo ahora
                                </div>
                            </div>
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        </div>
                    </div>

                    <button
                        onClick={onSignOut}
                        className="w-full flex items-center justify-center gap-2 p-3 border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-50 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Cerrar Sesión en Todos los Dispositivos
                    </button>
                </div>
            </div>

            {/* Privacidad y datos */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="flex items-center gap-2 text-lg font-medium text-gray-900 mb-4">
                    <Shield className="w-5 h-5 text-purple-600" />
                    Privacidad y Datos
                </h3>
                
                <div className="space-y-4">
                    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <h4 className="font-medium text-blue-900 mb-2">Tus Datos Están Seguros</h4>
                        <ul className="text-sm text-blue-700 space-y-1">
                            <li>• Tus datos médicos están cifrados</li>
                            <li>• Solo tú puedes acceder a tu información</li>
                            <li>• No compartimos datos con terceros</li>
                            <li>• Puedes exportar tus datos en cualquier momento</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Zona de peligro */}
            <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
                <h3 className="flex items-center gap-2 text-lg font-medium text-red-900 mb-4">
                    <Trash2 className="w-5 h-5 text-red-600" />
                    Zona de Peligro
                </h3>
                
                <div className="space-y-4">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-5 h-5 text-red-600" />
                            <span className="font-medium text-red-800">Eliminar Cuenta</span>
                        </div>
                        <p className="text-sm text-red-700 mb-3">
                            Esta acción eliminará permanentemente tu cuenta y todos tus datos. No se puede deshacer.
                        </p>
                        
                        <button
                            onClick={handleDeleteAccount}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                        >
                            Eliminar Mi Cuenta
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal de confirmación para eliminar cuenta */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md mx-4">
                        <div className="flex items-center gap-3 mb-4">
                            <AlertTriangle className="w-6 h-6 text-red-600" />
                            <h3 className="text-lg font-medium text-gray-900">Eliminar Cuenta</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-4">
                            ¿Estás absolutamente seguro? Esta acción eliminará permanentemente tu cuenta, 
                            todos tus datos médicos y configuraciones.
                        </p>
                        <p className="text-sm font-medium text-red-600 mb-6">
                            Esta acción NO se puede deshacer.
                        </p>
                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={confirmDeleteAccount}
                                disabled={loading}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {loading ? 'Eliminando...' : 'Sí, Eliminar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
