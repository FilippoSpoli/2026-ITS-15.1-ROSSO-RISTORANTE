$(document).ready(function () {
    const CONTROLLER_CEDOLINI = '../backend/admin/CedoliniController.php';
    caricaCedolini();

    async function caricaCedolini() {
        const tbody = $("#tabella-cedolini");
        if (!tbody.length) return;
        tbody.empty();

        try {
            const response = await fetch(`${CONTROLLER_CEDOLINI}?action=index`);
            const cedolini = await response.json();

            if (cedolini.length === 0) {
                tbody.append('<tr><td colspan="6" class="text-center text-muted py-4">Nessun cedolino presente</td></tr>');
                return;
            }

            cedolini.forEach(c => {
                // Controlla se il record è nello stato Soft Delete
                const isDeleted = c.deleted_at !== null;
                
                // Genera dinamicamente il pulsante corretto
                let bottoneAzione = '';
                if (isDeleted) {
                    // Se è archiviato (soft deleted), mostra il pulsante di Ripristino
                    bottoneAzione = `
                        <button class="btn btn-warning btn-sm mx-1 text-white" onclick="ripristinaCedolino(${c.id})" title="Ripristina">
                            <i class="fas fa-undo"></i>
                        </button>
                    `;
                } else {
                    // Se è attivo, mostra il pulsante di Eliminazione/Archiviazione
                    bottoneAzione = `
                        <button class="btn btn-danger btn-sm mx-1" onclick="eliminaCedolino(${c.id})" title="Elimina">
                            <i class="fas fa-trash"></i>
                        </button>
                    `;
                }

                tbody.append(`
                    <tr style="${isDeleted ? 'opacity: 0.6; background-color: rgba(255,255,255,0.05);' : ''}">
                        <td class="align-middle font-weight-bold">${c.dipendente} ${isDeleted ? '<small class="text-warning">(Archiviato)</small>' : ''}</td>
                        <td class="align-middle">${c.periodo}</td>
                        <td class="align-middle">${c.data_emissione}</td>
                        <td class="align-middle text-success font-weight-bold">€ ${parseFloat(c.netto).toFixed(2)}</td>
                        <td class="align-middle text-center">
                            <span class="badge ${isDeleted ? 'badge-secondary' : 'badge-success'}">
                                ${isDeleted ? 'Archiviato' : 'Inviato'}
                            </span>
                        </td>
                        <td class="align-middle text-center">
                            <button class="btn btn-info btn-sm mx-1" onclick="downloadCedolino(${c.id})" title="Download">
                                <i class="fas fa-download"></i>
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

    // MODALE ELIMINA - Esatta replica a 3 pulsanti di prenotazioni.js
    window.eliminaCedolino = function(id) {
        Swal.fire({
            title: 'Come vuoi eliminare il cedolino?',
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
                const response = await fetch(`${CONTROLLER_CEDOLINI}?action=destroy`, {
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
                    caricaCedolini();
                } else {
                    Swal.fire({ title: 'Errore', text: risultato.message, icon: 'error', background: '#141414', color: '#fff' });
                }
            } catch (error) {
                Swal.fire({ title: 'Errore', text: "Impossibile connettersi al server.", icon: 'error', background: '#141414', color: '#fff' });
            }
        });
    };

    // MODALE RIPRISTINA - Esatta replica di prenotazioni.js
    window.ripristinaCedolino = function(id) {
        const formData = new FormData();
        formData.append('id', id);

        try {
            Swal.fire({
                title: 'Sei sicuro di voler ripristinare?',
                text: "Il cedolino tornerà attivo a tutti gli effetti.",
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
                    const response = await fetch(`${CONTROLLER_CEDOLINI}?action=restore`, {
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
                        caricaCedolini();
                    } else {
                        Swal.fire({ title: 'Errore', text: risultato.message, icon: 'error', background: '#141414', color: '#fff' });
                    }
                }
            });
        } catch (error) {
            Swal.fire({ title: 'Errore', text: "Impossibile ripristinare.", icon: 'error', background: '#141414', color: '#fff' });
        }
    };

    window.caricaNuovoCedolino = function() {
        Swal.fire({ title: 'Carica Cedolino', text: 'Funzionalità di upload file PDF', icon: 'info', background: '#141414', color: '#fff' });
    };

    window.downloadCedolino = function(id) {
        Swal.fire({ title: 'Download...', text: 'Download del file in corso...', icon: 'success', background: '#141414', color: '#fff' });
    };
});
