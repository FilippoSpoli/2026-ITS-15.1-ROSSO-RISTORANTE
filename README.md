# 🥩 Steakhouse — Sito Web & Pannello di Amministrazione

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat&logo=php&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)

> Progetto scolastico ITS 2026 — Sito web completo per uno steakhouse premium con pannello di amministrazione integrato, sistema di prenotazioni e ordinazioni online.

---

## 📋 Indice

- [Panoramica](#-panoramica)
- [Funzionalità](#-funzionalità)
- [Struttura del Progetto](#-struttura-del-progetto)
- [Stack Tecnologico](#-stack-tecnologico)
- [Prerequisiti e Installazione](#-prerequisiti-e-installazione)
- [Configurazione del Database](#-configurazione-del-database)
- [Accesso all'Area Admin](#-accesso-allarea-admin)
- [Suite di Test](#-suite-di-test)
- [Struttura del Database](#-struttura-del-database)

---

## 🔍 Panoramica

**Steakhouse** è un'applicazione web full-stack per la gestione di un ristorante premium. Il progetto comprende un sito pubblico rivolto ai clienti e un pannello di amministrazione completo per la gestione operativa del locale.

Il design del sito pubblico segue un'estetica dark-luxury con palette oro (`#C5A059`) su sfondo nero profondo (`#0a0a0a`), realizzata interamente con Tailwind CSS. Il pannello admin è costruito su AdminLTE 3.

---

## ✨ Funzionalità

### 🌐 Sito Pubblico

| Pagina | Descrizione |
|---|---|
| `index.html` | Homepage con hero section, slider specialità, carosello e recensioni |
| `chi-siamo.html` | Pagina "Chi Siamo" con storia del ristorante |
| `menu.html` | Vetrina del menù con selezioni premium |
| `ordini.html` | Ordini online con carrello interattivo e modal checkout |
| `prenotazioni.html` | Form prenotazione tavolo con conferma visiva |

**Funzionalità frontend notevoli:**
- Carrello ordini dinamico con calcolo automatico del totale e costi di servizio
- Modal checkout con invio dati tramite Fetch API
- Sistema di recensioni persistente via `localStorage`
- Animazioni CSS (floating, infinite scroll, fade-in)
- Menu mobile hamburger con animazione
- Carosello automatico con navigazione a punti

### 🔐 Pannello di Amministrazione (`/admin`)

| Sezione | Descrizione |
|---|---|
| **Dashboard** | KPI in tempo reale: ordini, incassi, piatti attivi, prenotazioni |
| **Gestione Menù** | CRUD completo piatti con Soft Delete, ripristino e azioni di massa |
| **Prenotazioni** | Visualizzazione, archivio e gestione bulk delle prenotazioni |
| **Cedolini** | Archivio buste paga con upload e gestione soft/hard delete |
| **Ferie & Permessi** | Approvazione/rifiuto richieste del personale |
| **Malattia** | Gestione pratiche con codice protocollo INPS |

**Funzionalità admin notevoli:**
- Autenticazione client-side (credenziali demo: `admin` / `admin123`)
- Sidebar dinamica generata via JavaScript con stato attivo automatico
- Soft Delete + Ripristino su tutte le entità
- Azioni di massa (bulk actions) su menù e prenotazioni
- Modal informativi con SweetAlert2
- Rilevamento automatico ambiente MAMP / XAMPP

---

## 📁 Struttura del Progetto

```
2026-ITS-15.1-ROSSO-RISTORANTE/
├── index.html                  # Homepage pubblica
├── chi-siamo.html
├── menu.html
├── ordini.html
├── prenotazioni.html
│
├── css/
│   └── style.css               # Stili sito pubblico
├── js/
│   └── main.js                 # Logica sito pubblico
├── img/
│   └── hero-bistecca.jpg / hero-bistecca2.jpg
│
├── admin/                      # Pannello di amministrazione
│   ├── login.html
│   ├── dashboard.html
│   ├── menu.html
│   ├── prenotazioni.html
│   ├── cedolini.html
│   ├── ferie-permessi.html
│   ├── malattia.html
│   ├── style.css               # Stili tema admin (slate & gold)
│   └── js/
│       ├── main.js             # Configurazione URL backend
│       ├── sidebar.js          # Sidebar dinamica
│       ├── dashboard.js
│       ├── menu.js
│       ├── prenotazioni.js
│       ├── cedolini.js
│       ├── ferie-permessi.js
│       └── malattia.js
│
├── backend/                    # API PHP
│   ├── db.php                  # Connessione PDO con auto-detect MAMP/XAMPP
│   ├── salva_prenotazione.php
│   ├── salva_ordine.php
│   └── admin/
│       ├── DashboardController.php
│       ├── MenuController.php
│       ├── PrenotazioniController.php
│       ├── FerieController.php
│       ├── MalattiaController.php
│       └── CedoliniController.php
│
├── tests/                      # Suite di test Node.js
│   ├── run_all.js
│   ├── test.js
│   ├── config.js
│   ├── admin_dashboard.js
│   ├── admin_menu.js
│   ├── admin_prenotazioni.js
│   ├── admin_personale.js
│   ├── client_prenotazioni.js
│   └── client_ordini.js
│
├── dump_steakhouse_db.sql       # Dump del database
└── package.json
```

---

## 🛠 Stack Tecnologico

**Frontend — Sito Pubblico**
- HTML5 / CSS3
- [Tailwind CSS](https://tailwindcss.com/) (via CDN)
- JavaScript ES6+ (Vanilla)
- Google Fonts: Playfair Display, Lato

**Frontend — Pannello Admin**
- [AdminLTE 3.2](https://adminlte.io/)
- Bootstrap 4.6
- jQuery 3.6
- [SweetAlert2](https://sweetalert2.github.io/)
- Font Awesome 5

**Backend**
- PHP 8+ con PDO
- MySQL / MariaDB

**Testing**
- Node.js (ES Modules)
- Fetch API nativa

---

## ⚙️ Prerequisiti e Installazione

### Requisiti

- **XAMPP** o **MAMP** (PHP 8+, MySQL/MariaDB)
- **Node.js** v18+ (solo per eseguire i test)
- Browser moderno

### Installazione

**1. Clona il repository nella cartella del server locale:**

```bash
# Per XAMPP (Windows/Linux)
git clone https://github.com/tuo-utente/2026-ITS-15.1-ROSSO-RISTORANTE.git /path/to/xampp/htdocs/2026-ITS-15.1-ROSSO-RISTORANTE

# Per MAMP (macOS)
git clone https://github.com/tuo-utente/2026-ITS-15.1-ROSSO-RISTORANTE.git /Applications/MAMP/htdocs/2026-ITS-15.1-ROSSO-RISTORANTE
```

**2. Avvia il server:**

Avvia Apache e MySQL tramite il pannello di controllo XAMPP o MAMP.

**3. Apri il sito:**

```
http://localhost/2026-ITS-15.1-ROSSO-RISTORANTE/index.html
```

> **MAMP** usa di default la porta `8888`:
> `http://localhost:8888/2026-ITS-15.1-ROSSO-RISTORANTE/index.html`
>
> Il file `db.php` rileva automaticamente l'ambiente (MAMP porta `8889` / XAMPP porta `3306`).

---

## 🗄 Configurazione del Database

**1. Apri phpMyAdmin:**
- XAMPP: `http://localhost/phpmyadmin`
- MAMP: `http://localhost:8888/phpMyAdmin`

**2. Crea il database:**

```sql
CREATE DATABASE steakhouse_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

**3. Importa il dump:**

Seleziona il database `steakhouse_db` → scheda **Importa** → carica il file `dump_steakhouse_db.sql`.

**Oppure da terminale:**

```bash
mysql -u root -p steakhouse_db < dump_steakhouse_db.sql
```

### Credenziali di default

| Ambiente | Host | Porta | Utente | Password |
|---|---|---|---|---|
| XAMPP | `127.0.0.1` | `3306` | `root` | *(vuota)* |
| MAMP | `127.0.0.1` | `8889` | `root` | `root` |

---

## 🔐 Accesso all'Area Admin

Navigare su:
```
http://localhost/2026-ITS-15.1-ROSSO-RISTORANTE/admin/login.html
```

| Campo | Valore |
|---|---|
| Username | `admin` |
| Password | `admin123` |

> ⚠️ L'autenticazione è implementata lato client a scopo dimostrativo. In produzione andrebbe sostituita con autenticazione server-side sicura con gestione delle sessioni PHP.

---

## 🧪 Suite di Test

Il progetto include una suite di test di integrazione eseguibile da terminale tramite Node.js, che verifica tutti gli endpoint del backend.

**Installazione dipendenze:**

```bash
npm install
```

**Esecuzione:**

```bash
npm test
```

Oppure direttamente:

```bash
node tests/run_all.js
```

**Componenti testati:**

| Test | Endpoint verificato |
|---|---|
| Prenotazioni client | `POST /backend/salva_prenotazione.php` |
| Ordini client | `POST /backend/salva_ordine.php` |
| Dashboard admin | `GET /backend/admin/DashboardController.php` |
| Menu admin | `GET + POST /backend/admin/MenuController.php` |
| Prenotazioni admin | `GET /backend/admin/PrenotazioniController.php` |
| Personale (Ferie) | `GET /backend/admin/FerieController.php` |
| Personale (Malattia) | `GET /backend/admin/MalattiaController.php` |
| Personale (Cedolini) | `GET /backend/admin/CedoliniController.php` |

> I test rilevano automaticamente se il server gira su MAMP (porta 8888) o XAMPP (porta 80).

---

## 🗂 Struttura del Database

Le tabelle principali del database `steakhouse_db`:

| Tabella | Descrizione |
|---|---|
| `menu` | Piatti del menù con nome, categoria, prezzo, disponibilità e soft delete |
| `ordini` | Ordini online con dettaglio carrello, indirizzo e totale |
| `prenotazioni` | Prenotazioni tavolo con dati cliente, data, ora e coperti |
| `richieste_ferie` | Richieste ferie/permessi del personale con stato di approvazione |
| `richieste_malattia` | Pratiche di malattia con codice protocollo INPS |
| `richieste_cedolini` | Registro buste paga con periodo e importo netto |

Tutte le tabelle (eccetto `ordini`) supportano il **Soft Delete** tramite la colonna `deleted_at`.

---

## 👥 Autori

Progetto sviluppato nell'ambito del corso **ITS 2026** — Gruppo 15.1 ROSSO.

---

## 📄 Licenza

Questo progetto è realizzato a scopo didattico. Tutti i diritti riservati © 2026.
