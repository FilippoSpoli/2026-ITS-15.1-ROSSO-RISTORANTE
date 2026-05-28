


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
});



