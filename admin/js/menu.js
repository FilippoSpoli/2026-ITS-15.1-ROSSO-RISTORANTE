const CONTROLLER_URL = '../backend/admin/MenuController.php';
let piattiMenu = [];

// 1. READ (Index)
async function caricaPiattiMenu() {
    try {
        const response = await fetch(`${CONTROLLER_URL}?action=index`);
        if (!response.ok) throw new Error("Errore nel caricamento del menù");
        piattiMenu = await response.json();
        renderTabellaMenu();
    } catch (error) {
        console.error(error);
    }
}

function renderTabellaMenu() {
    const tbody = document.getElementById('corpo-tabella-menu');
    if (!tbody) return;
    tbody.innerHTML = '';
    
    const masterCb = document.getElementById('seleziona-tutti-menu');
    if (masterCb) masterCb.checked = false;

    piattiMenu.forEach(piatto => {
        const fotoSrc = piatto.foto ? piatto.foto : 'https://placehold.co/100x100/141414/C5A059?text=Steak';
        
        let badge = parseInt(piatto.disponibile) === 1 
            ? '<span class="badge badge-success">Attivo</span>' 
            : '<span class="badge badge-secondary">Sospeso</span>';

        let bottoneCancellazioneORipristino = '';

        if (piatto.deleted_at) {
            badge = '<span class="badge badge-danger">Archiviato</span>';
            bottoneCancellazioneORipristino = `
                <button class="btn btn-success btn-sm" onclick="ripristinaPiatto(${piatto.id})" title="Ripristina Piatto">
                    <i class="fas fa-undo"></i>
                </button>
            `;
        } else {
            bottoneCancellazioneORipristino = `
                <button class="btn btn-danger btn-sm" onclick="eliminaPiatto(${piatto.id})" title="Elimina">
                    <i class="fas fa-trash"></i>
                </button>
            `;
        }

        tbody.innerHTML += `
            <tr>
                <td class="text-center align-middle">
                    <input type="checkbox" class="cb-piatto" value="${piatto.id}">
                </td>
                <td><img src="${fotoSrc}" class="img-anteprima" onerror="this.src='https://placehold.co/100x100/141414/C5A059?text=Steak'"></td>
                <td class="align-middle font-weight-bold">${piatto.nome}</td>
                <td class="align-middle">${piatto.categoria}</td>
                <td class="align-middle text-success font-weight-bold">${window.formattaEuro(piatto.prezzo)}</td>
                <td class="align-middle text-center">${badge}</td>
                <td class="align-middle text-right">
                    <div class="d-flex justify-content-end align-items-center">
                        <button class="btn btn-info btn-sm mr-1" onclick="mostraDettagliPiatto(${piatto.id})" title="Visualizza dettagli">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-warning btn-sm mr-1" onclick="apriModalPiatto(${piatto.id})" title="Modifica">
                            <i class="fas fa-pencil-alt text-dark"></i>
                        </button>
                        ${bottoneCancellazioneORipristino}
                    </div>
                </td>
            </tr>
        `;
    });
}

window.toggleTuttiMenu = function(master) {
    const checkboxes = document.querySelectorAll('.cb-piatto');
    checkboxes.forEach(cb => cb.checked = master.checked);
};

window.eseguiAzioneMassaMenu = async function() {
    const azione = document.getElementById('bulk-action-menu').value;
    if (!azione) {
        Swal.fire('Attenzione', 'Seleziona un\'azione di gruppo', 'warning');
        return;
    }

    const selezionati = Array.from(document.querySelectorAll('.cb-piatto:checked')).map(cb => cb.value);
    if (selezionati.length === 0) {
        Swal.fire('Attenzione', 'Nessun piatto selezionato', 'warning');
        return;
    }

    Swal.fire({
        title: 'Confermi l\'azione di massa?',
        text: `Stai per applicare l'azione su ${selezionati.length} piatti.`,
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
            const response = await fetch(`${CONTROLLER_URL}?action=bulk`, {
                method: 'POST',
                body: formData
            });
            const risultato = await response.json();

            if (risultato.status === 'success') {
                Swal.fire({ title: 'Completato', text: risultato.message, icon: 'success', background: '#141414', color: '#fff' });
                caricaPiattiMenu();
            } else {
                Swal.fire('Errore', risultato.message, 'error');
            }
        } catch (error) {
            Swal.fire('Errore', 'Impossibile completare l\'operazione di massa.', 'error');
        }
    });
};

