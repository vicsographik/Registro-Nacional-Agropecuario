document.addEventListener('DOMContentLoaded', function () {
    // Guardamos los nombres originales antes de que nada los cambie
    document.querySelectorAll('filtro-menu--concept, .customdate').forEach(contenedor => {
        const header = contenedor.querySelector('.dateSelected, .filtro-menu--concept');
        if (header) {
            // Guardamos el texto real (ej: "Estatus", "Tipo de trámite")
            contenedor.dataset.originalText = header.textContent.trim();
        }
    });
    // 1. GLOBALES (Para que otros scripts no den error)
    window.HOY = new Date();
    window.HOY.setHours(0, 0, 0, 0);
    window.RANGO_MINIMO = new Date(1970, 0, 1);
    window.RANGO_MAXIMO = window.HOY;
    window.rangeSelected = { start: null, end: null };

    let currentDisplayDate = new Date(window.HOY.getFullYear(), window.HOY.getMonth(), 1);

    // 2. SELECTORES DEL CALENDARIO
    const calendarContainer = document.querySelector('.customdate.date-start');
    if (!calendarContainer) return;

    const boxSelector = calendarContainer.querySelector('.boxSelector');
    const dateStartElement = calendarContainer.querySelector('.dateSelected');
    const gridDias1 = calendarContainer.querySelector('.grid-dias-1');
    const arrowLeft = calendarContainer.querySelector('.infoNavegacion .iconBox:first-child');
    const arrowRight = calendarContainer.querySelector('.infoNavegacion .iconBox:last-child');
    const mesDisplay1 = calendarContainer.querySelector('.mes-display-1');
    const anioDisplay1 = calendarContainer.querySelector('.anio-display-1');

    [arrowLeft, arrowRight].forEach(arrow => {
        if (arrow) {
            // 1. FORZAR FOCO: Sin esto, el Tab se las brinca
            arrow.tabIndex = 0;
            arrow.setAttribute('role', 'button');

            // 2. EVENTO DE TECLADO: Enter y Espacio
            arrow.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault(); // Evita que la página salte
                    arrow.click();      // Dispara la navegación del mes

                    // Mantenemos el foco después del clic para que no se pierda al redibujar
                    setTimeout(() => arrow.focus(), 10);
                }
            });

            // 3. ESTILO DE APOYO (Solo para asegurar que veas dónde estás)
            arrow.style.cursor = 'pointer';
        }
    });

    // 3. FUNCIONES DE APOYO (El kit de herramientas)
    function createDateFromDataset(el) {
        return new Date(parseInt(el.dataset.anio), parseInt(el.dataset.mes), parseInt(el.dataset.dia));
    }

    function clearVisualSelection() {
        const dias = calendarContainer.querySelectorAll('.dia');
        dias.forEach(d => d.classList.remove('selected', 'range', 'start-date', 'end-date'));
    }

    function updateDateDisplays() {
        if (window.rangeSelected.start) {
            const start = window.rangeSelected.start.toLocaleDateString();
            const end = window.rangeSelected.end ? ` - ${window.rangeSelected.end.toLocaleDateString()}` : '';
            dateStartElement.textContent = start + end;
            dateStartElement.classList.add('active');
        } else {
            dateStartElement.textContent = 'Fecha';
            dateStartElement.classList.remove('active');
        }
    }

    function limpiarRango() {
        window.rangeSelected.start = null;
        window.rangeSelected.end = null;
        clearVisualSelection();
        updateDateDisplays();
    }

    function applyRangeVisuals() {
        // Primero limpiamos todos los estilos previos
        const todosLosDias = gridDias1.querySelectorAll('.dia');
        todosLosDias.forEach(dia => {
            dia.classList.remove('selected', 'range', 'start-date', 'end-date');
        });

        // Si no hay fechas, salimos (así el botón Restablecer termina su trabajo)
        if (!window.rangeSelected.start) return;

        // Si hay fechas, buscamos los elementos y les ponemos la clase 'selected'
        todosLosDias.forEach(diaElement => {
            const fechaDia = createDateFromDataset(diaElement);
            const tiempoDia = fechaDia.getTime();

            if (window.rangeSelected.start && tiempoDia === window.rangeSelected.start.getTime()) {
                diaElement.classList.add('selected', 'start-date');
            }
            if (window.rangeSelected.end && tiempoDia === window.rangeSelected.end.getTime()) {
                diaElement.classList.add('selected', 'end-date');
            }
            if (window.rangeSelected.start && window.rangeSelected.end &&
                tiempoDia > window.rangeSelected.start.getTime() &&
                tiempoDia < window.rangeSelected.end.getTime()) {
                diaElement.classList.add('range');
            }
        });
    }

    function limpiarFiltroIndividual(contenedor) {
        const header = contenedor.querySelector('.dateSelected, .filtro-menu--concept');
        const checks = contenedor.querySelectorAll('.form__checkbox');
        const liPadre = contenedor.closest('li');
        const textoOriginal = contenedor.dataset.originalText;

        if (contenedor.classList.contains('customdate')) {
            // Si es el calendario, usamos tu función de rango
            if (typeof limpiarRango === 'function') limpiarRango();
        } else {
            // Si son checkboxes
            checks.forEach(c => c.checked = false);

            if (header) {
                header.textContent = textoOriginal; // Restauramos el nombre original
                header.classList.remove('active');
            }
        }

        if (liPadre) {
            liPadre.classList.remove('filtro-activo');
        }

        actualizarEstadoBotonLimpiar();
    }

    // Busca todos los contenedores de filtros
    // Usamos el CONTAINER como punto de partida
    document.querySelectorAll('.filtro-menu--concept-container').forEach(contenedor => {

        // Buscamos los elementos HIJOS dentro de ese contenedor
        const header = contenedor.querySelector('.filtro-menu--concept');
        const checks = contenedor.querySelectorAll('.form__checkbox');
        const menu = contenedor.querySelector('.submenu, .boxSelector'); // El desplegable
        const btnReset = contenedor.querySelector('.reset');

        if (header) {
            // Guardamos el texto original en el contenedor
            if (!contenedor.dataset.originalText) {
                contenedor.dataset.originalText = header.textContent.trim();
            }

            header.tabIndex = 0;

            // Al hacer clic en el Header, abrimos el menú
            header.addEventListener('click', (e) => {
                e.stopPropagation();
                // Cerramos otros menús y abrimos este
                toggleMenu(menu);
            });
        }

        // Gestionamos los checks dentro de este contenedor
        checks.forEach(check => {
            check.addEventListener('change', () => {
                // Esta es la función que actualiza el texto del Header
                actualizarEstadoFiltro(contenedor);
                actualizarEstadoBotonLimpiar();
            });
        });

        // Gestionamos el botón reset de este contenedor
        if (btnReset) {
            btnReset.addEventListener('click', (e) => {
                e.stopPropagation();
                limpiarFiltroIndividual(contenedor);
            });
        }
    });

    function generarDiasEnHTML(anio, mes, gridDiasContainer) {
        if (!gridDiasContainer) return;

        // 1. Limpiamos el contenedor (Usamos el que entra por parámetro)
        gridDiasContainer.innerHTML = '';

        const primerDia = new Date(anio, mes, 1).getDay(); // 0 (Dom) a 6 (Sab)
        const diasEnMes = new Date(anio, mes + 1, 0).getDate();

        // 2. Cálculo del desfase (Lunes como primer día de la semana)
        // Si primerDia es 0 (Domingo), el desfase es 6. Si no, es primerDia - 1.
        const desfase = primerDia === 0 ? 6 : primerDia - 1;

        // 3. Crear espacios vacíos para el inicio del mes
        for (let i = 0; i < desfase; i++) {
            const span = document.createElement('span');
            span.classList.add('vacio');
            gridDiasContainer.appendChild(span); // Agregamos al contenedor correcto
        }

        // 4. Crear los días reales del mes
        for (let d = 1; d <= diasEnMes; d++) {
            const span = document.createElement('span');
            span.classList.add('dia');

            // Atributos de accesibilidad
            span.setAttribute('tabindex', '0');
            span.setAttribute('role', 'button');
            span.setAttribute('aria-label', `Día ${d}`);

            // Dataset
            span.dataset.dia = d;
            span.dataset.mes = mes;
            span.dataset.anio = anio;
            span.textContent = d;

            // Evento de teclado (¡Tu lógica es excelente!)
            span.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    span.click();
                }
                if (e.key === 'ArrowUp') {
                    const diaActual = parseInt(span.textContent);
                    if (diaActual <= 7) {
                        e.preventDefault();
                        // Asegúrate de que arrowRight esté definida globalmente
                        const arrowRight = document.querySelector('.iconBox:last-child');
                        arrowRight?.focus();
                    }
                }
                if (e.key === 'Escape') {
                    // Cerramos el menú buscando el contenedor principal
                    const container = span.closest('.filtro-menu--concept-container');
                    const header = container?.querySelector('.dateSelected');
                    header?.click();
                    header?.focus();
                }
            });

            gridDiasContainer.appendChild(span);
        }
    }

    function actualizarVistaCalendario(anio, mes) {
        // 1. Actualizar los textos de la cabecera del calendario
        const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

        if (mesDisplay1) mesDisplay1.textContent = meses[mes];
        if (anioDisplay1) anioDisplay1.textContent = anio;

        // 2. Dibujar los números de los días
        // Esta función la definimos en el paso anterior, asegúrate de tenerla
        generarDiasEnHTML(anio, mes, gridDias1);

        // 3. Pintar el rango seleccionado (si es que existe uno)
        if (typeof applyRangeVisuals === 'function') {
            applyRangeVisuals();
        }

        // 4. Bloquear/Activar flechas según el rango máximo (HOY)
        if (typeof actualizarEstadoFlechas === 'function') {
            actualizarEstadoFlechas();
        }
    }

    function actualizarEstadoBotonLimpiar() {
        const btnBorrarTodo = document.getElementById('btnBorrarTodo');
        if (!btnBorrarTodo) return;

        // 1. Revisar si hay fechas seleccionadas
        const hayFecha = window.rangeSelected.start !== null;

        // 2. Revisar si hay algún checkbox marcado en cualquier filtro
        const hayChecks = Array.from(document.querySelectorAll('.form__checkbox')).some(c => c.checked);

        // 3. Si hay fecha O hay checks, activamos el botón; si no, lo desactivamos
        if (hayFecha || hayChecks) {
            btnBorrarTodo.classList.remove('btn-disabled');
        } else {
            btnBorrarTodo.classList.add('btn-disabled');
        }
    }

    function actualizarEstadoFiltro(contenedor) {
        const header = contenedor.querySelector('.filtro-menu--concept');
        const checks = contenedor.querySelectorAll('.form__checkbox');
        const textoOriginal = contenedor.dataset.originalText;

        const seleccionados = Array.from(checks)
            .filter(c => c.checked)
            .map(c => c.closest('label').textContent.trim());

        if (header) {
            if (seleccionados.length > 0) {
                header.textContent = seleccionados.join(', ');
                header.classList.add('active');
                contenedor.classList.add('filtro-activo'); // El contenedor se ilumina
            } else {
                header.textContent = textoOriginal;
                header.classList.remove('active');
                contenedor.classList.remove('filtro-activo');
            }
        }
    }
    // Buscamos todos los li que contienen menús de conceptos
    document.querySelectorAll('li').forEach(li => {
        const checks = li.querySelectorAll('.form__checkbox');

        checks.forEach(check => {
            check.addEventListener('change', () => {
                // Pasamos el li o el contenedor principal del filtro
                actualizarEstadoFiltro(li);
            });
        });
    });

    // 4. BUCLE ÚNICO PARA TODOS LOS FILTROS (Menus y Resets)
    const filtros = document.querySelectorAll('.customdate, .filtro-item-contenedor');
    filtros.forEach(contenedor => {
        // Buscamos el header (el que dice "Estatus", "Fecha", etc.)
        const header = contenedor.querySelector('.dateSelected, .filtro-menu--concept');
        const menu = contenedor.querySelector('.boxSelector, .submenu');

        if (header) {
            // 1. Habilitar navegación por teclado
            header.tabIndex = 0;
            header.setAttribute('role', 'button');

            // 2. Evento de Teclado (Enter/Espacio)
            header.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    header.click(); // Ejecuta la lógica de apertura
                }
            });

            // 3. Evento de Clic (Apertura y Cierre)
            header.addEventListener('click', (e) => {
                if (e.target.tagName === 'INPUT' || e.target.closest('.form__checkbox')) {
                    return;
                }

                e.stopPropagation();

                // Cerrar todos los demás menús antes de abrir este
                document.querySelectorAll('.boxSelector, .submenu').forEach(m => {
                    if (m !== menu) m.classList.add('d-none');
                });

                // Toggle del menú actual
                if (menu) {
                    const estaCerrado = menu.classList.contains('d-none');
                    menu.classList.toggle('d-none');

                    // Si se está abriendo, gestionar el foco interno
                    if (estaCerrado) {
                        // Si es el calendario, enfocamos la flecha
                        if (contenedor.classList.contains('customdate')) {
                            const arrowLeft = menu.querySelector('.infoNavegacion .iconBox:first-child');
                            setTimeout(() => arrowLeft?.focus(), 100);
                            // Llamada opcional por si necesitas refrescar el calendario al abrir
                            if (typeof actualizarVistaCalendario === 'function') {
                                actualizarVistaCalendario(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
                            }
                        } else {
                            // Si es un filtro normal, enfocamos el primer checkbox
                            const primerCheck = menu.querySelector('input');
                            setTimeout(() => primerCheck?.focus(), 100);
                        }
                    }
                }
            });
        }
        document.querySelectorAll('.filtro-menu--concept-container').forEach(contenedor => {
            const checks = contenedor.querySelectorAll('.form__checkbox');

            checks.forEach(check => {
                // El evento 'change' captura tanto el clic del ratón como la tecla Espacio
                check.addEventListener('change', () => {
                    actualizarEstadoFiltro(contenedor);
                });
            });
        });
    });
    // --- BLOQUE ÚNICO PARA CLIC EN DÍAS ---
    if (gridDias1) {
        gridDias1.addEventListener('click', (e) => {
            const diaElement = e.target.closest('.dia');

            // 1. Validar que sea un día real
            if (!diaElement || diaElement.classList.contains('vacio')) return;

            // 2. Crear la fecha desde los datos del span (dataset)
            const seleccionada = createDateFromDataset(diaElement);

            // 3. LÓGICA DE SELECCIÓN (Unificada)
            if (!window.rangeSelected.start || window.rangeSelected.end) {
                // Empezar selección (primer clic o reinicio)
                window.rangeSelected.start = seleccionada;
                window.rangeSelected.end = null;
            } else {
                // Segundo clic (completar rango)
                if (seleccionada < window.rangeSelected.start) {
                    window.rangeSelected.end = window.rangeSelected.start;
                    window.rangeSelected.start = seleccionada;
                } else {
                    window.rangeSelected.end = seleccionada;
                }
            }

            // 4. FEEDBACK VISUAL DEL LI (Desde el primer clic)
            const liPadre = gridDias1.closest('li');
            if (window.rangeSelected.start !== null) {
                liPadre.classList.add('filtro-activo');
            }

            // 5. ACTUALIZAR TODO
            updateDateDisplays();        // Cambia el texto "Fecha" por el número
            applyRangeVisuals();         // Pinta los días de azul
            actualizarEstadoBotonLimpiar(); // Activa el botón de "Borrar filtros"
        });
    }

    // 5. CLIC FUERA PARA CERRAR TODO
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.customdate') && !e.target.closest('.filtro-item-contenedor')) {
            document.querySelectorAll('.boxSelector, .submenu').forEach(m => m.classList.add('d-none'));
        }
    });

    // Inicializar
    updateDateDisplays();
    actualizarVistaCalendario(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());

    // --- NAVEGACIÓN DE MESES ---
    if (arrowLeft && arrowRight) {
        arrowLeft.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que el calendario se cierre al navegar

            // Restamos un mes a la fecha que estamos visualizando
            currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);

            // Dibujamos el nuevo mes
            actualizarVistaCalendario(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
        });

        arrowRight.addEventListener('click', (e) => {
            e.stopPropagation(); // Evita que el calendario se cierre al navegar

            // Sumamos un mes
            currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);

            // Dibujamos el nuevo mes
            actualizarVistaCalendario(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
        });
    }
    const btnBorrarTodo = document.getElementById('btnBorrarTodo');
    if (btnBorrarTodo) {
        btnBorrarTodo.addEventListener('click', () => {
            document.querySelectorAll('.filtro-menu--concept-container, .customdate').forEach(contenedor => {
                limpiarFiltroIndividual(contenedor);
            });
        });
    }
    // Buscamos todos los botones con la clase .reset
    document.querySelectorAll('.reset').forEach(btn => {
        btn.addEventListener('click', (e) => {
            // 1. Evitamos que el menú se cierre al hacer clic (burbujeo)
            e.stopPropagation();

            // 2. Buscamos el contenedor más cercano que envuelve al filtro
            const contenedor = btn.closest('.filtro-menu--concept-container') || btn.closest('.customdate');

            if (contenedor) {
                // 3. Llamamos a la función de limpieza que ya tenemos
                limpiarFiltroIndividual(contenedor);
            }
        });

        // 4. Accesibilidad: permitir usar el botón con el teclado
        btn.setAttribute('tabindex', '0');
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
    // --- MANEJAR LA VISIBILDAD DEL PANEL FILTROS EN MÓVILES ---

    const filtrosDiv = document.querySelector(".filtros");
    const toggleBtn = document.getElementById("toggleFiltrosBtn");
    const closeBtn = document.querySelector(".close-filtros-btn");

    if (toggleBtn && filtrosDiv) {
        toggleBtn.addEventListener("click", function () {
            const isOpen = filtrosDiv.classList.toggle("open");
            toggleBtn.classList.toggle("active");

            // Actualización de icono
            const toggleArrowIcon = toggleBtn.querySelector(".arrow-icon");
            if (toggleArrowIcon) {
                toggleArrowIcon.textContent = isOpen ? "▲" : "▼";
            }

            // ACCESIBILIDAD: Si se abre, mover el foco al primer filtro automáticamente
            if (isOpen) {
                const primerHeader = filtrosDiv.querySelector('.filtro-menu--concept, .dateSelected');
                setTimeout(() => primerHeader?.focus(), 300); // Pequeño delay por la animación CSS
            }
        });
    }

    if (closeBtn && filtrosDiv) {
        closeBtn.addEventListener("click", function () {
            filtrosDiv.classList.remove("open");
            toggleBtn?.classList.remove("active");

            const toggleArrowIcon = toggleBtn?.querySelector(".arrow-icon");
            if (toggleArrowIcon) toggleArrowIcon.textContent = "▼";

            // Devolvemos el foco al botón que abre el menú para no perder al usuario
            toggleBtn?.focus();
        });
    }
    actualizarEstadoBotonLimpiar();
});