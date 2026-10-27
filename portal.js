// Principal Engineer Level 8++ Master Studio Portal Runtime (Zero Inline CSS/JS)
(function initMasterPortal() {
  const allProjects = window.ENTERPRISE_PROJECTS_DATA || [];
  let activeProject = allProjects[0];
  let threeScene = null;
  let threeMesh = null;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
  }

  function setupThreeStage() {
    const canvas = document.getElementById('studio-3d-canvas');
    if (!canvas || typeof THREE === 'undefined') return;
    let gl = null;
    try {
      gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    } catch (_e) {
      gl = null;
    }
    if (!gl) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 380 / 230, 0.1, 100);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
    renderer.setSize(380, 230);
    threeScene = scene;

    updateThreeGeometry(activeProject ? activeProject.visualMode : 'three_shader');

    function animate() {
      if (threeMesh) {
        threeMesh.rotation.x += 0.007;
        threeMesh.rotation.y += 0.012;
      }
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();
  }

  function updateThreeGeometry(mode) {
    if (!threeScene || typeof THREE === 'undefined') return;
    if (threeMesh) {
      threeScene.remove(threeMesh);
      if (threeMesh.geometry) threeMesh.geometry.dispose();
      if (threeMesh.material) threeMesh.material.dispose();
    }
    let geometry;
    let colorHex = 0x38bdf8;
    if (mode.includes('globe') || mode.includes('spatial')) {
      geometry = new THREE.SphereGeometry(1.05, 24, 24);
      colorHex = 0x4ade80;
    } else if (mode.includes('orderbook') || mode.includes('grid')) {
      geometry = new THREE.PlaneGeometry(2.3, 1.5, 14, 14);
      colorHex = 0x10b981;
    } else if (mode.includes('vault') || mode.includes('rbac')) {
      geometry = new THREE.IcosahedronGeometry(0.95, 1);
      colorHex = 0x818cf8;
    } else if (mode.includes('radar') || mode.includes('kpi')) {
      geometry = new THREE.OctahedronGeometry(0.95, 2);
      colorHex = 0x38bdf8;
    } else {
      geometry = new THREE.TorusKnotGeometry(0.76, 0.24, 110, 24);
      colorHex = 0x38bdf8;
    }
    const material = new THREE.MeshBasicMaterial({ color: colorHex, wireframe: true });
    threeMesh = new THREE.Mesh(geometry, material);
    threeScene.add(threeMesh);
    triggerGsapShockwave();
  }

  function triggerGsapShockwave() {
    if (threeMesh && typeof gsap !== 'undefined') {
      gsap.fromTo(
        threeMesh.scale,
        { x: 1.38, y: 1.38, z: 1.38 },
        { x: 1, y: 1, z: 1, duration: 0.75, ease: 'elastic.out(1, 0.4)' }
      );
    }
  }

  const pulseBtn = document.getElementById('btn-pulse-shockwave');
  if (pulseBtn) {
    pulseBtn.addEventListener('click', triggerGsapShockwave);
  }

  function renderActiveProject(proj) {
    activeProject = proj;
    document.getElementById('hero-domain').textContent = `PROJECT ${proj.num} • ${proj.domain}`;
    document.getElementById('hero-title').textContent = proj.title;
    document.getElementById('hero-desc').textContent = proj.desc;
    document.getElementById('standalone-link').href = proj.standaloneUrl;
    document.getElementById('sim-mode-label').textContent = `MODE: ${proj.visualMode.toUpperCase()} • 120FPS WEBGL`;
    document.getElementById('arch-overview').textContent = proj.architecture;
    document.getElementById('arch-security').textContent = proj.performanceAndSecurity;
    document.getElementById('cli-quick-cmd').textContent =
      `cd projects/${proj.id} && pnpm prisma db push && pnpm db:seed && pnpm test:unit`;

    const kpiContainer = document.getElementById('hero-kpis');
    kpiContainer.innerHTML = proj.kpis.map((k) => `
      <div class="kpi-box">
        <div class="kpi-box-label">${escapeHtml(k.label)}</div>
        <div class="kpi-box-val">${escapeHtml(k.value)}</div>
        <div class="kpi-box-trend">${escapeHtml(k.trend)}</div>
        <progress class="kpi-progress" value="${k.pct}" max="100"></progress>
      </div>
    `).join('');

    const deepDiveEl = document.getElementById('arch-deep-dive');
    deepDiveEl.innerHTML = proj.deepDive.map((d) => `<li>${escapeHtml(d)}</li>`).join('');

    const stepsContainer = document.getElementById('steps-container');
    stepsContainer.innerHTML = proj.steps.map((s, idx) => {
      const codeId = `step-full-code-${idx}`;
      return `
        <article class="step-card">
          <div class="step-top">
            <div>
              <span class="step-tag">STEP 0${s.stepNumber} • ${escapeHtml(s.file)}</span>
              <h3 class="step-title">${escapeHtml(s.title)}</h3>
              <p class="step-rationale">${escapeHtml(s.rationale)}</p>
            </div>
            <button type="button" class="action-btn copy-code-trigger" data-code-id="${codeId}">
              Copy Full File
            </button>
          </div>
          <pre><code id="${codeId}">${escapeHtml(s.code)}</code></pre>
        </article>
      `;
    }).join('');

    stepsContainer.querySelectorAll('.copy-code-trigger').forEach((btn) => {
      btn.addEventListener('click', () => {
        const cid = btn.getAttribute('data-code-id');
        const el = cid ? document.getElementById(cid) : null;
        if (!el) return;
        navigator.clipboard.writeText(el.textContent || '');
        const prev = btn.textContent;
        btn.textContent = 'Copied 100% Full Code!';
        setTimeout(() => { btn.textContent = prev; }, 1400);
      });
    });

    updateThreeGeometry(proj.visualMode);
    renderNavList(document.getElementById('project-filter').value);
  }

  function renderNavList(filterText = '') {
    const nav = document.getElementById('project-nav');
    const q = filterText.trim().toLowerCase();
    nav.innerHTML = allProjects
      .filter((p) => !q || p.title.toLowerCase().includes(q) || p.domain.toLowerCase().includes(q) || p.id.includes(q))
      .map((p) => `
        <button
          type="button"
          class="nav-btn ${activeProject && activeProject.id === p.id ? 'active' : ''}"
          data-proj-id="${p.id}"
        >
          <span class="nav-num">${p.num}</span>
          <span class="nav-label">${escapeHtml(p.title)}</span>
        </button>
      `).join('');

    nav.querySelectorAll('.nav-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const pid = btn.getAttribute('data-proj-id');
        const found = allProjects.find((p) => p.id === pid);
        if (found) renderActiveProject(found);
      });
    });
  }

  document.getElementById('project-filter').addEventListener('input', (e) => {
    renderNavList(e.target.value);
  });

  if (allProjects.length > 0) {
    setupThreeStage();
    renderActiveProject(allProjects[0]);
  }
})();
