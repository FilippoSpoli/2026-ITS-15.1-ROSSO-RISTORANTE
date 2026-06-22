async function caricaKpiDashboard() {
    try {
        const response = await fetch(`${BACKEND_ADMIN_URL}DashboardController.php`);
        if (!response.ok) throw new Error("Impossibile recuperare i KPI dal server.");
        
        const dati = await response.json();

        if (document.getElementById('kpi-ordini')) {
            document.getElementById('kpi-ordini').innerText = dati.totale_ordini || 0;
        }
        if (document.getElementById('kpi-incassi')) {
            document.getElementById('kpi-incassi').innerText = window.formattaEuro(dati.totale_incassi);
        }
        if (document.getElementById('kpi-piatti')) {
            document.getElementById('kpi-piatti').innerText = dati.totale_piatti || 0;
        }
        if (document.getElementById('kpi-prenotazioni')) {
            document.getElementById('kpi-prenotazioni').innerText = dati.totale_prenotazioni || 0;
        }
    } catch (error) {
        console.error("Errore nel caricamento della dashboard:", error);
    }
}

// Inizializzazione al caricamento del DOM
document.addEventListener('DOMContentLoaded', caricaKpiDashboard);
