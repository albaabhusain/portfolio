/* ═══════════════════════════════════════════════════
   ALBAAB HUSAIN PORTFOLIO — THREE.JS PARTICLE NETWORK
   Hero background: floating nodes connected by lines,
   evokes distributed systems / cloud architecture.
   ═══════════════════════════════════════════════════ */

(function () {
  'use strict';

  // Bail out if reduced motion is preferred or Three.js isn't loaded
  if (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
    typeof THREE === 'undefined'
  ) {
    return;
  }

  const canvas = document.getElementById('heroCanvas');
  if (!canvas) return;

  /* ── Config ── */
  const CONFIG = {
    particleCount: 120,
    connectionDistance: 160,
    particleSize: 1.8,
    speed: 0.15,
    lineOpacity: 0.25,
    mouseInfluence: 80,
    rotationSpeed: 0.0003,
  };

  /* ── Scene Setup ── */
  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);

  const scene  = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);
  camera.position.z = 400;

  /* ── Geometry Helpers ── */
  function getThemeAccent() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return isDark ? 0x818cf8 : 0x6366f1;
  }

  /* ── Particles ── */
  const particlePositions = [];
  const particleVelocities = [];
  const particleGeo = new THREE.BufferGeometry();
  const positions = new Float32Array(CONFIG.particleCount * 3);

  for (let i = 0; i < CONFIG.particleCount; i++) {
    const x = (Math.random() - 0.5) * 800;
    const y = (Math.random() - 0.5) * 600;
    const z = (Math.random() - 0.5) * 200;

    positions[i * 3]     = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    particlePositions.push({ x, y, z });
    particleVelocities.push({
      x: (Math.random() - 0.5) * CONFIG.speed,
      y: (Math.random() - 0.5) * CONFIG.speed,
      z: (Math.random() - 0.5) * CONFIG.speed * 0.3,
    });
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: getThemeAccent(),
    size: CONFIG.particleSize,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.85,
  });

  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  /* ── Connection Lines ── */
  const lineGeo  = new THREE.BufferGeometry();
  const linePositions = new Float32Array(CONFIG.particleCount * CONFIG.particleCount * 6);
  lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));

  const lineMat = new THREE.LineSegments(
    lineGeo,
    new THREE.LineBasicMaterial({
      color: getThemeAccent(),
      transparent: true,
      opacity: CONFIG.lineOpacity,
    })
  );
  scene.add(lineMat);

  /* ── Mouse Tracking ── */
  const mouse = { x: 0, y: 0, active: false };

  window.addEventListener('mousemove', (e) => {
    mouse.active = true;
    mouse.x = (e.clientX / window.innerWidth  - 0.5) * 600;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * -400;
  });

  /* ── Resize ── */
  function resize() {
    const hero = canvas.parentElement;
    const w = hero ? hero.offsetWidth  : window.innerWidth;
    const h = hero ? hero.offsetHeight : window.innerHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }

  window.addEventListener('resize', resize, { passive: true });
  resize();

  /* ── Theme change observer ── */
  const themeObserver = new MutationObserver(() => {
    const accent = getThemeAccent();
    particleMat.color.setHex(accent);
    lineMat.material.color.setHex(accent);
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  /* ── Animation Loop ── */
  let frameId;
  let tick = 0;

  function animate() {
    frameId = requestAnimationFrame(animate);
    tick++;

    const posArr = particleGeo.attributes.position.array;
    let lineIdx  = 0;

    // Update particles
    for (let i = 0; i < CONFIG.particleCount; i++) {
      const p = particlePositions[i];
      const v = particleVelocities[i];

      // Mouse repulsion
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < CONFIG.mouseInfluence) {
          const force = (CONFIG.mouseInfluence - dist) / CONFIG.mouseInfluence * 0.3;
          v.x += (dx / dist) * force;
          v.y += (dy / dist) * force;
        }
      }

      // Drift
      p.x += v.x;
      p.y += v.y;
      p.z += v.z;

      // Dampen
      v.x *= 0.98;
      v.y *= 0.98;
      v.z *= 0.98;

      // Wrap boundaries
      if (p.x >  400) p.x = -400;
      if (p.x < -400) p.x =  400;
      if (p.y >  300) p.y = -300;
      if (p.y < -300) p.y =  300;
      if (p.z >  100) p.z = -100;
      if (p.z < -100) p.z =  100;

      posArr[i * 3]     = p.x;
      posArr[i * 3 + 1] = p.y;
      posArr[i * 3 + 2] = p.z;
    }

    particleGeo.attributes.position.needsUpdate = true;

    // Update connection lines
    const linesArr = lineGeo.attributes.position.array;
    lineIdx = 0;

    for (let i = 0; i < CONFIG.particleCount; i++) {
      for (let j = i + 1; j < CONFIG.particleCount; j++) {
        const pi = particlePositions[i];
        const pj = particlePositions[j];
        const dx = pi.x - pj.x;
        const dy = pi.y - pj.y;
        const dz = pi.z - pj.z;
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (dist < CONFIG.connectionDistance && lineIdx < linesArr.length - 5) {
          linesArr[lineIdx++] = pi.x;
          linesArr[lineIdx++] = pi.y;
          linesArr[lineIdx++] = pi.z;
          linesArr[lineIdx++] = pj.x;
          linesArr[lineIdx++] = pj.y;
          linesArr[lineIdx++] = pj.z;
        }
      }
    }

    // Clear remaining line segments
    for (let k = lineIdx; k < linesArr.length; k++) {
      linesArr[k] = 0;
    }

    lineGeo.attributes.position.needsUpdate = true;
    lineGeo.setDrawRange(0, lineIdx / 3);

    // Gentle rotation of the whole particle system
    particles.rotation.y += CONFIG.rotationSpeed;
    lineMat.rotation.y   += CONFIG.rotationSpeed;

    renderer.render(scene, camera);
  }

  animate();

  /* ── Pause when not visible ── */
  const pageObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (!frameId) animate();
        } else {
          cancelAnimationFrame(frameId);
          frameId = null;
        }
      });
    },
    { threshold: 0 }
  );

  pageObserver.observe(canvas);

})();
