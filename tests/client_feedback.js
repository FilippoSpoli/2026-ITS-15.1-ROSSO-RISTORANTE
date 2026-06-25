import { BASE_URL, logResult } from './config.js';

export async function testFeedback() {
  console.log("\n--- 💬 Test Componente: feedback / Recensioni ---");
  try {
    const params = new URLSearchParams({
      nome: 'Critico Gastronomico',
      valutazione: '5',
      commento: 'Carne spettacolare e cottura al millimetro. Consigliatissimo!'
    });

    const res = await fetch(`${BASE_URL}/backend/salva_feedback.php`, {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    
    const data = await res.json();
    logResult("Salvataggio Nuovo Feedback a DB", data.status === 'success', `(Messaggio: ${data.message})`);
  } catch (err) {
    logResult("Salvataggio Nuovo Feedback a DB", false, `- Errore: ${err.message}`);
  }
}
