const BACKEND_ADMIN_URL = '../backend/admin/';

window.formattaEuro = function(valore) {
    return `€ ${parseFloat(valore || 0).toFixed(2)}`;
};

async function caricaKpiDashboard() {
    try {
        const response = await fetch(`${BACKEND_ADMIN_URL}DashboardController.php`);
        if (!response.ok) throw new Error("Impossibile recuperare i KPI.");
        
        const dati = await response.json();

        if (document.getElementById('kpi-ordini'))       document.getElementById('kpi-ordini').innerText = dati.totale_ordini;
        if (document.getElementById('kpi-incassi'))      document.getElementById('kpi-incassi').innerText = window.formattaEuro(dati.totale_incassi);
        if (document.getElementById('kpi-piatti'))       document.getElementById('kpi-piatti').innerText = dati.totale_piatti;
        if (document.getElementById('kpi-prenotazioni')) document.getElementById('kpi-prenotazioni').innerText = dati.totale_prenotazioni;
        if (document.getElementById('kpi-ferie'))        document.getElementById('kpi-ferie').innerText = dati.ferie_attesa;
        if (document.getElementById('kpi-malattie'))     document.getElementById('kpi-malattie').innerText = dati.malattie_attive;
        if (document.getElementById('kpi-cedolini'))     document.getElementById('kpi-cedolini').innerText = dati.cedolini_mese;

    } catch (error) {
        console.error("Errore nel popolamento dei KPI della dashboard:", error);
    }
}

document.addEventListener('DOMContentLoaded', caricaKpiDashboard);
