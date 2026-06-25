import { BASE_URL, logResult } from './config.js';

export async function testAdminPrenotazioni() {
  console.log("\n--- 📅 Test Componente: Gestione Prenotazioni Admin ---");
  try {
    const res = await fetch(`${BASE_URL}/backend/admin/PrenotazioniController.php?action=index`);
    const data = await res.json();
    logResult("Lettura Lista Prenotazioni", Array.isArray(data), `(Trovate: ${data.length})`);
  } catch (err) {
    logResult("Lettura Lista Prenotazioni", false, `- Errore: ${err.message}`);
  }
}
