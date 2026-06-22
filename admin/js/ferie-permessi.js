$(document).ready(function () {
    const CONTROLLER_FERIE = '../backend/admin/FerieController.php';
    caricaRichiesteFerie();

    async function caricaRichiesteFerie() {
        const tbody = $("#tabella-ferie");
        if (!tbody.length) return;
        tbody.empty();

        try {
            const response = await fetch(`${CONTROLLER_FERIE}?action=index`);
            const dati = await response.json();

            if (dati.length === 0) {
                tbody.append('<tr><td colspan="7" class="text-center text-muted py-4">Nessuna richiesta presente</td></tr>');
                return;
            }

            dati.forEach(f => {
                // Controllo Soft Delete (esattamente come cedolini.js)
                const isDeleted = f.deleted_at !== null;

                let badgeStato = `<span class="badge badge-warning">In attesa</span>`;
                if (f.stato === 'approvato') badgeStato = `<span class="badge badge-success">Approvato</span>`;
                if (f.stato === 'rifiutato') badgeStato = `<span class="badge badge-danger">Rifiutato</span>`;

                // Disabilita Approva/Rifiuta se già gestito o se archiviato
                const isDisabilitato = (f.stato !== 'in_attesa' || isDeleted) ? 'disabled' : '';

                // Logica del bottone azione speculare a cedolini.js
                let bottoneAzione = '';
                if (isDeleted) {
                    bottoneAzione = `
                        <button class="btn btn-warning btn-sm mx-1 text-white" onclick="ripristinaRichiestaFerie(${f.id})" title="Ripristina">
                            <i class="fas fa-undo"></i>
                        </button>
                    `;
                } else {
                    bottoneAzione = `
                        <button class="btn btn-danger btn-sm mx-1" onclick="eliminaRichiestaFerie(${f.id})" title="Elimina">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                }

                tbody.append(`
                    <tr style="${isDeleted ? 'opacity: 0.5; background-color: rgba(255,255,255,0.02);' : ''}">
                        <td class="align-middle font-weight-bold">${f.dipendente} ${isDeleted ? '<small class="text-warning">(Archiviato)</small>' : ''}</td>
                        <td class="align-middle"><span class="badge bg-secondary">${f.tipo}</span></td>
                        <td class="align-middle">${f.data_inizio}</td>
                        <td class="align-middle">${f.data_fine}</td>
                        <td class="align-middle"><em>${f.note || ''}</em></td>
                        <td class="align-middle text-center">${badgeStato}</td>
                        <td class="align-middle text-center">
                            <button class="btn btn-success btn-sm mr-1" ${isDisabilitato} onclick="aggiornaStatoFerie(${f.id}, 'approvato')">
                                <i class="fas fa-check"></i>
                            </button>
                            <button class="btn btn-secondary btn-sm mr-1" ${isDisabilitato} onclick="aggiornaStatoFerie(${f.id}, 'rifiutato')">
                                <i class="fas fa-times"></i>
                            </button>
                            ${bottoneAzione}
                        </td>
                    </tr>
                `);
            });
        } catch (error) {
            tbody.append('<tr><td colspan="7" class="text-center text-danger py-4">Errore nel caricamento dei dati</td></tr>');
        }
    }

    window.aggiornaStatoFerie = function(id, stato) {
        Swal.fire({
            title: `Vuoi contrassegnare come ${stato}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sì, conferma',
            cancelButtonText: 'Annulla',
            background: '#141414',
            color: '#fff'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const formData = new FormData();
                formData.append('id', id);
                formData.append('stato', stato);
                try {
                    const response = await fetch(`${CONTROLLER_FERIE}?action=update_stato`, { method: 'POST', body: formData });
                    const risultato = await response.json();
                    if (risultato.status === 'success') {
                        Swal.fire({ title: 'Fatto!', text: risultato.message, icon: 'success', background: '#141414', color: '#fff' });
                        caricaRichiesteFerie();
                    } else { Swal.fire('Errore', risultato.message, 'error'); }
                } catch (error) { Swal.fire('Errore', 'Connessione fallita', 'error'); }
            }
        });
    };

        window.eliminaRichiestaFerie = function(id) {
        Swal.fire({
            title: 'Come vuoi eliminare la richiesta?',
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
            formData.append('type', tipoEliminazione); // Invia 'soft' o 'hard' al backend

            try {
                const response = await fetch(`${CONTROLLER_FERIE}?action=destroy`, {
                    method: 'POST',
                    body: formData
                });
                const risultato = await response.json();

                if (risultato.status === 'success') {
                    Swal.fire({ 
                        title: 'Operazione completata!', 
                        text: risultato.message, 
                        icon: 'success', 
                        background: '#141414', 
                        color: '#fff' 
                    });
                    caricaRichiesteFerie(); // Ricarica la tabella delle ferie
                } else {
                    Swal.fire({ title: 'Errore', text: risultato.message, icon: 'error', background: '#141414', color: '#fff' });
                }
            } catch (error) {
                Swal.fire({ title: 'Errore', text: "Impossibile connettersi al server.", icon: 'error', background: '#141414', color: '#fff' });
            }
        });
    };

    window.ripristinaRichiestaFerie = function(id) {
        const formData = new FormData();
        formData.append('id', id);

        try {
            Swal.fire({
                title: 'Sei sicuro di voler ripristinare?',
                text: "La richiesta tornerà attiva a tutti gli effetti.",
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
                    const response = await fetch(`${CONTROLLER_FERIE}?action=restore`, {
                        method: 'POST',
                        body: formData
                    });
                    const risultato = await response.json();

                    if (risultato.status === 'success') {
                        Swal.fire({ 
                            title: 'Ripristinata!', 
                            text: risultato.message, 
                            icon: 'success', 
                            background: '#141414', 
                            color: '#fff' 
                        });
                        caricaRichiesteFerie();
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
