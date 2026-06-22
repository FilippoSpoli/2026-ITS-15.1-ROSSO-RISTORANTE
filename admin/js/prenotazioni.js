$(document).ready(function () {
    const CONTROLLER_PRENOTAZIONI = '../backend/admin/PrenotazioniController.php';
    let elencoPrenotazioni = []; // Array globale per salvare lo stato locale delle prenotazioni

    caricaPrenotazioni();

    // Listener per Seleziona/Deseleziona tutte le checkbox
    $(document).on("change", "#seleziona-tutti-prenotazioni", function() {
        $(".cb-prenotazione").prop("checked", this.checked);
    });

    // Applicazione Azione Massiva
    $("#btnApplicaBulkPrenotazioni").on("click", function() {
        const azione = $("#bulk-action-prenotazioni").val();
        if (!azione) {
            Swal.fire('Attenzione', 'Seleziona un\'azione di gruppo', 'warning');
            return;
        }

        const selezionati = $(".cb-prenotazione:checked").map(function() {
            return $(this).val();
        }).get();

        if (selezionati.length === 0) {
            Swal.fire('Attenzione', 'Nessuna prenotazione selezionata', 'warning');
            return;
        }

        Swal.fire({
            title: 'Confermi l\'azione di gruppo?',
            text: `Stai per modificare ${selezionati.length} prenotazioni contemporaneamente.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sì, procedi',
            cancelButtonText: 'Annulla',
            background: '#141414',
            color: '#fff'
        }).then(async (result) => {
            if (!result.isConfirmed) return;

            const formData = new FormData();
            formData.append('ids', JSON.stringify(selezionati));
            formData.append('type', azione);

            try {
                const response = await fetch(`${CONTROLLER_PRENOTAZIONI}?action=bulk`, {
                    method: 'POST',
                    body: formData
                });
                const risultato = await response.json();

                if (risultato.status === 'success') {
                    Swal.fire({ title: 'Fatto!', text: risultato.message, icon: 'success', background: '#141414', color: '#fff' });
                    caricaPrenotazioni();
                } else {
                    Swal.fire('Errore', risultato.message, 'error');
                }
            } catch (error) {
                Swal.fire('Errore', 'Connessione al server fallita.', 'error');
            }
        });
    });

    $("#btnSvuota").on("click", async function () {
        if (confirm("Vuoi eliminare TUTTE le prenotazioni dal database?")) {
            try {
                const response = await fetch(`${CONTROLLER_PRENOTAZIONI}?action=svuota`, { method: 'POST' });
                const risultato = await response.json();
                if (risultato.status === 'success') {
                    caricaPrenotazioni();
                } else {
                    alert(risultato.message);
                }
            } catch (error) {
                alert("Errore durante lo svuotamento.");
            }
        }
    });

    async function caricaPrenotazioni() {
        const tbody = $("#tabellaPrenotazioni");
        if (!tbody.length) return;
        
        tbody.empty();
        $("#seleziona-tutti-prenotazioni").prop("checked", false);

        try {
            const response = await fetch(`${CONTROLLER_PRENOTAZIONI}?action=index`);
            if (!response.ok) throw new Error("Errore nel recupero dati");
            
            elencoPrenotazioni = await response.json();

            if (elencoPrenotazioni.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="10" class="text-center text-muted py-4">
                            Nessuna prenotazione trovata nel database
                        </td>
                    </tr>
                `);
                return;
            }

            elencoPrenotazioni.forEach(prenotazione => {
                let bottoneCancellazioneORipristino = '';
                if (prenotazione.deleted_at) {
                    bottoneCancellazioneORipristino = `
                        <button class="btn btn-success btn-sm btn-ripristina" data-id="${prenotazione.id}" title="Ripristina">
                            <i class="fas fa-undo"></i>
                        </button>
                    `;
                } else {
                    bottoneCancellazioneORipristino = `
                        <button class="btn btn-danger btn-sm btn-elimina" data-id="${prenotazione.id}" title="Elimina">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                }

                tbody.append(`
                    <tr>
                        <td class="text-center align-middle">
                            <input type="checkbox" class="cb-prenotazione" value="${prenotazione.id}">
                        </td>
                        <td>${prenotazione.id}</td>
                        <td>${prenotazione.nome}</td>
                        <td>${prenotazione.email}</td>
                        <td>${prenotazione.telefono}</td>
                        <td><span class="badge bg-secondary px-2 py-1">${prenotazione.persone} Pax</span></td>
                        <td>${prenotazione.data_prenotazione}</td>
                        <td>${prenotazione.ora_prenotazione}</td>
                        <td>${prenotazione.note || '-'}</td>
                        <td class="align-middle text-center">
                            <div class="d-flex justify-content-center align-items-center">
                                <button class="btn btn-info btn-sm mr-1 btn-visualizza" data-id="${prenotazione.id}" title="Visualizza dettagli">
                                    <i class="fas fa-eye"></i>
                                </button>
                                ${bottoneCancellazioneORipristino}
                            </div>
                        </td>
                    </tr>
                `);
            });

            // Gestione dei click sui pulsanti generati nella tabella
            $(".btn-visualizza").off("click").on("click", function() {
                const id = $(this).data("id");
                mostraDettagliPrenotazione(id);
            });

            $(".btn-elimina").off("click").on("click", function() {
                const id = $(this).data("id");
                eliminaPrenotazione(id);
            });

            $(".btn-ripristina").off("click").on("click", function() {
                const id = $(this).data("id");
                ripristinaPrenotazione(id);
            });

        } catch (error) {
            console.error("Errore:", error);
            tbody.append(`<tr><td colspan="10" class="text-center text-danger py-4">Errore di caricamento dati.</td></tr>`);
        }
    }

    // Funzione per mostrare il Modal dei dettagli della prenotazione
    function mostraDettagliPrenotazione(id) {
        const prenotazione = elencoPrenotazioni.find(p => p.id == id);
        if (!prenotazione) return;

        $("#info-p-id").text("#" + prenotazione.id);
        $("#info-p-nome").text(prenotazione.nome);
        $("#info-p-email").text(prenotazione.email);
        $("#info-p-telefono").text(prenotazione.telefono || 'Non fornito');
        $("#info-p-persone").html(`<span class="badge bg-secondary px-2 py-1">${prenotazione.persone} Persone</span>`);
        $("#info-p-quando").text(`${prenotazione.data_prenotazione} alle ore ${prenotazione.ora_prenotazione}`);
        $("#info-p-note").text(prenotazione.note ? `"${prenotazione.note}"` : 'Nessuna nota aggiuntiva');

        $('#modalInfoPrenotazione').modal('show');
    }

    async function eliminaPrenotazione(id) {
        Swal.fire({
            title: 'Come vuoi eliminare la prenotazione?',
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
                const response = await fetch(`${CONTROLLER_PRENOTAZIONI}?action=destroy`, {
                    method: 'POST',
                    body: formData
                });
                const risultato = await response.json();

                if (risultato.status === 'success') {
                    Swal.fire({ title: 'Operazione completata!', text: risultato.message, icon: 'success', background: '#141414', color: '#fff' });
                    caricaPrenotazioni();
                } else {
                    Swal.fire('Errore', risultato.message, 'error');
                }
            } catch (error) {
                Swal.fire('Errore', "Impossibile connettersi al server.", 'error');
            }
        });
    }

    async function ripristinaPrenotazione(id) {
        const formData = new FormData();
        formData.append('id', id);

        try {
            const response = await fetch(`${CONTROLLER_PRENOTAZIONI}?action=restore`, {
                method: 'POST',
                body: formData
            });
            const risultato = await response.json();

            if (risultato.status === 'success') {
                Swal.fire({ title: 'Ripristinata!', text: risultato.message, icon: 'success', background: '#141414', color: '#fff' });
                caricaPrenotazioni();
            } else {
                Swal.fire('Errore', risultato.message, 'error');
            }
        } catch (error) {
            Swal.fire('Errore', "Impossibile ripristinare.", 'error');
        }
    }
});
