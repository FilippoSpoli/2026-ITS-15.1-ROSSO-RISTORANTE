import { testPrenotazioni } from './client_prenotazioni.js';
import { testOrdini } from './client_ordini.js';
import { testDashboard } from './admin_dashboard.js';
import { testMenu } from './admin_menu.js';
import { testAdminPrenotazioni } from './admin_prenotazioni.js';
import { testPersonale } from './admin_personale.js';

async function main() {
  console.log("==================================================");
  console.log("🌟 AVVIO DELLA SUITE DI TEST DA TERMINALE (NODE) 🌟");
  console.log("==================================================");

  await testPrenotazioni();
  await testOrdini();
  await testDashboard();
  await testMenu();
  await testAdminPrenotazioni();
  await testPersonale();

  console.log("\n==================================================");
  console.log("🏁 TUTTI I COMPONENTI SONO STATI VERIFICATI");
  console.log("==================================================");
}

main();
