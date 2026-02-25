// E S T E. E S. E L. A R C H I V O. O R I G I N A L

function actualizarPosicionMenu() {
    const elementosMenu = document.querySelectorAll('a.menu-btn');
    
    if (elementosMenu.length === 0) {
        console.warn('No se encontraron elementos con clase "menu-btn"');
        return;
    }
    
    if (window.innerWidth > 1441) {
        const anchoVentana = window.innerWidth;
        const calculo = ((anchoVentana - 1440) / 2) + 190;
        
        elementosMenu.forEach(elemento => {
            elemento.style.right = `${calculo}px`;
        });
        
        console.log(`Aplicado: ${calculo}px a ${elementosMenu.length} elementos`);
    } else {
        elementosMenu.forEach(elemento => {
            elemento.style.right = '';
        });
    }
}

// Ejecutar inmediatamente
actualizarPosicionMenu();

// Ejecutar cada 100ms durante 2 segundos hasta que los elementos existan
let intentos = 0;
const intervalo = setInterval(() => {
    const elementosMenu = document.querySelectorAll('a.menu-btn');
    if (elementosMenu.length > 0 || intentos >= 20) {
        clearInterval(intervalo);
        if (elementosMenu.length > 0) {
            actualizarPosicionMenu();
        }
    }
    intentos++;
}, 100);

// Redimensionamiento
window.addEventListener('resize', actualizarPosicionMenu);

// Cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', actualizarPosicionMenu);

// Cuando todo esté cargado
window.addEventListener('load', actualizarPosicionMenu);