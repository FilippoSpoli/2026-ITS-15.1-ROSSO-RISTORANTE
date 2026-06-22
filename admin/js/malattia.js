$(document).ready(function () {
    const CONTROLLER_MALATTIA = '../backend/admin/MalattiaController.php';
    caricaMalattie();

    async function caricaMalattie() {
        const tbody = $("#tabella-malattia");
        if (!tbody.length) return;
        tbody.empty();

        try {
            const response = await fetch(`${CONTROLLER_MALATTIA}?action=index`);
            const dati = await response.json();

            if (dati.length === 0) {
                tbody.append('<tr><td colspan="6" class="text-center text-muted py-4">Nessun record di malattia aperto</td></tr>');
                return;
            }

            dati.forEach(m => {
                // Controllo Soft Delete
                const isDeleted = m.deleted_at !== null;

                let badgeStato = `<span class="badge badge-warning">In attesa</span>`;
                if (m.stato === 'approvato') badgeStato = `<span class="badge badge-success">Presa Visione</span>`;
                if (m.stato === 'rifiutato') badgeStato = `<span class="badge badge-danger">Rifiutata</span>`;

                // MODIFICA QUI: I pulsanti restano sempre attivi per consentire modifiche future,
                // vengono disabilitati solo se la riga è archiviata (isDeleted)
                const isDisabilitato = isDeleted ? 'disabled' : '';

                // Logica del bottone azione speculare a cedolini.js
                let bottoneAzione = '';
                if (isDeleted) {
                    bottoneAzione = `
                        <button class="btn btn-warning btn-sm mx-1 text-white" onclick="ripristinaMalattia(${m.id})" title="Ripristina">
                            <i class="fas fa-undo"></i>
                        </button>
                    `;
                } else {
                    bottoneAzione = `
                        <button class="btn btn-danger btn-sm mx-1" onclick="eliminaMalattia(${m.id})" title="Elimina">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                }

                tbody.append(`
                    <tr style="${isDeleted ? 'opacity: 0.5; background-color: rgba(255,255,255,0.02);' : ''}">
                        <td class="align-middle font-weight-bold">${m.dipendente} ${isDeleted ? '<small class="text-warning">(Archiviato)</small>' : ''}</td>
                        <td class="align-middle"><code class="text-warning">${m.codice_inps}</code></td>
                        <td class="align-middle">${m.data_inizio}</td>
                        <td class="align-middle">${m.data_fine}</td>
                        <td class="align-middle text-center">${badgeStato}</td>
                        <td class="align-middle text-center">
                            <button class="btn btn-success btn-sm mr-1" ${isDisabilitato} onclick="cambiaStatoMalattia(${m.id}, 'approvato')" title="Approva / Presa Visione">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-secondary btn-sm mr-1" ${isDisabilitato} onclick="cambiaStatoMalattia(${m.id}, 'rifiutato')" title="Rifiuta / Torna indietro">
                                <i class="fas fa-ban"></i>
                            </button>
                            ${bottoneAzione}
                        </td>
                    </tr>
                `);
            });
        } catch (e) {
            tbody.append('<tr><td colspan="6" class="text-center text-danger py-4">Errore nel caricamento dei dati</td></tr>');
        }
    }

    window.cambiaStatoMalattia = function(id, stato) {
        Swal.fire({
            title: 'Aggiornare lo stato della pratica?',
            text: `Stai impostando lo stato su: ${stato === 'approvato' ? 'Presa Visione' : 'Rifiutata'}`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sì, procedi',
            cancelButtonText: 'Annulla',
            background: '#141414',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('id', id);
                formData.append('stato', stato);
                try {
                    const response = await fetch(`${CONTROLLER_MALATTIA}?action=update_stato`, { method: 'POST', body: formData });
                    const res = await response.json();
                    if (res.status === 'success') {
                        Swal.fire({ title: 'Fatto!', text: res.message, icon: 'success', background: '#141414', color: '#fff' });
                        caricaMalattie();
                    }
                } catch (e) { Swal.fire('Errore', 'Errore di connessione', 'error'); }
            }
        });
    };

    window.eliminaMalattia = function(id) {
        Swal.fire({
            title: 'Come vuoi eliminare la pratica?',
            text: "Scegli se archiviarla (Soft) o rimuoverla completamente (Definitivo).",
            icon: 'warning',
            showCancelButton: true,
            showDenyButton: true,
            confirmButtonColor: '#3085d6',
            denyButtonColor: '#d33',
            cancelButtonColor: '#6c757d',
            confirmButtonText: '<i class="fas fa-archive"></i> Soft Delete (Archivia)',
            denyButtonText: '<i class="fas fa-trash-alt"></i> Delete Definitivo',
            cancelButtonText: 'Annulla',
            background: '#141414',
            color: '#fff'
        }).then(async (result) => {
            let tipoEliminazione = '';
            
            if (result.isConfirmed) {
                tipoEliminazione = 'soft';
            } else if (result.isDenied) {
                tipoEliminazione = 'hard';
            } else {
                return;
            }

            const formData = new FormData();
            formData.append('id', id);
            formData.append('type', tipoEliminazione);

            try {
                const response = await fetch(`${CONTROLLER_MALATTIA}?action=destroy`, {
                    method: 'POST',
                    body: formData
                });
                const risultato = await response.json();

                if (risultato.status === 'success') {
                    Swal.fire({ title: 'Operazione completata!', text: risultato.message, icon: 'success', background: '#141414', color: '#fff' });
                    caricaMalattie();
                } else {
                    Swal.fire({ title: 'Errore', text: risultato.message, icon: 'error', background: '#141414', color: '#fff' });
                }
            } catch (error) {
                Swal.fire({ title: 'Errore', text: "Impossibile connettersi al server.", icon: 'error', background: '#141414', color: '#fff' });
            }
        });
    };

    window.ripristinaMalattia = function(id) {
        const formData = new FormData();
        formData.append('id', id);

        try {
            Swal.fire({
                title: 'Sei sicuro di voler ripristinare?',
                text: "La pratica tornerà attiva a tutti gli effetti.",
                icon: 'question',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#6c757d',
                confirmButtonText: 'Sì, ripristina',
                cancelButtonText: 'Annulla',
                background: '#141414',
                color: '#fff'
            }).then(async (result) => {
                if (result.isConfirmed) {
                    const response = await fetch(`${CONTROLLER_MALATTIA}?action=restore`, {
                        method: 'POST',
                        body: formData
                    });
                    const risultato = await response.json();

                    if (risultato.status === 'success') {
                        Swal.fire({ title: 'Ripristinata!', text: risultato.message, icon: 'success', background: '#141414', color: '#fff' });
                        caricaMalattie();
                    } else {
                        Swal.fire({ title: 'Errore', text: risultato.message, icon: 'error', background: '#141414', color: '#fff' });
                    }
                }
            });
        } catch (error) {
            Swal.fire({ title: 'Errore', text: "Impossibile ripristinare.", icon: 'error', background: '#141414', color: '#fff' });
        }
    };
});
