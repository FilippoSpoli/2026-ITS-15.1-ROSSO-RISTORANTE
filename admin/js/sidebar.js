document.addEventListener("DOMContentLoaded", function () {
    const sidebarContainer = document.querySelector(".main-sidebar .sidebar");
    if (!sidebarContainer) return;

    // Recupera il nome del file attuale (es. "menu.html")
    const paginaCorrente = window.location.pathname.split("/").pop() || "dashboard.html";

    // Controlla se la pagina corrente fa parte della macro-categoria "Personale"
    const paginePersonale = ["cedolini.html", "ferie-permessi.html", "malattia.html"];
    const isPersonaleOpen = paginePersonale.includes(paginaCorrente);

    // NOTA: Rimosso data-widget="treeview" dalla radice della lista per evitare conflitti con AdminLTE
    const sidebarHTML = `
        <nav class="mt-3">
            <ul class="nav nav-pills nav-sidebar flex-column nav-child-indent" role="menu" data-accordion="false">
                
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
        </nav>
    `;

    // Inietta l'HTML nella sidebar
    sidebarContainer.innerHTML = sidebarHTML;

    // Gestione manuale e stabile del collassamento tramite jQuery
    if (window.$) {
        $(".nav-link-padre-custom").on("click", function (e) {
            e.preventDefault();
            
            const $parentLi = $(this).closest(".item-personale-custom");
            const $subMenu = $parentLi.find(".sub-menu-custom");

            if ($parentLi.hasClass("menu-open")) {
                // Se è aperto, lo chiudiamo con un'animazione fluida
                $subMenu.slideUp(250, function () {
                    $parentLi.removeClass("menu-open");
                });
            } else {
                // Se è chiuso, lo apriamo
                $parentLi.addClass("menu-open");
                $subMenu.slideDown(250);
            }
        });
    }
});
