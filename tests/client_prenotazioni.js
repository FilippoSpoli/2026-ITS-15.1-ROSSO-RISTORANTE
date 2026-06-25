import { BASE_URL, logResult } from './config.js';

export async function testPrenotazioni() {
  console.log("\n--- 📝 Test Componente: Prenotazioni Client ---");
  try {
    const params = new URLSearchParams({
      nome: 'Test Cliente',
      email: 'cliente@test.com',
      telefono: '3334455666',
      data: '2026-09-10',
      ora: '21:00',
      ospiti: '2',
      note: 'Nessuna'
    });

    const res = await fetch(`${BASE_URL}/backend/salva_prenotazione.php`, {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const text = await res.text();
    logResult("Salvataggio Nuova Prenotazione", text.trim() === 'success', `(Risposta: ${text.trim()})`);
  } catch (err) {
    logResult("Salvataggio Nuova Prenotazione", false, `- Errore: ${err.message}`);
  }
}
