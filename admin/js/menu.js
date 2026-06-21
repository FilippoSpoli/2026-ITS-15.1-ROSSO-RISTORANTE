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

    piattiMenu.forEach(piatto => {
        const fotoSrc = piatto.foto ? piatto.foto : 'https://placehold.co/100x100/141414/C5A059?text=Steak';
        const badge = parseInt(piatto.disponibile) === 1 
            ? '<span class="badge badge-success">Attivo</span>' 
            : '<span class="badge badge-secondary">Sospeso</span>';

        tbody.innerHTML += `
            <tr>
                <td><img src="${fotoSrc}" class="img-anteprima" onerror="this.src='https://placehold.co/100x100/141414/C5A059?text=Steak'"></td>
                <td class="align-middle font-weight-bold">${piatto.nome}</td>
                <td class="align-middle">${piatto.categoria}</td>
                <td class="align-middle text-success font-weight-bold">${window.formattaEuro(piatto.prezzo)}</td>
                <td class="align-middle text-center">${badge}</td>
                <td class="align-middle text-right">
                    <button class="btn btn-sm btn-info mr-1" onclick="apriModalModifica(${piatto.id})"><i class="fas fa-pencil-alt"></i></button>
                    <button class="btn btn-sm btn-danger" onclick="eliminaPiatto(${piatto.id})"><i class="fas fa-trash"></i></button>
                </td>
            </tr>
        `;
    });
}

// Modali e interazioni di inserimento/modifica
window.apriModalNuovo = function() {
    document.getElementById('formPiatto').reset();
    document.getElementById('piatto-id').value = '';
    document.getElementById('titoloModal').innerText = 'Aggiungi Piatto nel DB';
    $('#modalPiatto').modal('show');
};

window.apriModalModifica = function(id) {
    const p = piattiMenu.find(item => item.id == id);
    if (!p) return;

    document.getElementById('piatto-id').value = p.id;
    document.getElementById('piatto-nome').value = p.nome;
    document.getElementById('piatto-categoria').value = p.categoria;
    document.getElementById('piatto-prezzo').value = p.prezzo;
    document.getElementById('piatto-foto').value = p.foto || '';
    document.getElementById('piatto-disponibile').checked = parseInt(p.disponibile || p.disponible) === 1;

    document.getElementById('titoloModal').innerText = 'Modifica Piatto nel DB';
    $('#modalPiatto').modal('show');
};

window.salvaPiattoModificato = async function(e) {
    e.preventDefault();

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

window.eliminaPiatto = async function(id) {
    if (!confirm("Sei sicuro di voler eliminare questo piatto dal database?")) return;

    const formData = new FormData();
    formData.append('id', id);

    try {
        const response = await fetch(`${CONTROLLER_URL}?action=destroy`, {
            method: 'POST',
            body: formData
        });
        const risultato = await response.json();

        if (risultato.status === 'success') {
            caricaPiattiMenu();
        } else {
            alert(risultato.message);
        }
    } catch (error) {
        alert("Errore durante l'eliminazione.");
    }
};

// Avvio automatico al caricamento della pagina del menù
document.addEventListener('DOMContentLoaded', caricaPiattiMenu);
