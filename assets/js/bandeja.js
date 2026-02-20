
    document.addEventListener('DOMContentLoaded', function () {
        // --- CONSTANTES GLOBALES DE RANGO ---
        const HOY = new Date();
        HOY.setHours(0, 0, 0, 0);

        // Límites estrictos de navegación (1er día del mes)
        const PRIMER_DIA_MES_ACTUAL = new Date(HOY.getFullYear(), HOY.getMonth(), 1);
        const LIMITE_PASADO_MES = new Date(HOY.getFullYear() - 1, HOY.getMonth(), 1);

        // Límite de día para deshabilitación de celdas (la fecha exacta de hace un año)
        const UN_ANIO_ATRAS = new Date(HOY.getFullYear() - 1, HOY.getMonth(), HOY.getDate());
        // --- FIN CONSTANTES GLOBALES DE RANGO ---

        const calendarContainer = document.querySelector('.customdate.date-start');

        if (!calendarContainer) return;

        // --- SELECTORES GLOBALES ---
        const boxSelector = calendarContainer.querySelector('.boxSelector');
        const arrowLeft = calendarContainer.querySelector('.infoNavegacion .left-arrow');
        const arrowRight = calendarContainer.querySelector('.infoNavegacion .right-arrow');

        // SELECTORES DE BOTONES NUEVOS
        const confirmButton = calendarContainer.querySelector('#confirm-date-range');
        const resetButton = calendarContainer.querySelector('#reset-date-range');

        const dateStartElement = calendarContainer.querySelector('.dateSelected');
        const startMes = dateStartElement.querySelector('.date .mes');
        const startDia = dateStartElement.querySelector('.date .dia');
        const startAnio = dateStartElement.querySelector('.date .anio');
        const startPlaceholder = dateStartElement.querySelector('.placeholder');
        const startDisplay = dateStartElement.querySelector('.date');

        const dateEndElement = document.querySelector('.customdate.date-end .dateSelected');
        let endMes, endDia, endAnio, endPlaceholder, endDisplay;

        if (dateEndElement) {
            endMes = dateEndElement.querySelector('.date .mes');
            endDia = dateEndElement.querySelector('.date .dia');
            endAnio = dateEndElement.querySelector('.date .anio');
            endPlaceholder = dateEndElement.querySelector('.placeholder');
            endDisplay = dateEndElement.querySelector('.date');
        }

        const mesDisplay1 = calendarContainer.querySelector('.month-one .mes-display-1');
        const anioDisplay1 = calendarContainer.querySelector('.month-one .anio-display-1');
        const gridDias1 = calendarContainer.querySelector('.month-one .grid-dias-1');

        const meses = [
            'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
            'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ];

        let currentDisplayDate = new Date(HOY.getFullYear(), HOY.getMonth(), 1);

        // Variables para almacenar las fechas SELECCIONADAS visualmente
        let rangeSelected = {
            start: null,
            end: null
        };
        // Variables para almacenar las fechas CONFIRMADAS en el input
        let rangeConfirmed = {
            start: null,
            end: null
        };


        // --- LÓGICA DE DÍAS Y VISTAS (Se mantiene igual) ---

        function createDateFromDataset(diaElement) {
            const dia = parseInt(diaElement.dataset.dia);
            const mes = parseInt(diaElement.dataset.mes);
            const anio = parseInt(diaElement.dataset.anio);
            const newDate = new Date(anio, mes, dia);
            newDate.setHours(0, 0, 0, 0);
            return newDate;
        }

        // APROXIMADAMENTE LÍNEA 157
        // Formatea la fecha para el display (CAMBIADO para dd/mm/aaaa)
        function formatRangeDate(date) {
            if (!date) return { dia: 'Día', mes: 'Mes', anio: 'Año', full: false };

            // Obtener componentes de la fecha, asegurando dos dígitos con .padStart(2, '0')
            const dia = String(date.getDate()).padStart(2, '0');
            const mes = String(date.getMonth() + 1).padStart(2, '0'); // +1 porque getMonth() es base 0
            const anio = date.getFullYear();

            // El formato deseado es dd/mm/aaaa
            const fullFormattedText = `${dia}/${mes}/${anio}`;

            // Retornamos también los componentes por separado, aunque ya no se usen.
            // Usamos el texto de mes y año directamente del Date para consistencia si se usa.
            return { dia: dia, mes: mes, anio: anio, full: fullFormattedText };
        }

        // Actualiza el texto en los campos de fecha (Ahora usa rangeConfirmed)
        function updateDateDisplays() {
            const startDateInfo = formatRangeDate(rangeConfirmed.start);
            const endDateInfo = formatRangeDate(rangeConfirmed.end);

            // Display de INICIO
            if (rangeConfirmed.start) {
                startPlaceholder.style.display = 'none';
                startDisplay.style.display = 'inline';
                startMes.textContent = startDateInfo.full;
                // Ocultar elementos sobrantes
                startDia.style.display = 'none';
                startAnio.style.display = 'none';
                startDisplay.querySelector('span:nth-child(2)').style.display = 'none';
                startDisplay.querySelector('span:nth-child(4)').style.display = 'none';
            } else {
                startPlaceholder.style.display = 'inline';
                startDisplay.style.display = 'none';
                // Restablecer texto visible (QUITAMOS EL CÓDIGO QUE RESTAURABA LOS TEXTOS 'Mes', 'Día', 'Año')
                startMes.textContent = ''; // Limpiar el contenido por si acaso
                startDia.textContent = ''; // Limpiar el contenido por si acaso
                startAnio.textContent = ''; // Limpiar el contenido por si acaso
                startDia.style.display = 'inline';
                startAnio.style.display = 'inline';
                startDisplay.querySelector('span:nth-child(2)').style.display = 'inline';
                startDisplay.querySelector('span:nth-child(4)').style.display = 'inline';
            }

            // Display de FIN
            if (dateEndElement) {
                if (rangeConfirmed.end) {
                    endPlaceholder.style.display = 'none';
                    endDisplay.style.display = 'inline';
                    endMes.textContent = endDateInfo.full;
                    // Ocultar elementos sobrantes
                    endDia.style.display = 'none';
                    endAnio.style.display = 'none';
                    endDisplay.querySelector('span:nth-child(2)').style.display = 'none';
                    endDisplay.querySelector('span:nth-child(4)').style.display = 'none';
                } else {
                    endPlaceholder.style.display = 'inline';
                    endDisplay.style.display = 'none';
                    // Restablecer texto visible (QUITAMOS EL CÓDIGO QUE RESTAURABA LOS TEXTOS 'Mes', 'Día', 'Año')
                    endMes.textContent = ''; // Limpiar el contenido por si acaso
                    endDia.textContent = ''; // Limpiar el contenido por si acaso
                    endAnio.textContent = ''; // Limpiar el contenido por si acaso
                    endDia.style.display = 'inline';
                    endAnio.style.display = 'inline';
                    endDisplay.querySelector('span:nth-child(2)').style.display = 'inline';
                    endDisplay.querySelector('span:nth-child(4)').style.display = 'inline';
                }
            }
        }

        // Aplica estilos visuales a los días (Usa rangeSelected)
        function applyRangeVisuals() {
            calendarContainer.querySelectorAll('.grid-dias .dia').forEach(el => {
                el.classList.remove('selected', 'range-start', 'range-end', 'in-range');
            });
            if (!rangeSelected.start) return;

            const grids = [gridDias1];

            grids.forEach(grid => {
                const startDay = grid.querySelector(`.dia[data-dia="${rangeSelected.start.getDate()}"][data-mes="${rangeSelected.start.getMonth()}"][data-anio="${rangeSelected.start.getFullYear()}"]`);
                if (startDay) {
                    startDay.classList.add('selected', 'range-start');
                }
                if (rangeSelected.end) {
                    const endDay = grid.querySelector(`.dia[data-dia="${rangeSelected.end.getDate()}"][data-mes="${rangeSelected.end.getMonth()}"][data-anio="${rangeSelected.end.getFullYear()}"]`);
                    if (endDay) {
                        endDay.classList.add('selected', 'range-end');
                    }
                }
            });

            if (rangeSelected.end) {
                const allDays = calendarContainer.querySelectorAll('.grid-dias .dia:not(.empty-day):not(.disabled-day)');

                allDays.forEach(diaElement => {
                    const dayDate = createDateFromDataset(diaElement);

                    const olderDate = Math.min(rangeSelected.start.getTime(), rangeSelected.end.getTime());
                    const newerDate = Math.max(rangeSelected.start.getTime(), rangeSelected.end.getTime());

                    if (dayDate.getTime() > olderDate && dayDate.getTime() < newerDate) {
                        diaElement.classList.add('in-range');
                    }
                });
            }
        }

        // Genera el grid de días (Sin cambios)
        function generarDiasEnHTML(anio, mes, gridDiasContainer) {
            gridDiasContainer.innerHTML = '';
            const primerDiaMes = new Date(anio, mes, 1);
            const diaDeLaSemana = primerDiaMes.getDay();
            const offset = (diaDeLaSemana === 0) ? 6 : diaDeLaSemana - 1;
            const diasEnMes = new Date(anio, mes + 1, 0).getDate();

            for (let i = 0; i < offset; i++) {
                gridDiasContainer.appendChild(document.createElement('div')).className = 'dia empty-day';
            }

            for (let dia = 1; dia <= diasEnMes; dia++) {
                const diaDiv = document.createElement('div');
                diaDiv.className = 'dia';
                diaDiv.textContent = dia;
                diaDiv.dataset.dia = dia;
                diaDiv.dataset.mes = mes;
                diaDiv.dataset.anio = anio;

                const fechaActual = new Date(anio, mes, dia);
                fechaActual.setHours(0, 0, 0, 0);

                if (fechaActual.getTime() > HOY.getTime() || fechaActual.getTime() < UN_ANIO_ATRAS.getTime()) {
                    diaDiv.classList.add('disabled-day');
                } else if (dia === HOY.getDate() && mes === HOY.getMonth() && anio === HOY.getFullYear()) {
                    diaDiv.classList.add('today');
                }

                gridDiasContainer.appendChild(diaDiv);
            }
        }

        // --- LÓGICA DE FLECHAS Y VISTA (Sin cambios relevantes) ---

        function actualizarEstadoFlechas() {

            // LÍMITE IZQUIERDO (Pasado: LIMITE_PASADO_MES)
            if (currentDisplayDate.getTime() <= LIMITE_PASADO_MES.getTime()) {
                arrowLeft.classList.add('disabled-arrow');
                arrowLeft.style.opacity = '0.4';
            } else {
                arrowLeft.classList.remove('disabled-arrow');
                arrowLeft.style.opacity = '1';
            }

            // LÍMITE DERECHO (Futuro: PRIMER_DIA_MES_ACTUAL)
            if (currentDisplayDate.getTime() >= PRIMER_DIA_MES_ACTUAL.getTime()) {
                arrowRight.classList.add('disabled-arrow');
                arrowRight.style.opacity = '0.4';
            } else {
                arrowRight.classList.remove('disabled-arrow');
                arrowRight.style.opacity = '1';
            }
        }

        // NUEVA FUNCIÓN: Controla si el botón de Confirmar debe estar activo
        function actualizarEstadoBotones() {
            // El botón de confirmar se activa si hay al menos una fecha seleccionada
            if (rangeSelected.start) {
                confirmButton.disabled = false;
                resetButton.disabled = false;
            } else if (rangeConfirmed.start) {
                // Si no hay selección visual, pero hay confirmada, se puede restablecer
                confirmButton.disabled = true;
                resetButton.disabled = false;
            } else {
                confirmButton.disabled = true;
                resetButton.disabled = true;
            }
        }

        function actualizarVistaCalendario(anio, mes) {
            currentDisplayDate.setFullYear(anio);
            currentDisplayDate.setMonth(mes);

            mesDisplay1.textContent = meses[mes];
            anioDisplay1.textContent = anio;

            generarDiasEnHTML(anio, mes, gridDias1);
            applyRangeVisuals();
            actualizarEstadoFlechas();
            actualizarEstadoBotones(); // Llamamos al final de la actualización
        }

        // --- FUNCIONES DE ACCIÓN NUEVAS ---

        //function closeCalendar() {
        //    boxSelector.classList.add('d-none');
        //}

        function confirmarRango() {
            // 1. Copiar las fechas seleccionadas al estado confirmado
            rangeConfirmed.start = rangeSelected.start;
            rangeConfirmed.end = rangeSelected.end;

            // 2. Actualizar los displays de los campos de texto
            updateDateDisplays();

            // 3. Cerrar el calendario
            //closeCalendar();

            // 4. Actualizar estado de botones (ya no habrá selección visual)
            actualizarEstadoBotones();
        }

        function restablecerRango() {
            // 1. Limpiar los estados
            rangeSelected.start = null;
            rangeSelected.end = null;
            rangeConfirmed.start = null;
            rangeConfirmed.end = null;

            // 2. Actualizar los displays y la vista
            updateDateDisplays(); // Limpia los campos de texto
            applyRangeVisuals();  // Limpia el resaltado en el calendario
            actualizarEstadoBotones(); // Deshabilita botones

            // 3. Reestablecer la vista del calendario al mes actual (por si acaso)
            initializeCalendarView();
        }

        // --- EVENT LISTENERS ---

        function initializeCalendarView() {
            let anio = HOY.getFullYear();
            let mes = HOY.getMonth();
            currentDisplayDate = new Date(anio, mes, 1);
            actualizarVistaCalendario(anio, mes);

            // Al abrir, restaurar la selección visual a la última fecha confirmada
            rangeSelected.start = rangeConfirmed.start;
            rangeSelected.end = rangeConfirmed.end;
            applyRangeVisuals();
            actualizarEstadoBotones(); // Asegura que el estado del botón refleje la selección.
        }

        dateStartElement.addEventListener('click', function (e) {
            e.stopPropagation();
            //boxSelector.classList.toggle('d-none');
            //if (!boxSelector.classList.contains('d-none')) {
            //    initializeCalendarView();
            //}
        });

        if (dateEndElement) {
            dateEndElement.addEventListener('click', function (e) {
                e.stopPropagation();
                // boxSelector.classList.toggle('d-none');
                // if (!boxSelector.classList.contains('d-none')) {
                //   initializeCalendarView();
                //}
            });
        }

        document.addEventListener('click', function (e) {
            if (!e.target.closest('.boxSelector') &&
                !e.target.closest('.customdate.date-start .dateSelected') &&
                !e.target.closest('.customdate.date-end .dateSelected')) {
                // Al cerrar sin confirmar, se limpia la selección visual, pero se mantiene la confirmada.
                rangeSelected.start = rangeConfirmed.start;
                rangeSelected.end = rangeConfirmed.end;
                applyRangeVisuals();
                actualizarEstadoBotones();
                //closeCalendar();
            }
        });

        // Event listener para la selección de días
        boxSelector.addEventListener('click', function (e) {
            const diaElement = e.target.closest('.dia');

            if (diaElement && diaElement.closest('.grid-dias') &&
                !diaElement.classList.contains('empty-day') && !diaElement.classList.contains('disabled-day')) {

                const selectedDate = createDateFromDataset(diaElement);

                if (!rangeSelected.start || rangeSelected.end) {
                    rangeSelected.start = selectedDate;
                    rangeSelected.end = null;
                }
                else if (rangeSelected.start && !rangeSelected.end) {
                    if (selectedDate.getTime() < rangeSelected.start.getTime()) {
                        rangeSelected.end = rangeSelected.start;
                        rangeSelected.start = selectedDate;
                    }
                    else {
                        rangeSelected.end = selectedDate;
                    }
                }
                // No actualizamos el display aquí, solo la selección visual.
                applyRangeVisuals();
                actualizarEstadoBotones(); // Actualiza el estado del botón Confirmar
            }
        });

        // Event listeners para los botones
        confirmButton.addEventListener('click', confirmarRango);
        resetButton.addEventListener('click', restablecerRango);

        // Navegación de Flechas
        arrowLeft.addEventListener('click', function (e) {
            e.stopPropagation();
            if (arrowLeft.classList.contains('disabled-arrow')) return;
            currentDisplayDate.setMonth(currentDisplayDate.getMonth() - 1);
            actualizarVistaCalendario(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
        });

        arrowRight.addEventListener('click', function (e) {
            e.stopPropagation();
            if (arrowRight.classList.contains('disabled-arrow')) return;
            currentDisplayDate.setMonth(currentDisplayDate.getMonth() + 1);
            actualizarVistaCalendario(currentDisplayDate.getFullYear(), currentDisplayDate.getMonth());
        });

        // Inicialización
        updateDateDisplays();
        actualizarVistaCalendario(HOY.getFullYear(), HOY.getMonth());
    }); 

    document.addEventListener("DOMContentLoaded", function () {
        const filtrosDiv = document.querySelector(".filtros");
        const toggleBtn = document.getElementById("toggleFiltrosBtn");
        const closeBtn = document.querySelector(".close-filtros-btn"); // Selecciona el nuevo botón de cierre

        if (toggleBtn && filtrosDiv) {
            // Listener para el botón que abre/cierra (toggle)
            toggleBtn.addEventListener("click", function () {
                filtrosDiv.classList.toggle("open"); // Alterna la clase 'open' en el div de filtros
                toggleBtn.classList.toggle("active"); // Alterna la clase 'active' en el botón de abrir

                // Cambia la dirección de la flecha en el botón de abrir
                const toggleArrowIcon = toggleBtn.querySelector(".arrow-icon");
                if (filtrosDiv.classList.contains("open")) {
                    toggleArrowIcon.textContent = "▲"; // Flecha hacia arriba cuando está abierto
                } else {
                    toggleArrowIcon.textContent = "▼"; // Flecha hacia abajo cuando está cerrado
                }
            });
        }

        if (closeBtn && filtrosDiv) {
            // Listener para el botón de cerrar
            closeBtn.addEventListener("click", function () {
                filtrosDiv.classList.remove("open"); // Remueve la clase 'open' para cerrar
                if (toggleBtn) { // Asegúrate de que el botón de abrir existe antes de actualizarlo
                    toggleBtn.classList.remove("active"); // Asegura que el botón de abrir no tenga la clase active
                    const toggleArrowIcon = toggleBtn.querySelector(".arrow-icon");
                    if (toggleArrowIcon) {
                        toggleArrowIcon.textContent = "▼"; // Restablece la flecha del botón de abrir
                    }
                }
            });
        }
    });

    const slider = document.querySelector('.bandeja .table-container');

    let isDown = false;
    let startX;
    let scrollLeft;

    slider.addEventListener('mousedown', (e) => {
        isDown = true;
        slider.classList.add('active-dragging');
        startX = e.pageX - slider.offsetLeft;
        scrollLeft = slider.scrollLeft;
    });

    slider.addEventListener('mouseleave', () => {
        isDown = false;
        slider.classList.remove('active-dragging');
    });

    slider.addEventListener('mouseup', () => {
        isDown = false;
        slider.classList.remove('active-dragging');
    });

    slider.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - slider.offsetLeft;
        const walk = (x - startX) * 2; // Multiplica para un arrastre más rápido
        slider.scrollLeft = scrollLeft - walk;
    });

    document.addEventListener('DOMContentLoaded', () => {
        // Selecciona TODOS los contenedores que se repiten
        const contenedores = document.querySelectorAll('.form-item-wrapper');

        // Itera sobre cada uno de esos contenedores
        contenedores.forEach(contenedor => {
            // Busca el input y el botón DENTRO de cada contenedor específico
            const campoEntrada = contenedor.querySelector('.buscar');
            const botonLimpiar = contenedor.querySelector('.clear-button');

            // Asegúrate de que los elementos existan antes de añadir los eventos
            if (campoEntrada && botonLimpiar) {
                campoEntrada.addEventListener('input', () => {
                    if (campoEntrada.value.length > 0) {
                        botonLimpiar.style.display = 'block';
                    } else {
                        botonLimpiar.style.display = 'none';
                    }
                });

                botonLimpiar.addEventListener('click', () => {
                    campoEntrada.value = '';
                    botonLimpiar.style.display = 'none';
                    campoEntrada.focus();
                });
            }
        });
    });

    document.addEventListener('DOMContentLoaded', function () {
        const menuItems = document.querySelectorAll('.filtro-menu > li');

        menuItems.forEach(item => {
            item.addEventListener('click', function (event) {
                // Previene el comportamiento por defecto del enlace, si lo hubiera
                event.stopPropagation();

                const submenu = this.querySelector('.submenu');

                // Cierra otros submenús abiertos
                document.querySelectorAll('.submenu').forEach(sub => {
                    if (sub !== submenu) {
                        sub.style.display = 'none';
                    }
                });

                // Alterna la visibilidad del submenú actual
                if (submenu) {
                    submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                }
            });
        });

        // Cierra el menú si se hace clic fuera de él
        document.addEventListener('click', function () {
            document.querySelectorAll('.submenu').forEach(sub => {
                sub.style.display = 'none';
            });
        });
    });

    // Obtén el elemento contenedor
    const dateContainer = document.querySelector('.dateSelected');

    // Agrega un evento de clic al contenedor
    dateContainer.addEventListener('click', function () {
        // Aquí iría tu lógica actual para obtener la fecha del sistema
        const currentDate = new Date();
        const mes = currentDate.getMonth() + 1; // getMonth() es base 0
        const dia = currentDate.getDate();
        const anio = currentDate.getFullYear();

        // Oculta el texto "Fecha de solicitud"
        const placeholder = this.querySelector('.placeholder');
        if (placeholder) {
            placeholder.style.display = 'none';
        }

        // Muestra el contenedor de la fecha y actualiza los valores
        const dateSpan = this.querySelector('.date');
        if (dateSpan) {
            dateSpan.style.display = 'inline';
            this.querySelector('.mes').textContent = mes;
            this.querySelector('.dia').textContent = dia;
            this.querySelector('.anio').textContent = anio;
        }
    });

    // Obtiene todos los inputs con la clase 'input-placeholder-borrable'
    const inputs = document.querySelectorAll('.filtro-campo');

    // Itera sobre cada input para asignar los eventos
    inputs.forEach(input => {
        // Almacena el texto original del placeholder en un atributo de datos
        const originalPlaceholder = input.placeholder;

        input.addEventListener('focus', function () {
            // Borra el placeholder al recibir el foco
            this.placeholder = '';
        });

        input.addEventListener('blur', function () {
            // Vuelve a mostrar el placeholder si el campo está vacío
            if (this.value === '') {
                this.placeholder = originalPlaceholder;
            }
        });
    });
