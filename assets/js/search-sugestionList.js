// Seleccionamos todos los inputs que tengan nuestra clase de referencia
const searchInputs = document.querySelectorAll('.js-input');

searchInputs.forEach(input => {
    input.addEventListener('input', () => {
        const query = input.value.trim();
        
        // Subimos al contenedor principal (form) para no perdernos entre hermanos/hijos
        const parentForm = input.closest('.search-container');
        
        // Buscamos la lista dentro de ese formulario específico
        const suggestionsList = parentForm.querySelector('.js-list');

        if (query.length > 0) {
            suggestionsList.classList.remove('is-hidden');
            // Opcional: Para accesibilidad en el Modelo 1
            input.setAttribute('aria-expanded', 'true');
        } else {
            suggestionsList.classList.add('is-hidden');
            input.setAttribute('aria-expanded', 'false');
        }
    });
});

// Cerrar listas al hacer clic fuera de cualquier buscador
document.addEventListener('click', (event) => {
    searchInputs.forEach(input => {
        const parentForm = input.closest('.search-container');
        const suggestionsList = parentForm.querySelector('.js-list');
        
        if (!parentForm.contains(event.target)) {
            suggestionsList.classList.add('is-hidden');
            input.setAttribute('aria-expanded', 'false');
        }
    });
});


// Creamos el observador
const resizeObserver = new ResizeObserver(entries => {
    for (let entry of entries) {
        // Obtenemos el input que cambió de tamaño
        const inputElement = entry.target;
        
        // Buscamos el formulario padre y luego la lista
        const parentForm = inputElement.closest('.search-container');
        const suggestionsList = parentForm.querySelector('.js-list');

        if (suggestionsList) {
            // Aplicamos el ancho exacto del input (en píxeles) a la lista
            const width = entry.contentRect.width;
            suggestionsList.style.width = `${width}px`;
        }
    }
});

// Le decimos al observador que vigile todos tus inputs de búsqueda
document.querySelectorAll('.sh0r.js-input').forEach(input => {
    resizeObserver.observe(input);
});