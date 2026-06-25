document.addEventListener("DOMContentLoaded", function () {
    const sidebarContainer = document.querySelector(".main-sidebar .sidebar");
    if (!sidebarContainer) return;

    // Recupera il nome del file attuale (es. "menu.html")
    const paginaCorrente = window.location.pathname.split("/").pop() || "dashboard.html";

    // Controlla se la pagina corrente fa parte della macro-categoria "Personale"
    const paginePersonale = ["cedolini.html", "ferie-permessi.html", "malattia.html"];
    const isPersonaleOpen = paginePersonale.includes(paginaCorrente);

    // Generazione dinamica della sidebar strutturata con Flexbox per spingere il bottone in basso
    const sidebarHTML = `
        <nav class="mt-3" style="height: calc(100vh - 70px); display: flex; flex-direction: column;">
            <ul class="nav nav-pills nav-sidebar flex-column nav-child-indent" role="menu" data-accordion="false" style="flex: 1;">
                
                <li class="nav-item">
                    <a href="dashboard.html" class="nav-link ${paginaCorrente === 'dashboard.html' ? 'active' : ''}">
                        <i class="nav-icon fas fa-tachometer-alt"></i>
                        <p>Dashboard</p>
                    </a>
                </li>
                
                <li class="nav-item">
                    <a href="menu.html" class="nav-link ${paginaCorrente === 'menu.html' ? 'active' : ''}">
                        <i class="nav-icon fas fa-utensils"></i>
                        <p>Gestione Menù</p>
                    </a>
                </li>
                
                <li class="nav-item">
                    <a href="prenotazioni.html" class="nav-link ${paginaCorrente === 'prenotazioni.html' ? 'active' : ''}">
                        <i class="nav-icon fas fa-calendar-alt"></i>
                        <p>Prenotazioni</p>
                    </a>
                </li>
                
                <li class="nav-item item-personale-custom ${isPersonaleOpen ? 'menu-open' : ''}">
                    <a href="#" class="nav-link nav-link-padre-custom ${isPersonaleOpen ? 'active' : ''}">
                        <i class="nav-icon fas fa-users"></i>
                        <p>
                            Personale
                            <i class="right fas fa-angle-left"></i>
                        </p>
                    </a>
                    <ul class="nav nav-treeview sub-menu-custom" style="${isPersonaleOpen ? 'display: block;' : 'display: none;'}">
                        <li class="nav-item">
                            <a href="cedolini.html" class="nav-link ${paginaCorrente === 'cedolini.html' ? 'active' : ''}">
                                <i class="fas fa-file-invoice-dollar nav-icon"></i>
                                <p>Cedolini</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="ferie-permessi.html" class="nav-link ${paginaCorrente === 'ferie-permessi.html' ? 'active' : ''}">
                                <i class="fas fa-umbrella-beach nav-icon"></i>
                                <p>Ferie e permessi</p>
                            </a>
                        </li>
                        <li class="nav-item">
                            <a href="malattia.html" class="nav-link ${paginaCorrente === 'malattia.html' ? 'active' : ''}">
                                <i class="fas fa-briefcase-medical nav-icon"></i>
                                <p>Richiesta malattia</p>
                            </a>
                        </li>
                    </ul>
                </li>
            </ul>

            <ul class="nav nav-pills nav-sidebar flex-column mt-auto mb-3">
                <li class="nav-item border-top border-secondary pt-3">
                    <a href="../index.html" class="nav-link bg-danger text-white mx-1" style="opacity: 0.95; display: block !important;">
                        <i class="nav-icon fas fa-sign-out-alt"></i>
                        <p class="font-weight-bold" style="display: inline-block; margin-bottom: 0;">Esci (Client)</p>
                    </a>
                </li>
            </ul>
        </nav>
    `;

    // Inietta l'HTML completo nella sidebar
    sidebarContainer.innerHTML = sidebarHTML;

    // Gestione manuale e stabile del collassamento della tendina tramite jQuery
    if (window.$) {
        $(".nav-link-padre-custom").on("click", function (e) {
            e.preventDefault();
            
            const $parentLi = $(this).closest(".item-personale-custom");
            const $subMenu = $parentLi.find(".sub-menu-custom");

            if ($parentLi.hasClass("menu-open")) {
                $subMenu.slideUp(250, function () {
                    $parentLi.removeClass("menu-open");
                });
            } else {
                $parentLi.addClass("menu-open");
                $subMenu.slideDown(250);
            }
        });
    }
});
