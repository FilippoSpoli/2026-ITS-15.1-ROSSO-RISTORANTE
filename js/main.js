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

/**
 * Logica di base per l'inizializzazione della pagina e interazioni
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Dissolvenza in entrata della pagina
    const contenitore = document.getElementById('contenitore-principale');
    setTimeout(() => {
        contenitore.classList.remove('opacity-0');
    }, 150);

    // 2. Gestione del Menu Mobile (Hamburger)
    const btnMenu = document.getElementById('menu-btn');
    const menuScorrevole = document.getElementById('mobile-menu');
    const linee = btnMenu.querySelectorAll('span');

    btnMenu.addEventListener('click', () => {
        // Mostra o nascondi il menu a schermo intero
        menuScorrevole.classList.toggle('opacity-0');
        menuScorrevole.classList.toggle('pointer-events-none');

        // Animazione dell'icona Hamburger in una "X"
        linee[0].classList.toggle('translate-y-2');
        linee[0].classList.toggle('rotate-45');
        
        linee[1].classList.toggle('opacity-0');
        
        linee[2].classList.toggle('-translate-y-2');
        linee[2].classList.toggle('-rotate-45');
        
        // Blocca lo scroll della pagina quando il menu è aperto
        document.body.classList.toggle('overflow-hidden');
    });

    // Slider de Desvanecimiento (Fade) para la sección "Scopri la Nostra Storia"
    const fadeImages = document.querySelectorAll('#bg-fade-slider .slide-img');
    
    if (fadeImages.length > 0) {
        let currentImgIndex = 0;

        setInterval(() => {
            // Oculta la imagen actual
            fadeImages[currentImgIndex].classList.remove('opacity-100');
            fadeImages[currentImgIndex].classList.add('opacity-0');

            // Calcula el índice de la siguiente imagen
            currentImgIndex = (currentImgIndex + 1) % fadeImages.length;

            // Muestra la siguiente imagen
            fadeImages[currentImgIndex].classList.remove('opacity-0');
            fadeImages[currentImgIndex].classList.add('opacity-100');
            
        }, 2000); // Cambia de imagen cada 2segundos 
    }

    // Nuovo carosello a schede con frecce e indicatori
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
            if (index < 0) {
                index = slides.length - 1;
            } else if (index >= slides.length) {
                index = 0;
            }
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
            if (slideIndex === 0) {
                dot.classList.add('bg-oro-accento');
            }
            dot.addEventListener('click', () => {
                moveToSlide(slideIndex);
                resetCarousel();
            });
            dotsNav.appendChild(dot);
        });

        prevButton.addEventListener('click', () => {
            moveToSlide(currentIndex - 1);
            resetCarousel();
        });

        nextButton.addEventListener('click', () => {
            moveToSlide(currentIndex + 1);
            resetCarousel();
        });

             startCarousel();
    }

    // =====================================
    // PRENOTAZIONI
    // =====================================

    const form = document.getElementById('reservationForm');

    if (form) {

        const card = document.getElementById('reservation-card');
        const successMessage = document.getElementById('successMessage');
        const confirmationText = document.getElementById('confirmationText');

        const dateInput = document.getElementById('data');

        if (dateInput) {
            const today = new Date().toISOString().split('T')[0];
            dateInput.min = today;
        }

        form.addEventListener('submit', function(e) {

            e.preventDefault();

            const nome = document.getElementById('nome').value;
            const email = document.getElementById('email').value;
            const telefono = document.getElementById('telefono').value;
            const persone = document.getElementById('persone').value;
            const data = document.getElementById('data').value;
            const orario = document.getElementById('orario').value;
            const note = document.getElementById('note').value;

            const prenotazione = {
                id: Date.now(),
                nome,
                email,
                telefono,
                persone,
                data,
                orario,
                note,
                dataCreazione: new Date().toLocaleString('it-IT')
            };

            let prenotazioni =
                JSON.parse(localStorage.getItem('prenotazioni')) || [];

            prenotazioni.push(prenotazione);

            localStorage.setItem(
                'prenotazioni',
                JSON.stringify(prenotazioni)
            );

            const dataFormattata = new Date(data).toLocaleDateString('it-IT', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
            });

            confirmationText.innerHTML = `
                Grazie <span class="text-oro-accento font-semibold">${nome}</span>!<br><br>
                La tua prenotazione per
                <span class="text-white font-semibold">${persone}</span>
                persone il
                <span class="text-white font-semibold">${dataFormattata}</span>
                alle ore
                <span class="text-white font-semibold">${orario}</span>
                è stata registrata.<br><br>
                Ti aspettiamo!
            `;

            card.classList.add('hidden');
            successMessage.classList.remove('hidden');
        });
    }

    // Gestione del Modal Feedback
    const modalFeedback = document.getElementById('feedback-modal');
    const modalContent = document.getElementById('modal-content');
    const btnApriFeedback = document.getElementById('btn-apri-feedback');
    const btnChiudiFeedback = document.getElementById('btn-chiudi-feedback');

    if (modalFeedback && btnApriFeedback) {
        
        // Funzione per aprire il modal
        btnApriFeedback.addEventListener('click', () => {
            modalFeedback.classList.remove('hidden');
            modalFeedback.classList.add('flex');
            // Ritardo di 10ms per permettere al CSS di applicare l'opacità
            setTimeout(() => {
                modalFeedback.classList.remove('opacity-0');
                modalContent.classList.remove('scale-95');
                modalContent.classList.add('scale-100');
            }, 10);
            document.body.classList.add('overflow-hidden'); // Blocca lo scroll del sito
        });

        // Funzione per chiudere il modal
        const chiudiModal = () => {
            modalFeedback.classList.add('opacity-0');
            modalContent.classList.remove('scale-100');
            modalContent.classList.add('scale-95');
            
            // Aspetta che l'animazione finisca (300ms) prima di nasconderlo del tutto
            setTimeout(() => {
                modalFeedback.classList.add('hidden');
                modalFeedback.classList.remove('flex');
                document.body.classList.remove('overflow-hidden'); // Riattiva lo scroll
            }, 300);
        };

        btnChiudiFeedback.addEventListener('click', chiudiModal);

        // Chiudi se l'utente clicca fuori dalla finestra nera
        modalFeedback.addEventListener('click', (e) => {
            if (e.target === modalFeedback) {
                chiudiModal();
            }
        });
    }

});




// ==========================================
// GESTIONE RECENSIONI E LOCALSTORAGE
// ==========================================

// 1. Selezioniamo gli elementi esatti dal tuo HTML
const modalFeedback = document.getElementById('feedback-modal');
const btnApriFeedback = document.getElementById('btn-apri-feedback');
const btnChiudiFeedback = document.getElementById('btn-chiudi-feedback');
const formFeedback = modalFeedback ? modalFeedback.querySelector('form') : null;

// Selezioniamo il contenitore in cui scorrono le card dei clienti
const contenedorTarjetas = document.querySelector('section.py-20 .flex.gap-6.overflow-x-auto');

// 2. Recuperiamo le recensioni esistenti dal localStorage (se non ce ne sono, iniziamo con un array vuoto)
let comentariosGuardados = JSON.parse(localStorage.getItem('recensioni_steakhouse')) || [];

// 3. Funzione per mostrare le recensioni salvate all'apertura della pagina
function mostrarComentariosGuardados() {
    if (!contenedorTarjetas) return;
    
    comentariosGuardados.forEach(item => {
        // Creiamo la card con la stessa struttura esatta del tuo HTML
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
        // Inseriamo la card all'inizio della lista così l'utente la vede subito
        contenedorTarjetas.insertAdjacentHTML('afterbegin', nuevaTarjetaHTML);
    });
}

// Eseguiamo la funzione al caricamento della pagina
mostrarComentariosGuardados();

// 4. Logica per aprire e chiudere il modal
if (btnApriFeedback && modalFeedback) {
    btnApriFeedback.addEventListener('click', () => {
        modalFeedback.classList.remove('hidden');
        modalFeedback.classList.add('flex');
        setTimeout(() => modalFeedback.classList.remove('opacity-0'), 10);
    });
}

if (btnChiudiFeedback && modalFeedback) {
    btnChiudiFeedback.addEventListener('click', () => {
        modalFeedback.classList.add('opacity-0');
        setTimeout(() => {
            modalFeedback.classList.remove('flex');
            modalFeedback.classList.add('hidden');
        }, 300);
    });
}

// 5. Gestione dell'invio del form, salvataggio in localStorage e inserimento nella pagina
if (formFeedback) {
    formFeedback.addEventListener('submit', (e) => {
        e.preventDefault(); // Impedisce il ricaricamento della pagina

        // Recuperiamo i dati inseriti nei campi del form
        const emailInput = document.getElementById('modal-email').value;
        const messaggioInput = document.getElementById('modal-msg').value;

        // Creiamo l'oggetto con la nuova recensione
        const nuevoFeedback = {
            email: emailInput,
            messaggio: messaggioInput
        };

        // Aggiungiamo la nuova recensione all'inizio del nostro array
        comentariosGuardados.unshift(nuevoFeedback);

        // Salviamo l'array aggiornato nel localStorage come stringa di testo
        localStorage.setItem('recensioni_steakhouse', JSON.stringify(comentariosGuardados));

        // Creiamo e inseriamo immediatamente la nuova card nella pagina in modo dinamico
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

        // Resettiamo i campi del form e chiudiamo la finestra modale
        formFeedback.reset();
        btnChiudiFeedback.click();
    });
}