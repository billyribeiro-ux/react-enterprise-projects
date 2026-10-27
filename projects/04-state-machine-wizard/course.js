// Principal Engineer Level 8++ Standalone Course Telemetry & Three.js Runtime
(function initStandaloneCourse() {
  let activeMesh = null;
  const canvas = document.getElementById('project-3d-canvas');
  const pulseBtn = document.getElementById('btn-pulse-sim');

  if (canvas && typeof THREE !== 'undefined') {
    let gl = null;
    try {
      gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    } catch (_e) {
      gl = null;
    }
    if (gl) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 360 / 220, 0.1, 100);
      camera.position.z = 3.5;
      const renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
      renderer.setSize(360, 220);

      const mode = "svg_dfa";
      let geo;
      if (mode.includes('globe') || mode.includes('spatial')) {
        geo = new THREE.SphereGeometry(1.0, 24, 24);
      } else if (mode.includes('orderbook') || mode.includes('grid')) {
        geo = new THREE.PlaneGeometry(2.2, 1.5, 12, 12);
      } else if (mode.includes('vault')) {
        geo = new THREE.IcosahedronGeometry(0.95, 1);
      } else {
        geo = new THREE.TorusKnotGeometry(0.75, 0.24, 100, 24);
      }
      const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
      activeMesh = new THREE.Mesh(geo, mat);
      scene.add(activeMesh);

      const animate = () => {
        activeMesh.rotation.x += 0.007;
        activeMesh.rotation.y += 0.011;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      };
      animate();
    }
  }

  if (pulseBtn) {
    pulseBtn.addEventListener('click', () => {
      if (activeMesh && typeof gsap !== 'undefined') {
        gsap.fromTo(
          activeMesh.scale,
          { x: 1.35, y: 1.35, z: 1.35 },
          { x: 1, y: 1, z: 1, duration: 0.75, ease: 'elastic.out(1, 0.4)' }
        );
      }
    });
  }

  document.querySelectorAll('.copy-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-copy-target');
      const codeEl = targetId ? document.getElementById(targetId) : null;
      if (!codeEl) return;
      navigator.clipboard.writeText(codeEl.textContent || '');
      const orig = btn.textContent;
      btn.textContent = 'Copied 100%!';
      setTimeout(() => {
        btn.textContent = orig;
      }, 1500);
    });
  });
})();
