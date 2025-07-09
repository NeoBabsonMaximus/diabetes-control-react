import React from 'react';
import { BookOpen, Syringe, ChevronRight } from 'lucide-react';
import { getGlucoseColor } from '../utils/helpers';

export const RecordListItem = ({ record, onSelect }) => {
    // Función para manejar tanto timestamps de Firebase como objetos Date normales
    const getDisplayDate = (timestamp) => {
        if (!timestamp) return '';
        
        // Si es un timestamp de Firebase (tiene método toDate)
        if (timestamp.toDate && typeof timestamp.toDate === 'function') {
            return timestamp.toDate();
        }
        
        // Si es un objeto Date normal
        if (timestamp instanceof Date) {
            return timestamp;
        }
        
        // Si es una string de fecha, convertir a Date
        if (typeof timestamp === 'string') {
            return new Date(timestamp);
        }
        
        // Fallback: fecha actual
        return new Date();
    };

    const displayDate = getDisplayDate(record.timestamp);

    return (
        <div 
            onClick={() => onSelect(record)} 
            className="bg-white rounded-xl shadow-sm border p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 active:bg-gray-100 transition-colors min-h-[70px]"
        >
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                <span className={`px-3 py-2 text-sm sm:text-base font-semibold rounded-full flex-shrink-0 ${getGlucoseColor(record.glucoseLevel)}`}>
                    {record.glucoseLevel}
                </span>
                <div className="text-sm text-gray-600 flex-1 min-w-0">
                    <div className="font-medium text-gray-800 text-base">
                        {record.recordTime || displayDate.toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                        {displayDate.toLocaleDateString('es-MX', {
                            day: 'numeric', month: 'short', year: 'numeric'
                        })}
                    </div>
                    {record.insulinType && (
                        <div className="text-xs text-blue-600 font-medium mt-1 p-1 bg-blue-50 rounded">
                            {record.totalInsulin ? `${record.totalInsulin}U - ` : ''}{record.insulinType}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex items-center gap-2 text-gray-400 flex-shrink-0 ml-2">
                {record.comments && <BookOpen size={16} className="text-amber-500" />}
                {(record.rapidInsulin > 0 || record.otherInsulin > 0 || record.totalInsulin > 0) && <Syringe size={16} className="text-blue-500" />}
                <ChevronRight size={20} className="text-gray-300" />
            </div>
        </div>
    );
};
