(function() { 
    "use strict";

    /**
     * Sanitiza y configura el menú de accesibilidad
     */
    function actualizarPosicionMenu() {
        const menuCompleto = document.getElementById('accessibility');
        const miContenedor = document.getElementById('accesibilidadGob');

        if (!menuCompleto || !miContenedor) return;

        if (menuCompleto.parentNode !== miContenedor) {

            miContenedor.appendChild(menuCompleto);
            configurarClickMenu(menuCompleto);
        }

        Object.assign(menuCompleto.style, {
            position: 'relative',
            right: 'auto',
            top: 'auto',
            display: 'block'
        });

        const btn = menuCompleto.querySelector('.menu-btn');
        if (btn) {
            btn.style.position = 'relative';
            btn.style.right = 'auto';
        }
    }

    function configurarClickMenu(contenedorPadre) {
        const btn = contenedorPadre.querySelector('.menu-btn');
        const menuContainer = contenedorPadre.querySelector('.menu-container');

        if (btn && menuContainer) {
            btn.addEventListener('click', function (e) {
                e.preventDefault();
                e.stopPropagation();
                menuContainer.classList.toggle('is-active');
            }, false);
        }
    }

    document.addEventListener('click', function (e) {
        const menuContainer = document.querySelector('.menu-container');
        if (menuContainer && menuContainer.classList.contains('is-active') && !menuContainer.contains(e.target)) {
            menuContainer.classList.remove('is-active');
        }
    }, { passive: true });

    let intentos = 0;
    const intervalo = setInterval(() => {
        const existe = document.getElementById('accessibility');
        intentos++;
        if (existe) {
            clearInterval(intervalo);
            actualizarPosicionMenu();
        } else if (intentos >= 20) {
            clearInterval(intervalo);
        }
    }, 100);

    window.addEventListener('resize', actualizarPosicionMenu, { passive: true });
    window.addEventListener('load', actualizarPosicionMenu, { passive: true });

})();