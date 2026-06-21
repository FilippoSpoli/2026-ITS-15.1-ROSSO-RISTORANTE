tailwind.config = {
    theme: {
        extend: {
            colors: {
                'sfondo-scuro': '#0a0a0a',
                'sfondo-card': '#141414',
                'oro-accento': '#C5A059',
                'oro-hover': '#e6bf70'
            },
            fontFamily: {
                serif: ['"Playfair Display"', 'serif'],
                sans: ['"Lato"', 'sans-serif']
            }
        }
    }
}

// =====================================
// FUNZIONI GLOBALI (CARRELLO ORDINI)
// =====================================
const COSTO_SERVIZIO = 3.00;

window.aggiungiProdotto = function(selectId) {
    const selectEl = document.getElementById(selectId);
    if (!selectEl) return;
    
    const option = selectEl.options[selectEl.selectedIndex];
    if (option.disabled || option.value === "") return;

    const nomeProdotto = option.value;
    const prezzoProdotto = parseFloat(option.getAttribute('data-price'));
    const itemId = 'item-' + Date.now(); 

    const msgVuoto = document.getElementById('carrello-vuoto');
    if (msgVuoto) msgVuoto.remove();

    const htmlProdotto = `
        <div id="${itemId}" class="flex justify-between items-start text-sm group carrello-elemento" data-price="${prezzoProdotto}" data-name="${nomeProdotto}">
            <div class="flex items-start gap-3">
                <span class="text-oro-accento font-bold border border-oro-accento/50 bg-[#141414] px-2 py-0.5 text-xs rounded mt-0.5">1</span>
                <div>
                    <span class="text-gray-200 block">${nomeProdotto}</span>
                    <button onclick="rimuoviProdotto('${itemId}')" class="text-[10px] text-red-500 hover:text-red-400 uppercase tracking-widest mt-1 opacity-0 group-hover:opacity-100 transition cursor-pointer">Rimuovi</button>
                </div>
            </div>
            <span class="text-white font-medium">€${prezzoProdotto.toFixed(2)}</span>
        </div>
    `;

    const carrelloItems = document.getElementById('carrello-items');
    if (carrelloItems) {
        carrelloItems.insertAdjacentHTML('beforeend', htmlProdotto);
        calcolaTotale();
    }
    selectEl.selectedIndex = 0;
};

window.rimuoviProdotto = function(id) {
    const elemento = document.getElementById(id);
    if (elemento) elemento.remove();
    
    const contenitore = document.getElementById('carrello-items');
    if (contenitore && contenitore.children.length === 0) {
        contenitore.innerHTML = '<p id="carrello-vuoto" class="text-gray-600 text-xs text-center py-10 italic">Nessun prodotto selezionato.</p>';
    }
    calcolaTotale();
};

function calcolaTotale() {
    const elementi = document.querySelectorAll('.carrello-elemento');
    let subTotale = 0;

    elementi.forEach(el => {
        subTotale += parseFloat(el.getAttribute('data-price'));
    });

    const lblSubtotale = document.getElementById('label-subtotale');
    const lblServizio = document.getElementById('label-servizio');
    const lblTotale = document.getElementById('label-totale');

    if (lblSubtotale) lblSubtotale.innerText = '€' + subTotale.toFixed(2);
    
    if (subTotale > 0) {
        if (lblServizio) lblServizio.innerText = '€' + COSTO_SERVIZIO.toFixed(2);
        if (lblTotale) lblTotale.innerText = '€' + (subTotale + COSTO_SERVIZIO).toFixed(2);
    } else {
        if (lblServizio) lblServizio.innerText = '€0.00';
        if (lblTotale) lblTotale.innerText = '€0.00';
    }
}


