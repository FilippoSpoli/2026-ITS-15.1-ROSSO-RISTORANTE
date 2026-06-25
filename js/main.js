if (typeof tailwind !== 'undefined') {
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
    if (msgVuoto) msgVuoto.classList.add('hidden');

    const htmlProdotto = `
        <div id="${itemId}" class="flex justify-between items-start text-sm group carrello-elemento" data-price="${prezzoProdotto}" data-name="${nomeProdotto}">
            <div class="flex items-start gap-3">
                <span class="text-gray-400 font-light">1x</span>
                <div>
                    <h4 class="text-gray-200 font-medium">${nomeProdotto}</h4>
                </div>
            </div>
            <div class="flex items-center gap-3">
                <span class="text-gray-300 font-mono">€${prezzoProdotto.toFixed(2)}</span>
                <button onclick="rimuoviProdotto('${itemId}')" class="text-gray-600 hover:text-red-400 transition">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            </div>
        </div>
    `;

    const listaCarrello = document.getElementById('lista-carrello');
    if (listaCarrello) {
        listaCarrello.insertAdjacentHTML('beforeend', htmlProdotto);
    }

    calcolaTotale();
    selectEl.selectedIndex = 0;
};

window.rimuoviProdotto = function(itemId) {
    const item = document.getElementById(itemId);
    if (item) {
        item.remove();
        
        const elementiRimasti = document.querySelectorAll('.carrello-elemento');
        if (elementiRimasti.length === 0) {
            const msgVuoto = document.getElementById('carrello-vuoto');
            if (msgVuoto) msgVuoto.classList.remove('hidden');
        }
        
        calcolaTotale();
    }
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
// INIZIALIZZAZIONE DOM CENTRALIZZATA
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
                    console.log("Errore server prenotazione: " + risposta);
                }
            })
            .catch(errore => {
                console.error("Errore di connessione:", errore);
            });
        });
    }

    // =====================================
    // GESTIONE MODAL INTERATTIVO FEEDBACK
    // =====================================
    const modalFeedback = document.getElementById('feedback-modal');
    const modalContent = document.getElementById('modal-content');
    const btnApriFeedback = document.getElementById('btn-api-feedback') || document.getElementById('btn-apri-feedback');
    const btnChiudiFeedback = document.getElementById('btn-chiudi-feedback');
    const formFeedback = document.getElementById("form-feedback");
    const containerRecensioni = document.getElementById("recensioni-container") || document.querySelector(".flex.gap-6.overflow-x-auto.snap-x");

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
    // UNICA FUNZIONE CARICAMENTO RECENSIONI REALI
    // ==========================================
    function mostraRecensioniSalvate() {
        if (!containerRecensioni) return;

        // Svuota immediatamente le recensioni fisse inserite nell'HTML statico
        containerRecensioni.innerHTML = "";

        fetch('backend/leggi_feedback.php')
            .then(response => {
                if (!response.ok) throw new Error("Errore nel caricamento delle recensioni");
                return response.json();
            })
            .then(recensioni => {
                if (!recensioni || recensioni.length === 0) {
                    containerRecensioni.innerHTML = `
                        <p class="text-gray-500 text-sm italic text-center w-full py-8">
                            Nessuna recensione presente. Sii il primo a lasciarne una!
                        </p>`;
                    return;
                }

                // Cicla ed appende i record estratti dal DB
                recensioni.forEach(item => {
                    const nome = item.nome || 'Anonimo';
                    const cognome = item.cognome || '';
                    
                    // Unisce Nome e Cognome per la stampa sul Front-end
                    const autoreCompleto = cognome ? `${nome} ${cognome}` : nome;
                    
                    const commento = item.commento || '';
                    const voto = parseInt(item.valutazione) || 5;

                    let stelleHTML = '';
                    for (let i = 1; i <= 5; i++) {
                        if (i <= voto) {
                            stelleHTML += `<svg class="w-4 h-4 text-oro-accento" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>`;
                        } else {
                            stelleHTML += `<svg class="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/></svg>`;
                        }
                    }

                    const cardHTML = `
                        <div class="snap-center shrink-0 w-80 bg-[#0a0a0a] p-8 rounded-xl border border-gray-800 shadow-xl relative">
                            <div class="flex items-center space-x-1 mb-4">
                                <div class="flex text-oro-accento">${stelleHTML}</div>
                                <span class="text-xs ml-2 font-bold uppercase tracking-widest text-white mt-0.5">${voto.toFixed(1)}</span>
                            </div>
                            <p class="text-gray-400 text-sm font-light italic mb-6">"${commento}"</p>
                            <h4 class="text-white text-xs font-bold uppercase tracking-widest">- ${autoreCompleto}</h4>
                        </div>
                    `;
                    containerRecensioni.insertAdjacentHTML('beforeend', cardHTML);
                });
            })
            .catch(error => {
                console.error("Errore durante il caricamento dei feedback:", error);
                containerRecensioni.innerHTML = `<p class="text-red-500 text-sm italic text-center w-full py-4">Impossibile caricare le recensioni.</p>`;
            });
    }

    // Caricamento iniziale immediato
    mostraRecensioniSalvate();

    // ==========================================
    // INVIO DEL FORM FEEDBACK (Modello salva_ordine)
    // ==========================================
    if (formFeedback) {
        formFeedback.addEventListener('submit', (e) => {
            e.preventDefault();

            const nomeInput = document.getElementById('modal-nome').value;
            const cognomeInput = document.getElementById('modal-cognome').value; // Recupera il cognome
            const valutazioneInput = document.getElementById('modal-valutazione').value;
            const messaggioInput = document.getElementById('modal-msg').value;

            const formData = new FormData();
            formData.append('nome', nomeInput);
            formData.append('cognome', cognomeInput); // Aggiunge il cognome ai dati inviati
            formData.append('valutazione', valutazioneInput);
            formData.append('commento', messaggioInput);

            fetch('backend/salva_feedback.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.text())
            .then(data => {
                if (data.trim() === "success") {
                    formFeedback.reset();
                    if (btnChiudiFeedback) btnChiudiFeedback.click();

                    // Aggiorna istantaneamente l'interfaccia prelevando i dati salvati a DB
                    mostraRecensioniSalvate();
                } else {
                    alert("Errore durante il salvataggio: " + data);
                }
            })
            .catch(error => {
                console.error("Errore durante l'invio:", error);
                alert("Si è verificato un errore di rete.");
            });
        });
    }

    // Pulsante "Inizia l'Ordine" con scroll fluido
    const btnInizioOrdine = document.getElementById('btn-inizio-ordine');
    if (btnInizioOrdine) {
        btnInizioOrdine.addEventListener('click', () => {
            window.scrollBy({ top: 600, behavior: 'smooth' });
        });
    }

    // Event Listener per aggiunta prodotti
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


    // =====================================
    // LOGICA MODAL CHECKOUT
    // =====================================
    const checkoutModal = document.getElementById('checkout-modal');
    const modalCorpo = document.getElementById('modal-corpo');
    const btnApriCheckout = document.getElementById('btn-apri-checkout');
    const btnChiudiModal = document.getElementById('btn-chiudi-modal');
    const checkoutOverlay = document.getElementById('checkout-overlay');
    const formCheckout = document.getElementById('form-checkout');

    if (btnApriCheckout) {
        btnApriCheckout.addEventListener('click', () => {
            const elementiCarrello = document.querySelectorAll('.carrello-elemento');
            if (elementiCarrello.length === 0) return;
            
            if (checkoutModal && modalCorpo) {
                checkoutModal.classList.remove('opacity-0', 'pointer-events-none');
                modalCorpo.classList.remove('scale-95');
                modalCorpo.classList.add('scale-100');
            }
        });
    }

    function chiudiCheckoutModal() {
        if (checkoutModal && modalCorpo) {
            checkoutModal.classList.add('opacity-0', 'pointer-events-none');
            modalCorpo.classList.remove('scale-100');
            modalCorpo.classList.add('scale-95');
        }
    }

    if (btnChiudiModal) btnChiudiModal.addEventListener('click', chiudiCheckoutModal);
    if (checkoutOverlay) checkoutOverlay.addEventListener('click', chiudiCheckoutModal);

    if (formCheckout) {
        formCheckout.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const nome = document.getElementById('checkout-nome').value;
            const telefono = document.getElementById('checkout-telefono').value;
            const indirizzo = document.getElementById('checkout-indirizzo').value;
            const note = document.getElementById('checkout-note').value;
            
            const totaleTesto = document.getElementById('label-totale').innerText;
            const totaleNumero = parseFloat(totaleTesto.replace('€', '').trim());
            
            const elementiCarrello = document.querySelectorAll('.carrello-elemento');
            let riepilogoProdotti = [];
            elementiCarrello.forEach(item => {
                const nomeProdotto = item.getAttribute('data-name');
                const prezzoProdotto = item.getAttribute('data-price');
                riepilogoProdotti.push(`${nomeProdotto} (€${prezzoProdotto})`);
            });
            const dettaglioCarrelloTesto = riepilogoProdotti.join(', ');

            const formData = new FormData();
            formData.append('nome', nome);
            formData.append('telefono', telefono);
            formData.append('indirizzo', indirizzo);
            formData.append('note', note);
            formData.append('totale', totaleNumero);
            formData.append('carrello', dettaglioCarrelloTesto);

            fetch('backend/salva_ordine.php', {
                method: 'POST',
                body: formData
            })
            .then(response => {
                chiudiCheckoutModal();
                window.location.href = "ordini.html?status=success";
            })
            .catch(error => {
                console.error("Errore durante l'invio:", error);
            });
        });
    }

});