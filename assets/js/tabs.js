document.addEventListener('DOMContentLoaded', function () {

  function getActiveClass(tabGroup) {
    return tabGroup.classList.contains('tabs--rojo') ? 'activeRojo' : 'active';
  }

  function handleTabClick(e) {
    const clickedTab = e.currentTarget;
    const targetId = clickedTab.dataset.divid;

    const tabGroup = clickedTab.closest('.tabscajaTabs');
    if (!tabGroup) return;

    const activeClass = getActiveClass(tabGroup);

    // Quita cualquier estado activo previo
    tabGroup.querySelectorAll('.customTabs li').forEach(tab => {
      tab.classList.remove('active', 'activeRojo');
    });

    // Activa la pestaña clicada con la clase correcta
    clickedTab.classList.add(activeClass);

    // Oculta las cajas de este grupo
    tabGroup.querySelectorAll('.cajaTabs').forEach(caja => {
      caja.classList.add('d-none');
    });

    // Muestra el contenido correspondiente
    const targetContent = tabGroup.querySelector(`.cajaTabs.visible_${targetId}`);
    if (targetContent) {
      targetContent.classList.remove('d-none');
    }

    // Inicializa tabs anidadas si existen
    const nestedTabs = targetContent ? targetContent.querySelector('.tabscajaTabs') : null;
    if (nestedTabs) {
      initializeTabs(nestedTabs);
    }

    e.stopPropagation();
  }

  function initializeTabs(tabGroup) {
    const firstTab = tabGroup.querySelector('.customTabs li:first-child');
    if (!firstTab) return;

    const activeClass = getActiveClass(tabGroup);
    const targetId = firstTab.dataset.divid;

    // Limpia estados activos
    tabGroup.querySelectorAll('.customTabs li').forEach(tab => {
      tab.classList.remove('active', 'activeRojo');
    });

    // Activa la primera tab con la clase correcta
    firstTab.classList.add(activeClass);

    // Oculta todo
    tabGroup.querySelectorAll('.cajaTabs').forEach(caja => {
      caja.classList.add('d-none');
    });

    // Muestra el primer contenido
    const targetContent = tabGroup.querySelector(`.cajaTabs.visible_${targetId}`);
    if (targetContent) {
      targetContent.classList.remove('d-none');
    }

    // Escucha clics
    tabGroup.querySelectorAll('.customTabs li').forEach(tab => {
      tab.removeEventListener('click', handleTabClick);
      tab.addEventListener('click', handleTabClick);
    });
  }

  document.querySelectorAll('.tabscajaTabs').forEach(tabGroup => {
    initializeTabs(tabGroup);
  });

});

document.addEventListener('DOMContentLoaded', function () {
  function handleTabClick(e) {
    const clickedTab = e.currentTarget;
    const targetId = clickedTab.dataset.divid;
    const tabsContainer = clickedTab.closest('.tabsContainer');

    // Tabs active
    tabsContainer.querySelectorAll('.customTabs span').forEach(tab => {
      tab.classList.remove('active');
    });
    clickedTab.classList.add('active');

    // Oculta SOLO paneles del nivel actual
    tabsContainer.querySelectorAll(':scope > .tabPanel').forEach(panel => {
      panel.classList.add('d-none');
    });

    // Muestra el panel destino
    const targetContent = tabsContainer.querySelector(`:scope > .visible_${targetId}`);
    if (targetContent) {
      targetContent.classList.remove('d-none');

      // Si hay subtabs dentro, inicializa/activa el primero
      const nestedTabs = targetContent.querySelector('.tabsContainer');
      if (nestedTabs) {
        const firstSubTab = nestedTabs.querySelector('.customTabs span:first-child');
        if (firstSubTab) firstSubTab.click();
      }
    }

    e.stopPropagation();
  }

  function initializeTabs(container) {
    const firstTab = container.querySelector('.customTabs span:first-child');
    if (firstTab) {
      const targetId = firstTab.dataset.divid;

      container.querySelectorAll('.customTabs span').forEach(tab => tab.classList.remove('active'));
      firstTab.classList.add('active');

      container.querySelectorAll(':scope > .tabPanel').forEach(panel => panel.classList.add('d-none'));

      const targetContent = container.querySelector(`:scope > .visible_${targetId}`);
      if (targetContent) {
        targetContent.classList.remove('d-none');

        const nestedTabs = targetContent.querySelector('.tabsContainer');
        if (nestedTabs) initializeTabs(nestedTabs);
      }
    }

    container.querySelectorAll('.customTabs span').forEach(tab => {
      tab.addEventListener('click', handleTabClick);
    });
  }

  document.querySelectorAll('.tabsContainer').forEach(container => {
    initializeTabs(container);
  });
});

