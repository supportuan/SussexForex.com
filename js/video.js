(function () {
  var a = document.getElementById('bgVideoA');
  var b = document.getElementById('bgVideoB');
  if (!a || !b) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    a.removeAttribute('autoplay');
    a.pause();
    b.pause();
    try {
      a.currentTime = 0;
    } catch (err) {}
    return;
  }

  var FADE = 0.9;
  var cur = a;
  var nxt = b;
  var swapping = false;

  function play(v) {
    var p = v.play();
    if (p && typeof p.catch === 'function') p.catch(function () {});
  }

  play(a);

  function tick() {
    if (swapping || !cur.duration) return;
    if (cur.duration - cur.currentTime > FADE) return;

    swapping = true;
    var out = cur;
    nxt.currentTime = 0;
    play(nxt);
    nxt.classList.add('is-active');
    out.classList.remove('is-active');

    var tmp = cur;
    cur = nxt;
    nxt = tmp;

    setTimeout(function () {
      out.pause();
      out.currentTime = 0;
      swapping = false;
    }, FADE * 1000 + 100);
  }

  a.addEventListener('timeupdate', tick);
  b.addEventListener('timeupdate', tick);
})();
