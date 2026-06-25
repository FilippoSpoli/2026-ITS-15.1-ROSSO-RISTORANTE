// tests/test.js
const BASE_URL = 'http://localhost/2026-ITS-15.1-ROSSO-RISTORANTE';

// Funzione di utilità per stampare i risultati dei test con uno stile pulito
function logResult(name, passed, extra = '') {
  if (passed) {
    console.log(`✅ PASSED: ${name} ${extra}`);
  } else {
    console.error(`❌ FAILED: ${name} ${extra}`);
  }
}

async function runAllTests() {
  console.log("==================================================");
  console.log("🚀 AVVIO TEST DI INTEGRAZIONE RAPIDI (LATO CLIENT)");
  console.log("==================================================\n");

  // 1. TEST: salva_prenotazione.php (POST)
  try {
    const dataPrenotazione = new URLSearchParams({
      nome: 'Marco Verdi',
      email: 'marco.verdi@example.com',
      telefono: '3339876543',
      data: '2026-08-15',
      ora: '20:30',
      ospiti: '4',
      note: 'Tavolo all\'aperto grazie'
    });

    const res = await fetch(`${BASE_URL}/backend/salva_prenotazione.php`, {
      method: 'POST',
      body: dataPrenotazione,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const text = await res.text();
    logResult("salva_prenotazione.php", text.trim() === 'success', `(Risposta: ${text.trim()})`);
  } catch (err) {
    logResult("salva_prenotazione.php", false, `- Errore: ${err.message}`);
  }

  // 2. TEST: salva_ordine.php (POST)
  try {
    const dataOrdine = new URLSearchParams({
      nome: 'Luigi Bianchi',
      indirizzo: 'Via Roma 12, Milano',
      telefono: '3201234567',
      carrello: '[{"id":1,"nome":"Bistecca Fiorentina","quantita":2}]',
      totale: '50.00',
      note: 'Citofono Bianchi'
    });

    const res = await fetch(`${BASE_URL}/backend/salva_ordine.php`, {
      method: 'POST',
      body: dataOrdine,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const text = await res.text();
    logResult("salva_ordine.php", text.trim() === 'success', `(Risposta: ${text.trim()})`);
  } catch (err) {
    logResult("salva_ordine.php", false, `- Errore: ${err.message}`);
  }

  console.log("\n==================================================");
  console.log("📊 AVVIO TEST ENDPOINT GESTIONALI (LATO ADMIN)");
  console.log("==================================================\n");

  // 3. TEST: DashboardController.php (GET)
  try {
    const res = await fetch(`${BASE_URL}/backend/admin/DashboardController.php`);
    const data = await res.json();
    const hasKeys = 'totale_ordini' in data && 'totale_incassi' in data;
    logResult("DashboardController.php (GET)", hasKeys, hasKeys ? `(Ordini: ${data.totale_ordini}, Incassi: €${data.totale_incassi})` : '');
  } catch (err) {
    logResult("DashboardController.php (GET)", false, `- Errore: ${err.message}`);
  }

  // 4. TEST: MenuController.php -> action=index (GET)
  try {
    const res = await fetch(`${BASE_URL}/backend/admin/MenuController.php?action=index`);
    const data = await res.json();
    logResult("MenuController.php?action=index (GET)", Array.isArray(data), `(Trovati ${data.length} piatti)`);
  } catch (err) {
    logResult("MenuController.php?action=index (GET)", false, `- Errore: ${err.message}`);
  }

  // 5. TEST: MenuController.php -> action=store (POST)
  try {
    const nuovoPiatto = new URLSearchParams({
      nome: 'Tagliata di Angus',
      categoria: 'Secondi',
      prezzo: '22.00',
      foto: 'angus.jpg',
      disponibile: '1'
    });

    const res = await fetch(`${BASE_URL}/backend/admin/MenuController.php?action=store`, {
      method: 'POST',
      body: nuovoPiatto,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const data = await res.json();
    logResult("MenuController.php?action=store (POST)", data.status === 'success', `(Messaggio: ${data.message})`);
  } catch (err) {
    logResult("MenuController.php?action=store (POST)", false, `- Errore: ${err.message}`);
  }

  // 6. TEST: PrenotazioniController.php -> action=index (GET)
  try {
    const res = await fetch(`${BASE_URL}/backend/admin/PrenotazioniController.php?action=index`);
    const data = await res.json();
    logResult("PrenotazioniController.php?action=index (GET)", Array.isArray(data), `(Trovate ${data.length} prenotazioni)`);
  } catch (err) {
    logResult("PrenotazioniController.php?action=index (GET)", false, `- Errore: ${err.message}`);
  }

  // 7. TEST: FerieController.php -> action=index (GET)
  try {
    const res = await fetch(`${BASE_URL}/backend/admin/FerieController.php?action=index`);
    const data = await res.json();
    logResult("FerieController.php?action=index (GET)", Array.isArray(data), `(Trovate ${data.length} richieste ferie)`);
  } catch (err) {
    logResult("FerieController.php?action=index (GET)", false, `- Errore: ${err.message}`);
  }

  // 8. TEST: MalattiaController.php -> action=index (GET)
  try {
    const res = await fetch(`${BASE_URL}/backend/admin/MalattiaController.php?action=index`);
    const data = await res.json();
    logResult("MalattiaController.php?action=index (GET)", Array.isArray(data), `(Trovate ${data.length} pratiche malattia)`);
  } catch (err) {
    logResult("MalattiaController.php?action=index (GET)", false, `- Errore: ${err.message}`);
  }

  // 9. TEST: CedoliniController.php -> action=index (GET)
  try {
    const res = await fetch(`${BASE_URL}/backend/admin/CedoliniController.php?action=index`);
    const data = await res.json();
    logResult("CedoliniController.php?action=index (GET)", Array.isArray(data), `(Trovati ${data.length} cedolini)`);
  } catch (err) {
    logResult("CedoliniController.php?action=index (GET)", false, `- Errore: ${err.message}`);
  }

  console.log("\n==================================================");
  console.log("🏁 TEST COMPLETATI");
  console.log("==================================================");
}

runAllTests();
