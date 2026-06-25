import { BASE_URL, logResult } from './config.js';

export async function testDashboard() {
  console.log("\n--- 📊 Test Componente: Admin Dashboard ---");
  try {
    const res = await fetch(`${BASE_URL}/backend/admin/DashboardController.php`);
    const data = await res.json();
    const valid = 'totale_ordini' in data && 'totale_incassi' in data;
    logResult("Lettura Dati Dashboard", valid, valid ? `(Ordini: ${data.totale_ordini})` : '');
  } catch (err) {
    logResult("Lettura Dati Dashboard", false, `- Errore: ${err.message}`);
  }
}
