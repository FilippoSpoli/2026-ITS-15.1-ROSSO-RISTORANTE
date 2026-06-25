const NOME_PROGETTO = '2026-ITS-15.1-ROSSO-RISTORANTE';

// Inizializziamo il BASE_URL di default su XAMPP / Porte standard (Porta 80 / nessuna porta)
let baseUrlDinamico = `http://localhost/${NOME_PROGETTO}`;

// Rilevamento automatico dell'ambiente (MAMP vs XAMPP/Standard)
try {
  // Facciamo un tentativo rapidissimo (timeout 200ms) sulla porta tipica di MAMP (8888)
  const controller = new AbortController();
  const idTimeout = setTimeout(() => controller.abort(), 200);

  // Proviamo a bussare alla dashboard di MAMP o alla root del progetto sulla porta 8888
  await fetch(`http://localhost:8888/`, { method: 'HEAD', signal: controller.signal });
  clearTimeout(idTimeout);
  
  // Se il fetch ha successo e non va in errore, siamo su MAMP!
  baseUrlDinamico = `http://localhost:8888/${NOME_PROGETTO}`;
} catch (e) {
  // Se va in errore o in timeout, significa che la porta 8888 è chiusa -> Rimane XAMPP/Standard
}

export const BASE_URL = baseUrlDinamico;

export function logResult(testName, passed, info = '') {
  if (passed) {
    console.log(`  ✅ PASSED: ${testName} ${info}`);
  } else {
    console.error(`  ❌ FAILED: ${testName} ${info}`);
  }
}
