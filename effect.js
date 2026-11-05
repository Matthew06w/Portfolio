/* =========================================================
   EDGE DIFFUSION — project images smear, split into RGB and
   dissolve into the page background near the viewport edges,
   and stay perfectly sharp in the middle of the screen.

   How it fits the page: one hidden WebGL canvas does the drawing,
   then each result is copied into a small 2D canvas placed right
   after its <img>. The real <img> stays in the DOM (invisible, with
   its alt text), so rounded corners, labels, hover zoom and the
   reveal animation all keep working.
   ========================================================= */
(function(){
  "use strict";

  /* ---- TWEAK THESE ---- */
  var ZONE                = 0.22;  // size of the top/bottom effect zone, as a fraction of viewport height
  var ZONE_X              = 0.05;  // same for the left/right sides, as a fraction of viewport width (0 = off)
  var STRETCH_STRENGTH    = 0.5;   // how far pixels are pulled, as a fraction of the zone
  var STRETCH_POWER       = 2.0;   // how tightly the smear hugs the edge; keep STRENGTH × POWER ≤ 1 or the image folds over itself
  var DISPERSION_STRENGTH = 0.03;  // biggest red/blue split, as a fraction of viewport height (0 = no rainbow)
  var FADE_STRENGTH       = 1.0;   // how fully it dissolves at the edge (0 = no fade, 1 = solid background colour)
  var BACKGROUND_COLOR    = null;  // null follows the page's --bg (light and dark mode); or force one, e.g. '#FFFFFF'
  var SCROLL_EASE         = 0.12;  // how quickly the effect catches up with scrolling (lower = floatier, 1 = no easing)
  var MAX_LAG             = 0.04;  // the most the effect may trail behind scrolling, as a fraction of viewport height
  var MAX_DPR             = 2;     // caps canvas resolution on high-density phones
  var RIPPLE_STRENGTH     = 2.5;   // liquid hover: how far pixels wobble, in CSS px (0 = off)
  var RIPPLE_RADIUS       = 120;   // liquid hover: how far the ripple spreads from the mouse, in CSS px
  var RIPPLE_WAVELENGTH   = 42;    // liquid hover: distance between ripple rings, in CSS px
  var RIPPLE_SPEED        = 5;     // liquid hover: how fast the rings move outward
  var RIPPLE_EASE         = 0.08;  // liquid hover: how gently the ripple starts and settles
  var NEAR_MARGIN         = '25%'; // only images within this distance of the viewport are rendered
  var SELECTOR            = '.card-media img, .featured-media img.fm'; // which images get the effect

  var root = document.documentElement;

  // Reduced motion or no WebGL: normal images with the CSS edge fade (see effect.css)
  function useFallback(){ root.classList.add('fx-fallback'); }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return useFallback();
  var glCanvas = document.createElement('canvas');
  var gl = glCanvas.getContext('webgl', { alpha:true, premultipliedAlpha:true, antialias:false });
  if (!gl) return useFallback();

  /* ---- Shaders ---- */
  var VERT =
    'attribute vec2 aPos;' +
    'varying vec2 vUv;' +
    'void main(){ vUv = aPos; gl_Position = vec4(aPos.x * 2.0 - 1.0, 1.0 - aPos.y * 2.0, 0.0, 1.0); }';

  var FRAG = [
    '#ifdef GL_FRAGMENT_PRECISION_HIGH',
    'precision highp float;',
    '#else',
    'precision mediump float;',
    '#endif',
    'varying vec2 vUv;',           // 0–1 across this image's canvas, top-left origin
    'uniform sampler2D uTex;',
    'uniform vec4 uRect;',         // canvas position in the viewport, CSS px: x, y, width, height
    'uniform vec2 uView;',         // viewport size, CSS px
    'uniform vec4 uMap;',          // canvas position → texture position (object-fit): scale xy, offset xy
    'uniform vec2 uZone;',         // effect zone size, CSS px: x, y
    'uniform float uStretch;',
    'uniform float uPower;',
    'uniform float uDisp;',
    'uniform float uFade;',
    'uniform vec3 uBg;',
    'uniform vec2 uMouse;',        // mouse position in the viewport, CSS px
    'uniform vec4 uLiquid;',       // ripple: strength, radius, ring frequency, time phase

    // 1 at the edge, easing to 0 at the end of the zone (the brief's 1 - t)
    'float edge(float d, float z){ return z <= 0.0 ? 0.0 : 1.0 - smoothstep(0.0, z, d); }',
    // Linear rather than smoothstep, so the smear is strongest right at the edge
    'float pull(float d, float z){ return z <= 0.0 ? 0.0 : pow(1.0 - clamp(d / z, 0.0, 1.0), uPower); }',

    // Reads the image at a viewport position; letterbox areas (object-fit: contain) come back empty
    'vec4 sample(vec2 p){',
    '  vec2 uv = (clamp(p, uRect.xy, uRect.xy + uRect.zw) - uRect.xy) / uRect.zw;',
    '  uv = uv * uMap.xy + uMap.zw;',
    '  vec2 inside = step(vec2(0.0), uv) * step(uv, vec2(1.0));',
    '  return texture2D(uTex, uv) * inside.x * inside.y;',
    '}',

    'void main(){',
    '  vec2 p = uRect.xy + vUv * uRect.zw;',
    '  float dL = p.x, dR = uView.x - p.x, dT = p.y, dB = uView.y - p.y;',

    // Stretch: read from further inside the image, so pixels look dragged toward the edge
    '  vec2 pulled = vec2(pull(dL, uZone.x) - pull(dR, uZone.x), pull(dT, uZone.y) - pull(dB, uZone.y));',
    '  vec2 q = p + pulled * uZone * uStretch;',

    // Liquid hover: rings spreading out from the mouse, fading away with distance
    '  if (uLiquid.x > 0.0){',
    '    vec2 fromMouse = p - uMouse;',
    '    float dist = length(fromMouse) + 0.001;',
    '    float falloff = exp(-(dist * dist) / (uLiquid.y * uLiquid.y));',
    '    q += fromMouse / dist * sin(dist * uLiquid.z - uLiquid.w) * falloff * uLiquid.x;',
    '  }',

    // Dispersion: red and blue read either side of green, further apart near the edge
    '  float eL = edge(dL, uZone.x), eR = edge(dR, uZone.x), eT = edge(dT, uZone.y), eB = edge(dB, uZone.y);',
    '  vec2 split = vec2(eL - eR, eT - eB) * uDisp;',
    '  vec4 r = sample(q + split), g = sample(q), b = sample(q - split);',
    '  vec3 col = vec3(r.r, g.g, b.b);',
    '  float a = max(max(r.a, g.a), b.a);',

    // Fade: dissolve into the background colour (texture is premultiplied, so bg is too)
    '  float e = max(max(eL, eR), max(eT, eB));',
    '  gl_FragColor = vec4(mix(col, uBg * a, e * uFade), a);',
    '}'
  ].join('\n');

  function compile(type, src){
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  }
  var program = gl.createProgram();
  gl.attachShader(program, compile(gl.VERTEX_SHADER, VERT));
  gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAG));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return useFallback();
  gl.useProgram(program);

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0,0, 1,0, 0,1, 1,1]), gl.STATIC_DRAW);
  var aPos = gl.getAttribLocation(program, 'aPos');
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);
  gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

  var u = {};
  ['uRect', 'uView', 'uMap', 'uZone', 'uStretch', 'uPower', 'uDisp', 'uFade', 'uBg', 'uMouse', 'uLiquid'].forEach(function(name){
    u[name] = gl.getUniformLocation(program, name);
  });
  gl.uniform1f(u.uStretch, STRETCH_STRENGTH);
  gl.uniform1f(u.uPower, STRETCH_POWER);
  gl.uniform1f(u.uFade, FADE_STRENGTH);

  var maxTexture = gl.getParameter(gl.MAX_TEXTURE_SIZE);

  /* ---- Background colour (follows the light / dark switch) ---- */
  var bg = [0, 0, 0];
  var bgKey = '';
  function readBackground(){
    var hex = (BACKGROUND_COLOR || getComputedStyle(root).getPropertyValue('--bg')).trim().replace('#', '');
    if (hex.length === 3) hex = hex.replace(/./g, '$&$&');
    var n = parseInt(hex, 16);
    if (isNaN(n)) return;
    bg = [(n >> 16 & 255) / 255, (n >> 8 & 255) / 255, (n & 255) / 255];
    bgKey = hex;
    gl.uniform3fv(u.uBg, bg);
  }
  readBackground();
  new MutationObserver(readBackground).observe(root, { attributes:true, attributeFilter:['data-theme'] });

  /* ---- Set up each image ---- */
  var entries = [];
  var nearObserver = new IntersectionObserver(function(changes){
    changes.forEach(function(c){ c.target._fx.near = c.isIntersecting; });
  }, { rootMargin: NEAR_MARGIN + ' 0px' });

  document.querySelectorAll(SELECTOR).forEach(function(img){
    // WebGL only ever sees a GIF's first frame, so animated demos keep playing with the CSS fade
    if (/\.gif(\?|$)/i.test(img.getAttribute('src'))){ img.classList.add('fx-static'); return; }

    var canvas = document.createElement('canvas');
    canvas.className = 'fx-canvas';
    canvas.setAttribute('aria-hidden', 'true');
    img.classList.add('fx-src');
    img.parentNode.insertBefore(canvas, img.nextSibling);

    var entry = { img:img, canvas:canvas, ctx:canvas.getContext('2d'), tex:null, texScale:0, near:false, key:'', map:null, hover:false, ripple:0, mx:0, my:0 };
    img._fx = entry;
    img.addEventListener('load', function(){ entry.key = ''; entry.tex = null; entry.texScale = 0; });

    // Mouse only: on touch screens a ripple would just get in the way of scrolling
    var host = img.parentNode;
    host.addEventListener('pointermove', function(e){
      if (e.pointerType !== 'mouse') return;
      entry.hover = true;
      entry.mx = e.clientX;
      entry.my = e.clientY;
    }, { passive:true });
    host.addEventListener('pointerleave', function(){ entry.hover = false; });
    nearObserver.observe(img);
    entries.push(entry);
  });

  // Stop using WebGL for one image, e.g. the browser refused to read it (see the file:// note below)
  function giveUp(entry){
    entry.failed = true;
    entry.img.classList.remove('fx-src', 'fx-live');
    entry.img.classList.add('fx-static');
    entry.canvas.remove();
    nearObserver.unobserve(entry.img);
  }

  /* ---- Upload an image, shrunk to about the size it's shown at (keeps it crisp and light on memory) ---- */
  function upload(entry, w, h, dpr){
    var img = entry.img;
    var iw = img.naturalWidth, ih = img.naturalHeight;
    var cover = getComputedStyle(img).objectFit !== 'contain';
    var fit = cover ? Math.max(w / iw, h / ih) : Math.min(w / iw, h / ih);

    // canvas position → texture position, centred like object-position: 50% 50%
    var sx = w / (iw * fit), sy = h / (ih * fit);
    entry.map = [sx, sy, 0.5 * (1 - sx), 0.5 * (1 - sy)];

    var scale = Math.min(1, fit * dpr * 1.25, maxTexture / Math.max(iw, ih));
    if (entry.tex && scale <= entry.texScale * 1.3) return true;   // already sharp enough

    var source = img;
    if (scale < 0.9){
      source = document.createElement('canvas');
      source.width = Math.max(1, Math.round(iw * scale));
      source.height = Math.max(1, Math.round(ih * scale));
      var c = source.getContext('2d');
      c.imageSmoothingQuality = 'high';
      c.drawImage(img, 0, 0, source.width, source.height);
    }

    var tex = entry.tex || gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    try {
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
    } catch (err) {
      // Pages opened straight from a file (file://) can't read images into WebGL; use http://localhost or the live site
      giveUp(entry);
      return false;
    }
    entry.tex = tex;
    entry.texScale = scale;
    return true;
  }

  /* ---- Draw one image ---- */
  function render(entry, lag, vw, vh, dpr, now){
    var img = entry.img, canvas = entry.canvas;
    if (!img.complete || !img.naturalWidth) return;
    if (img.classList.contains('fm') && !img.classList.contains('active')) return;  // EDUBin tab not showing

    var cssW = canvas.offsetWidth, cssH = canvas.offsetHeight;
    if (!cssW || !cssH) return;                                                     // filtered out of the grid

    // Measured every frame, so hover zoom, the reveal animation and resizes all stay aligned
    var rect = canvas.getBoundingClientRect();
    var top = rect.top + lag;    // the effect trails the real scroll position slightly
    var key = [cssW, cssH, rect.left.toFixed(1), top.toFixed(1), rect.width.toFixed(1), vw, vh, dpr, bgKey,
               entry.ripple ? now : 0].join();   // a rippling image redraws every frame
    if (key === entry.key) return;                                                  // nothing moved, nothing to redraw

    var w = Math.round(cssW * dpr), h = Math.round(cssH * dpr);
    if (!upload(entry, cssW, cssH, dpr)) return;

    if (canvas.width !== w || canvas.height !== h){ canvas.width = w; canvas.height = h; }
    if (glCanvas.width < w || glCanvas.height < h){
      glCanvas.width = Math.max(glCanvas.width, w);
      glCanvas.height = Math.max(glCanvas.height, h);
    }

    gl.viewport(0, glCanvas.height - h, w, h);   // top-left corner of the shared canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.bindTexture(gl.TEXTURE_2D, entry.tex);
    gl.uniform4f(u.uRect, rect.left, top, rect.width, rect.height);
    gl.uniform2f(u.uView, vw, vh);
    gl.uniform4fv(u.uMap, entry.map);
    gl.uniform2f(u.uZone, ZONE_X * vw, ZONE * vh);
    gl.uniform1f(u.uDisp, DISPERSION_STRENGTH * vh);
    gl.uniform2f(u.uMouse, entry.mx, entry.my + lag);
    gl.uniform4f(u.uLiquid, entry.ripple * RIPPLE_STRENGTH, RIPPLE_RADIUS, 2 * Math.PI / RIPPLE_WAVELENGTH, now / 1000 * RIPPLE_SPEED);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

    entry.ctx.clearRect(0, 0, w, h);
    entry.ctx.drawImage(glCanvas, 0, 0, w, h, 0, 0, w, h);
    entry.key = key;

    // Only hide the real image once its canvas has something on it
    img.classList.add('fx-live');
  }

  /* ---- Render loop: eases the scroll value, pauses while the tab is hidden ---- */
  var easedScroll = window.scrollY;
  var frame = 0;
  var lastTime = 0;
  function tick(now){
    frame = requestAnimationFrame(tick);
    // Time-based, so the easing feels the same on slow phones and 120 Hz screens
    var frames = lastTime ? Math.min((now - lastTime) / (1000 / 60), 10) : 1;
    lastTime = now;
    var vw = root.clientWidth, vh = window.innerHeight;

    var scroll = window.scrollY;
    easedScroll += (scroll - easedScroll) * (1 - Math.pow(1 - SCROLL_EASE, frames));
    // Big jumps (nav links) must not drag the distortion into the middle of the screen
    var maxLag = MAX_LAG * vh;
    easedScroll = Math.max(scroll - maxLag, Math.min(scroll + maxLag, easedScroll));
    if (Math.abs(scroll - easedScroll) < 0.1) easedScroll = scroll;

    var lag = scroll - easedScroll;
    var dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    for (var i = 0; i < entries.length; i++){
      var entry = entries[i];
      if (!entry.near || entry.failed) continue;
      // Ease the ripple in and out so it doesn't pop when the mouse enters or leaves
      entry.ripple += ((entry.hover ? 1 : 0) - entry.ripple) * (1 - Math.pow(1 - RIPPLE_EASE, frames));
      if (!entry.hover && entry.ripple < 0.01) entry.ripple = 0;
      render(entry, lag, vw, vh, dpr, now);
    }
  }
  function start(){ if (!frame && !document.hidden) frame = requestAnimationFrame(tick); }
  function stop(){ cancelAnimationFrame(frame); frame = 0; lastTime = 0; }

  document.addEventListener('visibilitychange', function(){ document.hidden ? stop() : start(); });
  // Nothing to do on scroll itself: tick() reads the position. This just wakes a stopped loop promptly.
  window.addEventListener('scroll', start, { passive:true });

  // If the graphics context dies (common on phones under memory pressure), go back to normal images
  glCanvas.addEventListener('webglcontextlost', function(){
    stop();
    entries.forEach(function(entry){ if (!entry.failed) giveUp(entry); });
    entries = [];
    useFallback();
  });

  start();
})();
