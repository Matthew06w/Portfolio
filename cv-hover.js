/* =========================================================
   DETECTION BOX — computer-vision style corner brackets that
   track the mouse over project images, labelled with the
   project's name and the live x / y position.
   Works on GIFs too, and doesn't need WebGL. Styles: effect.css
   ========================================================= */
(function(){
  "use strict";

  /* ---- TWEAK THESE ---- */
  var BOX_W      = 92;    // box size at rest, in px
  var BOX_H      = 68;
  var SPEED_GROW = 0.35;  // how much the box stretches when the mouse moves fast (0 = fixed size)
  var MAX_GROW   = 36;    // the most it can stretch, in px
  var EASE       = 0.18;  // how quickly it catches up with the mouse (lower = more lag, 1 = locked on)
  var SELECTOR   = '.card-media, .featured-media';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) EASE = 1;

  var active = null;   // the box currently following the mouse
  var frame = 0;

  function setup(host){
    var titleEl = host.parentNode.querySelector('h3');
    var box = document.createElement('span');
    box.className = 'cv-box';
    box.setAttribute('aria-hidden', 'true');
    var label = document.createElement('span');
    label.className = 'cv-label';
    var name = document.createElement('span');
    name.className = 'cv-name';
    name.textContent = titleEl ? titleEl.textContent : '';
    var coords = document.createElement('span');
    coords.className = 'cv-coords';
    label.appendChild(name);
    label.appendChild(coords);
    box.appendChild(label);
    host.insertBefore(box, host.firstChild);   // first in the card, so the existing labels stay on top

    var state = { host:host, box:box, label:label, coords:coords, tx:0, ty:0, x:0, y:0, w:BOX_W, h:BOX_H, placed:false };

    host.addEventListener('pointermove', function(e){
      if (e.pointerType !== 'mouse') return;
      var r = host.getBoundingClientRect();
      state.tx = e.clientX - r.left;
      state.ty = e.clientY - r.top;
      // Start on the mouse rather than sliding in from the corner
      if (!state.placed){ state.x = state.tx; state.y = state.ty; state.placed = true; }
      box.classList.add('on');
      active = state;
      if (!frame) frame = requestAnimationFrame(tick);
    }, { passive:true });

    host.addEventListener('pointerleave', function(){
      box.classList.remove('on');
      state.placed = false;
      if (active === state) active = null;
    });
  }

  function tick(){
    frame = 0;
    var s = active;
    if (!s) return;
    frame = requestAnimationFrame(tick);

    var dx = s.tx - s.x, dy = s.ty - s.y;
    s.x += dx * EASE;
    s.y += dy * EASE;

    // Stretch along the direction of travel, like a tracker struggling to keep up
    s.w += (BOX_W + Math.min(Math.abs(dx) * SPEED_GROW, MAX_GROW) - s.w) * 0.2;
    s.h += (BOX_H + Math.min(Math.abs(dy) * SPEED_GROW, MAX_GROW) - s.h) * 0.2;

    // Keep the whole box, and the label above it, inside the image
    var hw = s.host.clientWidth, hh = s.host.clientHeight;
    var left = Math.max(4, Math.min(hw - s.w - 4, s.x - s.w / 2));
    var top = Math.max(24, Math.min(hh - s.h - 4, s.y - s.h / 2));

    s.box.style.width = s.w.toFixed(1) + 'px';
    s.box.style.height = s.h.toFixed(1) + 'px';
    s.box.style.transform = 'translate(' + left.toFixed(1) + 'px,' + top.toFixed(1) + 'px)';
    s.coords.textContent = 'x:' + Math.round(s.x) + ' y:' + Math.round(s.y);
    // Near the right edge, line the label up with the box's right side so it isn't cut off
    s.box.classList.toggle('flip', left + s.label.offsetWidth > hw - 4);
  }

  document.querySelectorAll(SELECTOR).forEach(setup);
})();
