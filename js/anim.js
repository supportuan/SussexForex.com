(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.documentElement.classList.add('anim');

  var started = false;
  var bootTimer = null;
  var safetyTimer = null;

  function clean() {
    document.documentElement.classList.remove('anim', 'go');
    if (safetyTimer) {
      clearTimeout(safetyTimer);
      safetyTimer = null;
    }
    document.removeEventListener('animationend', onEnd, true);
  }

  function onEnd(e) {
    if (e.animationName === 'pillIn' && e.target.classList.contains('btn-ghost')) {
      clean();
    }
  }

  function start() {
    if (started) return;
    started = true;
    if (bootTimer) {
      clearTimeout(bootTimer);
      bootTimer = null;
    }
    document.addEventListener('animationend', onEnd, true);
    safetyTimer = setTimeout(clean, 2600);
    document.documentElement.classList.add('go');
  }

  function boot() {
    bootTimer = setTimeout(start, 900);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(start, start);
    } else {
      start();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
