import { BASE_URL, logResult } from './config.js';

export async function testMenu() {
  console.log("\n--- 🍔 Test Componente: Gestione Menu Admin ---");
  
  // 1. Test Lettura
  try {
    const res = await fetch(`${BASE_URL}/backend/admin/MenuController.php?action=index`);
    const data = await res.json();
    logResult("Lettura Lista Piatti", Array.isArray(data), `(Trovati: ${data.length})`);
  } catch (err) {
    logResult("Lettura Lista Piatti", false, `- Errore: ${err.message}`);
  }

  // 2. Test Inserimento (Ottimizzato per terminale Node con urlencoded)
  try {
    const params = new URLSearchParams();
    params.append('nome', 'Nuovo Piatto Test Terminale');
    params.append('categoria', 'Primi');
    params.append('prezzo', '14.50');
    params.append('foto', 'piatto_node_test.jpg');
    params.append('disponibile', '1');

    const res = await fetch(`${BASE_URL}/backend/admin/MenuController.php?action=store`, {
      method: 'POST',
      body: params,
      headers: { 
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    
    const data = await res.json();
    logResult("Inserimento Piatto", data.status === 'success', `(Messaggio: ${data.message})`);
  } catch (err) {
    logResult("Inserimento Piatto", false, `- Errore: ${err.message}`);
  }
}
