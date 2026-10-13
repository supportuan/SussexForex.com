(function () {
  var navLinks = document.getElementById('navLinks');
  var megaWrap = document.getElementById('navMegaWrap');
  var panels = document.querySelectorAll('#navMega .nav-panel');
  var navItems = document.querySelectorAll('.nav-item');
  var desktopNav = window.matchMedia('(min-width: 1161px)');
  var closeTimer = null;

  function showDesktopPanel(id) {
    if (!megaWrap) return;
    panels.forEach(function (panel) {
      panel.classList.toggle('is-visible', panel.id === id);
    });
    navItems.forEach(function (item) {
      var on = item.getAttribute('data-panel') === id;
      item.classList.toggle('is-active', on);
      var trigger = item.querySelector('.nav-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    megaWrap.classList.add('is-open');
    megaWrap.setAttribute('aria-hidden', 'false');
  }

  function hideDesktopPanels() {
    if (!megaWrap) return;
    megaWrap.classList.remove('is-open');
    megaWrap.setAttribute('aria-hidden', 'true');
    panels.forEach(function (panel) {
      panel.classList.remove('is-visible');
    });
    navItems.forEach(function (item) {
      item.classList.remove('is-active');
      var trigger = item.querySelector('.nav-trigger');
      if (trigger) trigger.setAttribute('aria-expanded', 'false');
    });
  }

  function scheduleDesktopClose() {
    clearTimeout(closeTimer);
    closeTimer = setTimeout(hideDesktopPanels, 130);
  }

  function cancelDesktopClose() {
    clearTimeout(closeTimer);
  }

  if (navLinks && megaWrap && navItems.length) {
    navItems.forEach(function (item) {
      item.addEventListener('mouseenter', function () {
        if (!desktopNav.matches) return;
        cancelDesktopClose();
        showDesktopPanel(item.getAttribute('data-panel'));
      });
      var trigger = item.querySelector('.nav-trigger');
      if (trigger) {
        trigger.addEventListener('focus', function () {
          if (!desktopNav.matches) return;
          cancelDesktopClose();
          showDesktopPanel(item.getAttribute('data-panel'));
        });
      }
    });

    navLinks.addEventListener('mouseleave', function () {
      if (!desktopNav.matches) return;
      scheduleDesktopClose();
    });

    megaWrap.addEventListener('mouseenter', cancelDesktopClose);
    megaWrap.addEventListener('mouseleave', function () {
      if (!desktopNav.matches) return;
      scheduleDesktopClose();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && desktopNav.matches && megaWrap.classList.contains('is-open')) {
        hideDesktopPanels();
      }
    });
  }
})();

(function () {
  var menu = document.getElementById('menu');
  var menuDetail = document.getElementById('menuDetail');
  if (!menu || !menuDetail) return;

  var mobileTriggers = menu.querySelectorAll('.menu-trigger');
  var openMobileTrigger = null;

  function resetMobilePanel() {
    menuDetail.classList.remove('is-open');
    menuDetail.hidden = true;
    menuDetail.innerHTML = '';
    mobileTriggers.forEach(function (trigger) {
      trigger.classList.remove('is-open');
    });
    openMobileTrigger = null;
  }

  mobileTriggers.forEach(function (trigger) {
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var panelId = trigger.getAttribute('data-panel');
      var source = document.getElementById(panelId);
      if (!source) return;

      if (openMobileTrigger === trigger && menuDetail.classList.contains('is-open')) {
        resetMobilePanel();
        return;
      }

      mobileTriggers.forEach(function (t) {
        t.classList.remove('is-open');
      });
      trigger.classList.add('is-open');
      openMobileTrigger = trigger;
      menuDetail.innerHTML = source.innerHTML;
      menuDetail.classList.add('is-open');
      menuDetail.hidden = false;
    });
  });

  window.resetMobileNavPanel = resetMobilePanel;
})();

(function () {
  var burger = document.getElementById('burger');
  var menu = document.getElementById('menu');
  if (!burger || !menu) return;

  function set(open) {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', open ? 'true' : 'false');
    burger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    if (!open && window.resetMobileNavPanel) window.resetMobileNavPanel();
  }

  burger.addEventListener('click', function (e) {
    e.stopPropagation();
    set(!menu.classList.contains('open'));
  });

  menu.addEventListener('click', function (e) {
    if (e.target.closest('.menu-trigger')) return;
    if (e.target.closest('a')) set(false);
  });

  document.addEventListener('click', function (e) {
    if (!menu.classList.contains('open')) return;
    if (menu.contains(e.target) || burger.contains(e.target)) return;
    set(false);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      set(false);
      burger.focus();
    }
  });
})();
