import React, { useState } from 'react';
import { Plus, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';

export const AddRecordForm = ({ onAddRecord, profile }) => {
    const [glucose, setGlucose] = useState('');
    const [fastInsulin, setFastInsulin] = useState('');
    const [otherInsulin, setOtherInsulin] = useState('');
    const [totalInsulin, setTotalInsulin] = useState('');
    const [comments, setComments] = useState('');
    const [time, setTime] = useState(new Date().toTimeString().slice(0, 5));
    const [insulinType, setInsulinType] = useState('');
    const [showWarning, setShowWarning] = useState(false);
    const [warningMessage, setWarningMessage] = useState('');
    const [showDetailedInsulin, setShowDetailedInsulin] = useState(false);

    // Función para calcular límites seguros de insulina según el tipo de diabetes
    const getInsulinWarningLimits = () => {
        if (!profile) return { fast: 15, other: 25 };
        
        switch (profile.diabetesType) {
            case 'Tipo 1':
                return { fast: 12, other: 20 }; // Más sensibles a la insulina
            case 'Tipo 2':
                return { fast: 18, other: 30 }; // Pueden necesitar más insulina
            case 'Gestacional':
                return { fast: 10, other: 15 }; // Más precaución durante embarazo
            case 'LADA':
                return { fast: 12, other: 20 }; // Similar a Tipo 1
            case 'MODY':
                return { fast: 8, other: 15 }; // Generalmente necesitan menos
            default:
                return { fast: 15, other: 25 };
        }
    };

    // Función para verificar advertencias de insulina
    const checkInsulinWarning = (fastValue, otherValue, totalValue) => {
        const limits = getInsulinWarningLimits();
        const fastNum = Number(fastValue) || 0;
        const otherNum = Number(otherValue) || 0;
        const totalNum = Number(totalValue) || 0;
        
        // Verificar límites individuales y total
        const fastExceeded = fastNum > limits.fast;
        const otherExceeded = otherNum > limits.other;
        const totalExceeded = totalNum > (limits.fast + limits.other);
        
        if (fastExceeded || otherExceeded || totalExceeded) {
            let message = '⚠️ Advertencia: Dosis de insulina alta ';
            
            if (totalExceeded) {
                message += `(Total: ${totalNum}U es muy alto)`;
            } else if (fastExceeded && otherExceeded) {
                message += 'para ambos tipos de insulina';
            } else if (fastExceeded) {
                message += 'para insulina rápida';
            } else {
                message += 'para otra insulina';
            }
            
            message += ` (${profile?.diabetesType || 'tu tipo de diabetes'}). Verifica con tu médico.`;
            
            setWarningMessage(message);
            setShowWarning(true);
        } else {
            setShowWarning(false);
            setWarningMessage('');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!glucose) return;
        
        const [hours, minutes] = time.split(':');
        const recordDate = new Date();
        recordDate.setHours(parseInt(hours), parseInt(minutes));
        
        onAddRecord({
            glucoseLevel: Number(glucose),
            rapidInsulin: Number(fastInsulin) || 0,
            otherInsulin: Number(otherInsulin) || 0,
            totalInsulin: Number(totalInsulin) || 0,
            insulinType: insulinType,
            recordTime: time,
            recordDate: recordDate,
            comments: comments.trim(),
        });
        
        // Limpiar formulario
        setGlucose('');
        setFastInsulin('');
        setOtherInsulin('');
        setTotalInsulin('');
        setComments('');
        setInsulinType('');
        setTime(new Date().toTimeString().slice(0, 5));
        setShowWarning(false);
        setWarningMessage('');
        setShowDetailedInsulin(false);
    };

    const handleFastInsulinChange = (e) => {
        const value = e.target.value;
        setFastInsulin(value);
        checkInsulinWarning(value, otherInsulin, totalInsulin);
    };

    const handleOtherInsulinChange = (e) => {
        const value = e.target.value;
        setOtherInsulin(value);
        checkInsulinWarning(fastInsulin, value, totalInsulin);
    };

    const handleTotalInsulinChange = (e) => {
        const value = e.target.value;
        setTotalInsulin(value);
        checkInsulinWarning(fastInsulin, otherInsulin, value);
    };

    const toggleDetailedInsulin = () => {
        if (showDetailedInsulin) {
            // Si se oculta, limpiar los campos detallados
            setFastInsulin('');
            setOtherInsulin('');
        }
        setShowDetailedInsulin(!showDetailedInsulin);
    };

    return (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">Nuevo Registro</h3>
            
            {/* Advertencia de insulina */}
            {showWarning && (
                <div className="mb-4 p-3 sm:p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-md">
                    <div className="flex items-start sm:items-center">
                        <AlertTriangle className="h-5 w-5 text-yellow-400 mr-2 flex-shrink-0 mt-0.5 sm:mt-0" />
                        <p className="text-sm text-yellow-700 leading-relaxed">{warningMessage}</p>
                    </div>
                </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Glucosa - Campo principal más prominente */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Glucosa (mg/dL) <span className="text-red-500">*</span>
                    </label>
                    <input 
                        type="number" 
                        value={glucose} 
                        onChange={e => setGlucose(e.target.value)} 
                        required 
                        className="w-full p-4 text-lg border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" 
                        placeholder="Ej: 120" 
                        min="0"
                        max="600"
                        autoComplete="off"
                    />
                </div>
                
                {/* Hora y Total Insulina en una fila en escritorio, separados en móvil */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Hora del Registro</label>
                        <input 
                            type="time" 
                            value={time} 
                            onChange={e => setTime(e.target.value)} 
                            className="w-full p-3 sm:p-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" 
                        />
                    </div>
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Total Insulina (U)</label>
                        <input 
                            type="number" 
                            value={totalInsulin} 
                            onChange={handleTotalInsulinChange} 
                            className="w-full p-3 sm:p-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" 
                            placeholder="Ej: 15" 
                            min="0"
                            max="100"
                            step="0.5"
                            autoComplete="off"
                        />
                    </div>
                </div>
                
                {/* Tipo de Insulina */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Insulina</label>
                    <select 
                        value={insulinType} 
                        onChange={e => setInsulinType(e.target.value)} 
                        className="w-full p-3 sm:p-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                    >
                        <option value="">Seleccionar tipo</option>
                        <option value="Humalog">Humalog (Lispro)</option>
                        <option value="NovoRapid">NovoRapid (Aspart)</option>
                        <option value="Apidra">Apidra (Glulisina)</option>
                        <option value="Lantus">Lantus (Glargina)</option>
                        <option value="Levemir">Levemir (Detemir)</option>
                        <option value="Tresiba">Tresiba (Degludec)</option>
                        <option value="Humulin">Humulin (Regular)</option>
                        <option value="NPH">NPH (Intermedia)</option>
                        <option value="Otra">Otra</option>
                    </select>
                </div>
                
                {/* Botón para mostrar campos detallados */}
                <div>
                    <button 
                        type="button"
                        onClick={toggleDetailedInsulin}
                        className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium py-2 px-3 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                        {showDetailedInsulin ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        {showDetailedInsulin ? 'Ocultar detalle por tipo' : 'Agregar detalle por tipo de insulina'}
                    </button>
                </div>
                
                {/* Campos detallados - Solo se muestran si showDetailedInsulin es true */}
                {showDetailedInsulin && (
                    <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Insulina Rápida (U)</label>
                                <input 
                                    type="number" 
                                    value={fastInsulin} 
                                    onChange={handleFastInsulinChange} 
                                    className="w-full p-3 sm:p-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" 
                                    placeholder="Ej: 5" 
                                    min="0"
                                    max="100"
                                    step="0.5"
                                    autoComplete="off"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Otra Insulina (U)</label>
                                <input 
                                    type="number" 
                                    value={otherInsulin} 
                                    onChange={handleOtherInsulinChange} 
                                    className="w-full p-3 sm:p-2 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white" 
                                    placeholder="Ej: 10" 
                                    min="0"
                                    max="100"
                                    step="0.5"
                                    autoComplete="off"
                                />
                            </div>
                        </div>
                        
                        <div className="p-3 bg-blue-100 rounded-md border border-blue-300">
                            <p className="text-xs text-blue-800 leading-relaxed">
                                💡 <strong>Opcional:</strong> Usa estos campos si aplicaste una mezcla de insulinas o quieres un control más detallado por tipo.
                            </p>
                        </div>
                    </div>
                )}
                
                {/* Notas */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Opinión / Notas</label>
                    <textarea 
                        value={comments} 
                        onChange={e => setComments(e.target.value)} 
                        className="w-full p-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white resize-none" 
                        rows="3" 
                        placeholder="Cómo te sientes, qué comiste..."
                    />
                </div>
                
                {/* Botón de envío */}
                <div className="pt-2">
                    <button 
                        type="submit" 
                        className="w-full bg-blue-600 text-white font-bold py-4 px-6 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition-colors flex items-center justify-center gap-2 text-base shadow-sm"
                    >
                        <Plus size={20} /> Añadir Registro
                    </button>
                </div>
            </form>
        </div>
    );
};
