import { BASE_URL, logResult } from './config.js';

export async function testPersonale() {
  console.log("\n--- 👥 Test Componente: Gestione Personale e Risorse Umane ---");

  // Ferie
  try {
    const res = await fetch(`${BASE_URL}/backend/admin/FerieController.php?action=index`);
    const data = await res.json();
    logResult("Lettura Richieste Ferie", Array.isArray(data), `(Record: ${data.length})`);
  } catch (err) {
    logResult("Lettura Richieste Ferie", false, `- Errore: ${err.message}`);
  }

  // Malattia
  try {
    const res = await fetch(`${BASE_URL}/backend/admin/MalattiaController.php?action=index`);
    const data = await res.json();
    logResult("Lettura Pratiche Malattia", Array.isArray(data), `(Record: ${data.length})`);
  } catch (err) {
    logResult("Lettura Pratiche Malattia", false, `- Errore: ${err.message}`);
  }

  // Cedolini
  try {
    const res = await fetch(`${BASE_URL}/backend/admin/CedoliniController.php?action=index`);
    const data = await res.json();
    logResult("Lettura Registro Cedolini", Array.isArray(data), `(Record: ${data.length})`);
  } catch (err) {
    logResult("Lettura Registro Cedolini", false, `- Errore: ${err.message}`);
  }
}
