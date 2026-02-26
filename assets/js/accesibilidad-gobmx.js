function actualizarPosicionMenu() {
            const menuCompleto = document.getElementById('accessibility');
            const miContenedor = document.getElementById('accesibilidadGob');

            if (!menuCompleto) return;

            // 1. MUDANZA
            if (miContenedor && menuCompleto.parentNode !== miContenedor) {
                miContenedor.appendChild(menuCompleto);
                console.log('Menú integrado y listo para el click.');

                // --- AQUÍ ACTIVAMOS EL CLICK ---
                // Lo hacemos solo cuando el menú entra al contenedor por primera vez
                configurarClickMenu(menuCompleto);
            }

            // 2. NEUTRALIZACIÓN
            menuCompleto.style.position = 'relative';
            menuCompleto.style.right = 'auto';
            menuCompleto.style.top = 'auto';
            menuCompleto.style.display = 'block';

            const btn = menuCompleto.querySelector('.menu-btn');
            if (btn) {
                btn.style.position = 'relative';
                btn.style.right = 'auto';
            }
        }

        // Nueva función auxiliar para que el código sea limpio
        function configurarClickMenu(contenedorPadre) {
            const btn = contenedorPadre.querySelector('.menu-btn');
            const menuContainer = contenedorPadre.querySelector('.menu-container');

            if (btn && menuContainer) {
                // Usamos un nombre de función para que no se dupliquen eventos si se llama varias veces
                btn.onclick = function (e) {
                    e.preventDefault();
                    e.stopPropagation(); // Evita que el click llegue al document inmediatamente
                    menuContainer.classList.toggle('is-active');
                    console.log('Clase is-active alternada!');
                };
            }
        }

        // Cerrar si hacen click fuera (esto sí puede ir en el document)
        document.addEventListener('click', function (e) {
            const menuContainer = document.querySelector('.menu-container');
            if (menuContainer && !menuContainer.contains(e.target)) {
                menuContainer.classList.remove('is-active');
            }
        });

        // Tu lógica de intervalos se mantiene igual
        let intentos = 0;
        const intervalo = setInterval(() => {
            const existe = document.getElementById('accessibility');
            if (existe || intentos >= 20) {
                clearInterval(intervalo);
                actualizarPosicionMenu();
            }
            intentos++;
        }, 100);

        window.addEventListener('resize', actualizarPosicionMenu);
        window.addEventListener('load', actualizarPosicionMenu);