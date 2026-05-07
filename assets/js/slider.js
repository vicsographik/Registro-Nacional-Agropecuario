document.addEventListener('DOMContentLoaded', () => {
  const track = document.getElementById('sliderTrack');
  const dotsContainer = document.getElementById('sliderDots');
  if (!track || !dotsContainer) return;

  const slides = track.querySelectorAll('.slider__slide');
  const dots = dotsContainer.querySelectorAll('.slider__dot');
  let current = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  const swipeThreshold = 50;

  function goTo(index) {
    if (index < 0 || index >= slides.length) return;

    slides[current].classList.remove('slider__slide--active');
    slides[current].setAttribute('aria-hidden', 'true');
    dots[current].classList.remove('slider__dot--active');
    dots[current].setAttribute('aria-selected', 'false');

    current = index;

    slides[current].classList.add('slider__slide--active');
    slides[current].removeAttribute('aria-hidden');
    dots[current].classList.add('slider__dot--active');
    dots[current].setAttribute('aria-selected', 'true');

    if (window.innerWidth > 767.9) {
      const activeWidth = 770;
      const inactiveWidth = 590;
      const margin = 24;
      let offset = (track.parentElement.offsetWidth / 2) - (activeWidth / 2);
      offset -= current * (inactiveWidth + margin);
      track.style.transform = `translateX(${offset}px)`;
    } else {
      const slideWidth = slides[0].offsetWidth + (16 * 2);
      track.style.transform = `translateX(-${current * slideWidth}px)`;
    }
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => goTo(i));
    dot.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        goTo((current + 1) % slides.length);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        goTo((current - 1 + slides.length) % slides.length);
      } else if (e.key === 'Home') {
        e.preventDefault();
        goTo(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        goTo(slides.length - 1);
      }
    });
  });

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const delta = touchStartX - touchEndX;
    if (Math.abs(delta) < swipeThreshold) return;
    if (delta > 0) {
      goTo(Math.min(current + 1, slides.length - 1));
    } else {
      goTo(Math.max(current - 1, 0));
    }
  }, { passive: true });

  // Seleccionar los botones
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');

  // Agregar los eventos de clic
  if (prevBtn && nextBtn) {
    prevBtn.addEventListener('click', () => {
      // Va al anterior, o al último si está en el primero (opcional)
      const targetIndex = (current - 1 + slides.length) % slides.length;
      goTo(targetIndex);
    });

    nextBtn.addEventListener('click', () => {
      // Va al siguiente, o al primero si está en el último (opcional)
      const targetIndex = (current + 1) % slides.length;
      goTo(targetIndex);
    });
  }

  window.addEventListener('resize', () => goTo(current));
  goTo(0);
});