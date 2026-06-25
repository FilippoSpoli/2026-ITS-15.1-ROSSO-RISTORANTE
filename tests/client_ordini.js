import { BASE_URL, logResult } from './config.js';

export async function testOrdini() {
  console.log("\n--- 🛒 Test Componente: Ordini E-Commerce ---");
  try {
    const params = new URLSearchParams({
      nome: 'Test Consegna',
      indirizzo: 'Via del Test 99',
      telefono: '3221112223',
      carrello: JSON.stringify([{ id: 1, nome: 'Piatto Test', quantita: 1 }]),
      totale: '25.50',
      note: 'Suonare forte'
    });

    const res = await fetch(`${BASE_URL}/backend/salva_ordine.php`, {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const text = await res.text();
    logResult("Salvataggio Nuovo Ordine", text.trim() === 'success', `(Risposta: ${text.trim()})`);
  } catch (err) {
    logResult("Salvataggio Nuovo Ordine", false, `- Errore: ${err.message}`);
  }
}