window.mostraDettagliPiatto = function(id) {
    const piatto = piattiMenu.find(p => p.id === id);
    if (!piatto) return;

    document.getElementById('info-nome').innerText = piatto.nome;
    document.getElementById('info-categoria').innerText = piatto.categoria;
    document.getElementById('info-prezzo').innerText = window.formattaEuro(piatto.prezzo);
    document.getElementById('info-stato').innerHTML = parseInt(piatto.disponibile) === 1 
        ? '<span class="badge badge-success">Attivo / Disponibile</span>' 
        : '<span class="badge badge-secondary">Sospeso / Non disponibile</span>';
    
    const infoFoto = document.getElementById('info-foto');
    infoFoto.src = piatto.foto ? piatto.foto : 'https://placehold.co/150x150/141414/C5A059?text=Steak';

    $('#modalInfoPiatto').modal('show');
};

window.apriModalNuovo = function() {
    document.getElementById('formPiatto').reset();
    document.getElementById('piatto-id').value = '';
    document.getElementById('titoloModal').innerText = 'Nuovo Piatto';
    $('#modalPiatto').modal('show');
};

window.apriModalPiatto = function(id) {
    const piatto = piattiMenu.find(p => p.id === id);
    if (!piatto) return;

    document.getElementById('piatto-id').value = piatto.id;
    document.getElementById('piatto-nome').value = piatto.nome;
    document.getElementById('piatto-categoria').value = piatto.categoria;
    document.getElementById('piatto-prezzo').value = piatto.prezzo;
    document.getElementById('piatto-foto').value = piatto.foto || '';
    document.getElementById('piatto-disponibile').checked = parseInt(piatto.disponibile) === 1;

    document.getElementById('titoloModal').innerText = 'Modifica Piatto';
    $('#modalPiatto').modal('show');
};

window.salvaPiattoModificato = async function(event) {
    event.preventDefault();

    const id = document.getElementById('piatto-id').value;
    const formData = new FormData();
    formData.append('nome', document.getElementById('piatto-nome').value);
    formData.append('categoria', document.getElementById('piatto-categoria').value);
    formData.append('prezzo', document.getElementById('piatto-prezzo').value);
    formData.append('foto', document.getElementById('piatto-foto').value);
    formData.append('disponibile', document.getElementById('piatto-disponibile').checked ? 1 : 0);

    const azione = id ? 'update' : 'store';
    if (id) formData.append('id', id);

    try {
        const response = await fetch(`${CONTROLLER_URL}?action=${azione}`, {
            method: 'POST',
            body: formData
        });
        const risultato = await response.json();

        if (risultato.status === 'success') {
            $('#modalPiatto').modal('hide');
            caricaPiattiMenu();
        } else {
            alert(risultato.message);
        }
    } catch (error) {
        alert("Errore di connessione al controller.");
    }
};

window.eliminaPiatto = function(id) {
    Swal.fire({
        title: 'Come vuoi eliminare questo piatto?',
        text: "Scegli se archiviarlo temporaneamente (Soft) o rimuoverlo per sempre (Definitivo).",
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
            const response = await fetch(`${CONTROLLER_URL}?action=destroy`, {
                method: 'POST',
                body: formData
            });
            const risultato = await response.json();

            if (risultato.status === 'success') {
                Swal.fire({ title: 'Eliminato!', text: risultato.message, icon: 'success', background: '#141414', color: '#fff' });
                caricaPiattiMenu();
            } else {
                Swal.fire('Errore', risultato.message, 'error');
            }
        } catch (error) {
            Swal.fire('Errore', "Impossibile connettersi al server.", 'error');
        }
    });
};

window.ripristinaPiatto = async function(id) {
    const formData = new FormData();
    formData.append('id', id);

    try {
        const response = await fetch(`${CONTROLLER_URL}?action=restore`, {
            method: 'POST',
            body: formData
        });
        const risultato = await response.json();

        if (risultato.status === 'success') {
            Swal.fire({ title: 'Ripristinato!', text: risultato.message, icon: 'success', background: '#141414', color: '#fff' });
            caricaPiattiMenu();
        } else {
            Swal.fire('Errore', risultato.message, 'error');
        }
    } catch (error) {
        Swal.fire('Errore', "Impossibile connettersi al server.", 'error');
    }
};

document.addEventListener('DOMContentLoaded', caricaPiattiMenu);