// =====================================
// INIZIALIZZAZIONE DOM
// =====================================
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Dissolvenza in entrata della pagina
    const contenitore = document.getElementById('contenitore-principale');
    if (contenitore) {
        setTimeout(() => {
            contenitore.classList.remove('opacity-0');
        }, 150);
    }

    // 2. Gestione del Menu Mobile (Hamburger)
    const btnMenu = document.getElementById('menu-btn');
    const menuScorrevole = document.getElementById('mobile-menu');
    const linee = btnMenu ? btnMenu.querySelectorAll('span') : [];

    if (btnMenu && menuScorrevole) {
        btnMenu.addEventListener('click', () => {
            menuScorrevole.classList.toggle('opacity-0');
            menuScorrevole.classList.toggle('pointer-events-none');

            linee[0].classList.toggle('translate-y-2');
            linee[0].classList.toggle('rotate-45');
            linee[1].classList.toggle('opacity-0');
            linee[2].classList.toggle('-translate-y-2');
            linee[2].classList.toggle('-rotate-45');
            
            document.body.classList.toggle('overflow-hidden');
        });
    }

    // 3. Slider Fade ("Scopri la Nostra Storia")
    const fadeImages = document.querySelectorAll('#bg-fade-slider .slide-img');
    if (fadeImages.length > 0) {
        let currentImgIndex = 0;
        setInterval(() => {
            fadeImages[currentImgIndex].classList.remove('opacity-100');
            fadeImages[currentImgIndex].classList.add('opacity-0');
            currentImgIndex = (currentImgIndex + 1) % fadeImages.length;
            fadeImages[currentImgIndex].classList.remove('opacity-0');
            fadeImages[currentImgIndex].classList.add('opacity-100');
        }, 2000);
    }

    // 4. Carosello a schede
    const featureCarousel = document.getElementById('feature-carousel');
    if (featureCarousel) {
        const track = featureCarousel.querySelector('.carousel-track');
        const slides = Array.from(track.children);
        const prevButton = featureCarousel.querySelector('#carousel-prev');
        const nextButton = featureCarousel.querySelector('#carousel-next');
        const dotsNav = featureCarousel.querySelector('#carousel-dots');
        let currentIndex = 0;
        let carouselTimer;

        const updateDots = (index) => {
            const dots = Array.from(dotsNav.children);
            dots.forEach((dot, dotIndex) => {
                dot.classList.toggle('bg-oro-accento', dotIndex === index);
                dot.classList.toggle('bg-gray-700', dotIndex !== index);
            });
        };

        const moveToSlide = (index) => {
            if (index < 0) { index = slides.length - 1; } 
            else if (index >= slides.length) { index = 0; }
            track.style.transform = `translateX(-${index * 100}%)`;
            currentIndex = index;
            updateDots(index);
        };

        const startCarousel = () => {
            carouselTimer = setInterval(() => {
                moveToSlide(currentIndex + 1);
            }, 5000);
        };

        const resetCarousel = () => {
            clearInterval(carouselTimer);
            startCarousel();
        };

        slides.forEach((_, slideIndex) => {
            const dot = document.createElement('button');
            dot.type = 'button';
            dot.className = 'w-3 h-3 rounded-full bg-gray-700 transition';
            if (slideIndex === 0) dot.classList.add('bg-oro-accento');
            dot.addEventListener('click', () => {
                moveToSlide(slideIndex);
                resetCarousel();
            });
            dotsNav.appendChild(dot);
        });

        prevButton.addEventListener('click', () => { moveToSlide(currentIndex - 1); resetCarousel(); });
        nextButton.addEventListener('click', () => { moveToSlide(currentIndex + 1); resetCarousel(); });
        startCarousel();
    }

    // =====================================
    // LOGICA PRENOTAZIONI
    // =====================================
    const formReservation = document.getElementById('reservationForm');
    if (formReservation) {
        const card = document.getElementById('reservation-card');
        const successMessage = document.getElementById('successMessage');
        const confirmationText = document.getElementById('confirmationText');
        const dateInput = document.getElementById('data');

        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }

        formReservation.addEventListener('submit', function(e) {
            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const persone = document.getElementById('persone').value; 
            const data = document.getElementById('data').value;
            const orario = document.getElementById('orario').value;
            const note = document.getElementById('note').value;

            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('email', email);
            formData.append('telefono', telefono);
            formData.append('data', data);
            formData.append('ora', orario);      
            formData.append('ospiti', persone);  
            formData.append('note', note);

            fetch('backend/salva_prenotazione.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(risposta => {
                if (risposta.trim() === "success") {
                    const dataFormattata = new Date(data).toLocaleDateString('it-IT', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                    });

                    confirmationText.innerHTML = `
                        Grazie <span class="text-oro-accento font-semibold">${nome}</span>!<br><br>
                        La tua prenotazione per <span class="text-white font-semibold">${persone}</span> persone il
                        <span class="text-white font-semibold">${dataFormattata}</span> alle ore
                        <span class="text-white font-semibold">${orario}</span> è stata salvata direttamente nel Database.<br><br>
                        Ti aspettiamo!
                    `;

                    card.classList.add('hidden');
                    successMessage.classList.remove('hidden');
                    formReservation.reset();
                } else {
                    alert("Errore del server: " + risposta);
                }
            })
            .catch(errore => {
                console.error("Errore:", errore);
                alert("Errore di connessione. Verifica che il server sia attivo.");
            });
        });
    }

    // =====================================
    // LOGICA INVIO ORDINI ONLINE
    // =====================================
    const btnInviaOrdine = document.querySelector('#menu-cards button.bg-oro-accento');
    if (btnInviaOrdine && window.location.pathname.includes('ordini.html')) {
        btnInviaOrdine.addEventListener('click', function(e) {
            e.preventDefault();

            const elementiCarrello = document.querySelectorAll('.carrello-elemento');
            if (elementiCarrello.length === 0) {
                alert("Il carrello è vuoto! Seleziona almeno un piatto.");
                return;
            }

            const nomeCliente = prompt("Inserisci il tuo nome completo per la consegna:");
            if (!nomeCliente) return;
            const indirizzoCliente = prompt("Inserisci l'indirizzo di consegna:");
            if (!indirizzoCliente) return;
            const telefonoCliente = prompt("Inserisci il tuo numero di telefono:");
            if (!telefonoCliente) return;
            const noteCliente = prompt("Note aggiuntive per il corriere (opzionale):") || "";

            let piattiOrdinati = [];
            let totaleSenzaServizio = 0;
            elementiCarrello.forEach(el => {
                piattiOrdinati.push(el.getAttribute('data-name'));
                totaleSenzaServizio += parseFloat(el.getAttribute('data-price'));
            });

            const stringaCarrello = piattiOrdinati.join(', ');
            const totaleComplessivo = totaleSenzaServizio + COSTO_SERVIZIO;

            const formData = new FormData();
            formData.append('nome', nomeCliente);
            formData.append('indirizzo', indirizzoCliente);
            formData.append('telefono', telefonoCliente);
            formData.append('carrello', stringaCarrello);
            formData.append('totale', totaleComplessivo);
            formData.append('note', noteCliente);

            fetch('backend/salva_ordine.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(risposta => {
                if (risposta.trim() === "success") {
                    alert("Ordine inoltrato con successo! Salvato nel database.");
                    const contenitore = document.getElementById('carrello-items');
                    if (contenitore) contenitore.innerHTML = '<p id="carrello-vuoto" class="text-gray-600 text-xs text-center py-10 italic">Nessun prodotto selezionato.</p>';
                    calcolaTotale();
                } else {
                    alert("Errore del server: " + risposta);
                }
            })
            .catch(errore => {
                console.error("Errore:", errore);
                alert("Impossibile connettersi al server. Verifica MAMP.");
            });
        });
    }

    // =====================================
    // GESTIONE MODAL INTERATTIVO FEEDBACK
    // =====================================
    const modalFeedback = document.getElementById('feedback-modal');
    const modalContent = document.getElementById('modal-content');
    const btnApriFeedback = document.getElementById('btn-apri-feedback');
    const btnChiudiFeedback = document.getElementById('btn-chiudi-feedback');
    const formFeedback = modalFeedback ? modalFeedback.querySelector('form') : null;
    const contenedorTarjetas = document.querySelector('section.py-20 .flex.gap-6.overflow-x-auto');

    if (modalFeedback && btnApriFeedback && btnChiudiFeedback) {
        
        btnApriFeedback.addEventListener('click', () => {
            modalFeedback.classList.remove('hidden');
            modalFeedback.classList.add('flex');
            setTimeout(() => {
                modalFeedback.classList.remove('opacity-0');
                if(modalContent) {
                    modalContent.classList.remove('scale-95');
                    modalContent.classList.add('scale-100');
                }
            }, 10);
            document.body.classList.add('overflow-hidden');
        });

        const chiudiModal = () => {
            modalFeedback.classList.add('opacity-0');
            if(modalContent) {
                modalContent.classList.remove('scale-100');
                modalContent.classList.add('scale-95');
            }
            setTimeout(() => {
                modalFeedback.classList.add('hidden');
                modalFeedback.classList.remove('flex');
                document.body.classList.remove('overflow-hidden');
            }, 300);
        };

        btnChiudiFeedback.addEventListener('click', chiudiModal);

        modalFeedback.addEventListener('click', (e) => {
            if (e.target === modalFeedback) chiudiModal();
        });
    }

    // ==========================================
    // RECENSIONI LOCALSTORAGE
    // ==========================================
    let comentariosGuardados = JSON.parse(localStorage.getItem('recensioni_steakhouse')) || [];

    function mostrarComentariosGuardados() {
        if (!contenedorTarjetas) return;
        
        comentariosGuardados.forEach(item => {
            const nuevaTarjetaHTML = `
                <div class="snap-center shrink-0 w-80 bg-[#0a0a0a] p-8 rounded-xl border border-gray-800 shadow-xl relative">
                    <div class="text-oro-accento flex mb-4">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span class="text-xs ml-2 font-bold uppercase tracking-widest text-white mt-1">5.0</span>
                    </div>
                    <p class="text-gray-400 text-sm font-light italic mb-6">"${item.messaggio}"</p>
                    <h4 class="text-white text-xs font-bold uppercase tracking-widest">- ${item.email.split('@')[0]}</h4>
                </div>
            `;
            contenedorTarjetas.insertAdjacentHTML('afterbegin', nuevaTarjetaHTML);
        });
    }

    mostrarComentariosGuardados();

    if (formFeedback) {
        formFeedback.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('modal-email').value;
            const messaggioInput = document.getElementById('modal-msg').value;

            const nuevoFeedback = {
                email: emailInput,
                messaggio: messaggioInput
            };

            comentariosGuardados.unshift(nuevoFeedback);
            localStorage.setItem('recensioni_steakhouse', JSON.stringify(comentariosGuardados));

            const nuevaTarjetaHTML = `
                <div class="snap-center shrink-0 w-80 bg-[#0a0a0a] p-8 rounded-xl border border-gray-800 shadow-xl relative">
                    <div class="text-oro-accento flex mb-4">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span class="text-xs ml-2 font-bold uppercase tracking-widest text-white mt-1">5.0</span>
                    </div>
                    <p class="text-gray-400 text-sm font-light italic mb-6">"${messaggioInput}"</p>
                    <h4 class="text-white text-xs font-bold uppercase tracking-widest">- ${emailInput.split('@')[0]}</h4>
                </div>
            `;
            
            if (contenedorTarjetas) {
                contenedorTarjetas.insertAdjacentHTML('afterbegin', nuevaTarjetaHTML);
            }

            formFeedback.reset();
            if(btnChiudiFeedback) btnChiudiFeedback.click();
        });
    }

    // Pulsante "Inizia l'Ordine" con scroll fluido controllato da JS
    const btnInizioOrdine = document.getElementById('btn-inizio-ordine');
    if (btnInizioOrdine) {
        btnInizioOrdine.addEventListener('click', () => {
            window.scrollBy({ top: 600, behavior: 'smooth' });
        });
    }

    // Event Listener per i pulsanti di aggiunta prodotto (rimossi gli onclick dall'HTML)
    const btnAddCarne = document.getElementById('btn-add-carne');
    if (btnAddCarne) {
        btnAddCarne.addEventListener('click', () => aggiungiProdotto('select-carne'));
    }

    const btnAddDrink = document.getElementById('btn-add-drink');
    if (btnAddDrink) {
        btnAddDrink.addEventListener('click', () => aggiungiProdotto('select-drink'));
    }

    const btnAddContorno = document.getElementById('btn-add-contorno');
    if (btnAddContorno) {
        btnAddContorno.addEventListener('click', () => aggiungiProdotto('select-contorno'));
    }
});