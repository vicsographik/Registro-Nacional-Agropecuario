    const contenedor = document.querySelector('.tablaResponsiva--horizontal');
    const ths = document.querySelectorAll('.tablaResponsiva__colFija');

    contenedor.addEventListener('scroll', () => {
      if (contenedor.scrollLeft > 0) {
        ths.forEach(th => th.classList.add('colFija--sombreado'));
      } else {
        ths.forEach(th => th.classList.remove('colFija--sombreado'));
      }
    });