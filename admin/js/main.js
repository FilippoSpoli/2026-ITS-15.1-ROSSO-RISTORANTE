const BACKEND_ADMIN_URL = '../backend/admin/';

// Helper globale per formattare la valuta in modo uniforme nell'admin
window.formattaEuro = function(valore) {
    return `€ ${parseFloat(valore || 0).toFixed(2)}`;
};
