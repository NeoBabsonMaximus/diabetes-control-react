export const getGlucoseColor = (level) => {
    if (level < 70) return 'bg-blue-100 text-blue-800';
    if (level > 180) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
};
