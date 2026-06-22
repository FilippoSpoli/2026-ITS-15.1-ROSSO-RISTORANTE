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
                tbody.append(`
                    <tr>
                        <td>${prenotazione.id}</td>
                        <td><strong>${prenotazione.nome}</strong></td>
                        <td>${prenotazione.email}</td>
                        <td>${prenotazione.telefono}</td>
                        <td><span class="badge badge-primary">${prenotazione.ospiti}</span></td>
                        <td>${prenotazione.data_prenotazione}</td>
                        <td>${prenotazione.ora_prenotazione}</td>
                        <td>${prenotazione.note || '-'}</td>
                        <td>
                            <button class="btn btn-danger btn-sm btn-elimina" data-id="${prenotazione.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `);
            });

            $(".btn-elimina").off("click").on("click", function() {
                const id = $(this).data("id");
                eliminaPrenotazione(id);
            });

        } catch (error) {
            console.error("Errore:", error);
            tbody.append(`<tr><td colspan="9" class="text-center text-danger py-4">Errore di caricamento dati.</td></tr>`);
        }
    }

    async function eliminaPrenotazione(id) {
        if (!confirm("Eliminare questa prenotazione?")) return;

        const formData = new FormData();
        formData.append('id', id);

        try {
            const response = await fetch(`${CONTROLLER_PRENOTAZIONI}?action=destroy`, {
                method: 'POST',
                body: formData
            });
            const risultato = await response.json();

            if (risultato.status === 'success') {
                caricaPrenotazioni();
            } else {
                alert(risultato.message);
            }
        } catch (error) {
            alert("Errore durante l'eliminazione.");
        }
    }
});
