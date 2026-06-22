$(document).ready(function () {
    const CONTROLLER_PRENOTAZIONI = '../backend/admin/PrenotazioniController.php';

    caricaPrenotazioni();

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

        try {
            const response = await fetch(`${CONTROLLER_PRENOTAZIONI}?action=index`);
            if (!response.ok) throw new Error("Errore nel recupero dati");
            
            const prenotazioni = await response.json();

            if (prenotazioni.length === 0) {
                tbody.append(`
                    <tr>
                        <td colspan="9" class="text-center text-muted py-4">
                            Nessuna prenotazione trovata nel database
                        </td>
                    </tr>
                `);
                return;
            }

            prenotazioni.forEach(prenotazione => {
                // Determiniamo dinamicamente l'azione se il record è stato archiviato (soft delete)
                let colonnaAzione = '';
                if (prenotazione.deleted_at) {
                    colonnaAzione = `
                        <button class="btn btn-success btn-sm btn-ripristina" data-id="${prenotazione.id}" title="Ripristina">
                            <i class="fas fa-undo"></i>
                        </button>
                    `;
                } else {
                    colonnaAzione = `
                        <button class="btn btn-danger btn-sm btn-elimina" data-id="${prenotazione.id}" title="Elimina">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                }

                tbody.append(`
                    <tr>
                        <td>${prenotazione.id}</td>
                        <td>${prenotazione.nome}</td>
                        <td>${prenotazione.email}</td>
                        <td>${prenotazione.telefono}</td>
                        <td><span class="badge bg-secondary px-2 py-1">${prenotazione.persone} Pax</span></td>
                        <td>${prenotazione.data_prenotazione}</td>
                        <td>${prenotazione.ora_prenotazione}</td>
                        <td>${prenotazione.note || '-'}</td>
                        <td>${colonnaAzione}</td>
                    </tr>
                `);
            });

            // Gestione dei click sui pulsanti generati nella tabella
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
            tbody.append(`<tr><td colspan="9" class="text-center text-danger py-4">Errore di caricamento dati.</td></tr>`);
        }
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
                    Swal.fire({
                        title: 'Operazione completata!',
                        text: risultato.message,
                        icon: 'success',
                        background: '#141414',
                        color: '#fff'
                    });
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
                Swal.fire({
                    title: 'Ripristinata!',
                    text: risultato.message,
                    icon: 'success',
                    background: '#141414',
                    color: '#fff'
                });
                caricaPrenotazioni();
            } else {
                Swal.fire('Errore', risultato.message, 'error');
            }
        } catch (error) {
            Swal.fire('Errore', "Impossibile ripristinare.", 'error');
        }
    }
});
