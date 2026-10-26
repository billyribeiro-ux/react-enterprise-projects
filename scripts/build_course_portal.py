#!/usr/bin/env python3
"""
Principal Engineer Level 8+ (Oct 26, 2026) — Master Interactive Course Studio Portal Generator
Generates root `projects-data.js` and `index.html` with 100% untruncated project files,
L8+ Architecture Deep-Dive telemetry, and Hollywood/Apple/Netflix Three.js + GSAP + 2D/3D KPI simulations.
"""

import json
from pathlib import Path
from build_projects import PROJECTS, ROOT, DB_TS, STYLES_CSS


def build_portal_data() -> list[dict]:
    portal_projects = []
    for p in PROJECTS:
        proj_dir = ROOT / "projects" / p["id"]
        e2e_path = proj_dir / "tests" / "e2e.spec.ts"
        e2e_code = e2e_path.read_text() if e2e_path.exists() else ""

        file_map = {
            "prisma/schema.prisma": p["prisma_schema"].strip(),
            "prisma/seed.ts": p["seed_ts"].strip(),
            "src/db.ts": DB_TS.strip(),
            "src/styles.css": STYLES_CSS.strip(),
            "src/actions.ts": p["actions_ts"].strip(),
            f"src/{p['component_name']}.tsx": p["component_ts"].strip(),
            "tests/unit.test.tsx": p["unit_test_ts"].strip(),
            "tests/e2e.spec.ts": e2e_code.strip(),
        }

        enriched_steps = []
        for idx, step in enumerate(p["steps"], start=1):
            target_file = step["file"]
            if target_file.startswith("tests/"):
                full_code = (
                    f"// === FILE: tests/unit.test.tsx ===\n{file_map['tests/unit.test.tsx']}\n\n"
                    f"// === FILE: tests/e2e.spec.ts ===\n{file_map['tests/e2e.spec.ts']}"
                )
            elif target_file == "src/actions.ts":
                full_code = (
                    f"// === FILE: src/db.ts ===\n{file_map['src/db.ts']}\n\n"
                    f"// === FILE: src/actions.ts ===\n{file_map['src/actions.ts']}"
                )
            elif target_file.endswith(".tsx"):
                full_code = (
                    f"/* === FILE: src/styles.css === */\n{file_map['src/styles.css']}\n\n"
                    f"// === FILE: {target_file} ===\n{file_map.get(target_file, '')}"
                )
            else:
                full_code = file_map.get(target_file, "")

            enriched_steps.append(
                {
                    "stepNumber": idx,
                    "title": step["title"],
                    "rationale": step["rationale"],
                    "file": target_file,
                    "code": full_code,
                }
            )

        portal_projects.append(
            {
                "id": p["id"],
                "num": p["num"],
                "title": p["title"],
                "domain": p["domain"],
                "desc": p["desc"],
                "visualMode": p["VisualMode"],
                "componentName": p["component_name"],
                "kpis": p["kpis"],
                "architecture": p["architecture"],
                "deepDive": p["deepDive"],
                "performanceAndSecurity": p["performanceAndSecurity"],
                "standaloneUrl": f"projects/{p['id']}/index.html",
                "steps": enriched_steps,
                "files": file_map,
            }
        )
    return portal_projects


MASTER_INDEX_HTML = """<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Principal Engineer Level 8+ (Oct 2026) — 20 Enterprise React 19, Next.js, Prisma v6, Three.js &amp; GSAP Course Studio</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <script src="projects-data.js"></script>
  <style>
    :root {
      --bg-950: #050811;
      --bg-900: #0b1120;
      --bg-850: #111827;
      --border: rgba(56, 189, 248, 0.18);
      --cyan: #38bdf8;
      --indigo: #6366f1;
      --emerald: #4ade80;
      --rose: #f43f5e;
      --text: #f8fafc;
      --muted: #94a3b8;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at 80% 0%, #1e1b4b 0%, var(--bg-950) 50%);
      color: var(--text);
      display: grid;
      grid-template-columns: 330px 1fr;
      min-height: 100vh;
    }
    @media (max-width: 1024px) {
      body { grid-template-columns: 1fr; }
    }
    aside {
      background: rgba(11, 17, 32, 0.92);
      border-right: 1px solid var(--border);
      padding: 1.5rem 1rem;
      height: 100vh;
      position: sticky;
      top: 0;
      overflow-y: auto;
    }
    .brand-badge {
      font-size: 0.7rem;
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      color: var(--cyan);
      display: block;
      margin-bottom: 0.3rem;
    }
    .brand-title {
      font-size: 1.15rem;
      font-weight: 900;
      margin: 0 0 1rem;
    }
    .search-box {
      width: 100%;
      padding: 0.65rem 0.85rem;
      border-radius: 10px;
      background: #050811;
      color: var(--text);
      border: 1px solid var(--border);
      margin-bottom: 1rem;
      font-size: 0.85rem;
    }
    .nav-list {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
    }
    .nav-btn {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      text-align: left;
      padding: 0.7rem 0.85rem;
      border-radius: 10px;
      background: transparent;
      color: var(--muted);
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.18s ease;
    }
    .nav-btn:hover {
      background: rgba(56, 189, 248, 0.08);
      color: var(--text);
    }
    .nav-btn.active {
      background: rgba(56, 189, 248, 0.16);
      color: var(--text);
      border-color: var(--cyan);
      font-weight: 700;
    }
    .nav-num {
      font-family: monospace;
      font-size: 0.78rem;
      color: var(--cyan);
      font-weight: 800;
    }
    main {
      padding: 2.25rem 2.5rem;
      max-width: 1360px;
      width: 100%;
    }
    .hero-banner {
      display: grid;
      grid-template-columns: 1.25fr 0.75fr;
      gap: 1.75rem;
      margin-bottom: 2rem;
    }
    @media (max-width: 1100px) {
      .hero-banner { grid-template-columns: 1fr; }
    }
    .glass-panel {
      background: rgba(13, 19, 34, 0.84);
      border: 1px solid var(--border);
      border-radius: 20px;
      padding: 1.75rem;
      backdrop-filter: blur(16px);
    }
    .domain-pill {
      display: inline-block;
      font-size: 0.72rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--cyan);
      background: rgba(56, 189, 248, 0.12);
      padding: 0.3rem 0.7rem;
      border-radius: 99px;
      margin-bottom: 0.6rem;
    }
    #hero-title {
      font-size: 2rem;
      font-weight: 900;
      margin: 0.25rem 0 0.65rem;
    }
    #hero-desc {
      color: var(--muted);
      font-size: 0.98rem;
      margin: 0 0 1.4rem;
      line-height: 1.6;
    }
    .kpi-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.9rem;
    }
    .kpi-box {
      background: rgba(5, 8, 17, 0.75);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: 12px;
      padding: 0.9rem;
    }
    .kpi-box-label { font-size: 0.7rem; color: var(--muted); text-transform: uppercase; }
    .kpi-box-val { font-size: 1.4rem; font-weight: 900; color: var(--cyan); margin: 0.2rem 0; }
    .kpi-box-trend { font-size: 0.72rem; color: var(--emerald); font-weight: 700; }
    .kpi-bar { height: 5px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-top: 0.5rem; overflow: hidden; }
    .kpi-fill { height: 100%; background: linear-gradient(90deg, var(--cyan), var(--emerald)); }
    .arch-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1.5rem;
      margin-bottom: 2rem;
    }
    @media (max-width: 960px) { .arch-grid { grid-template-columns: 1fr; } }
    .action-btn {
      background: var(--cyan);
      color: #050811;
      font-weight: 800;
      border: none;
      padding: 0.6rem 1.1rem;
      border-radius: 9px;
      cursor: pointer;
      text-decoration: none;
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      font-size: 0.84rem;
    }
    .action-btn.secondary {
      background: rgba(56, 189, 248, 0.14);
      color: var(--cyan);
      border: 1px solid var(--cyan);
    }
    .step-card {
      background: rgba(13, 19, 34, 0.88);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 1.6rem;
      margin-bottom: 1.5rem;
    }
    .step-top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 0.9rem;
    }
    .step-tag {
      font-family: monospace;
      color: var(--emerald);
      font-size: 0.78rem;
      font-weight: 700;
    }
    pre {
      background: #04070f;
      color: #e2e8f0;
      padding: 1.25rem;
      border-radius: 12px;
      overflow-x: auto;
      border: 1px solid rgba(255,255,255,0.08);
      font-size: 0.83rem;
      line-height: 1.55;
      margin: 0;
    }
  </style>
</head>
<body>
  <aside aria-label="20 Enterprise Projects Curriculum Navigation">
    <span class="brand-badge">Distinguished Principal L8+</span>
    <h1 class="brand-title">Oct 2026 React 19 &amp; 3D Studio</h1>
    <input
      type="search"
      id="project-filter"
      class="search-box"
      placeholder="Filter 20 projects (e.g. WebGL, Prisma, CRDT)..."
      aria-label="Filter 20 Enterprise Projects"
    />
    <div id="project-nav" class="nav-list" role="navigation"></div>
  </aside>

  <main>
    <section class="hero-banner">
      <div class="glass-panel">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:0.75rem;">
          <span id="hero-domain" class="domain-pill"></span>
          <a id="standalone-link" class="action-btn secondary" href="#" target="_blank" rel="noopener">
            Open Standalone Project Course HTML ↗
          </a>
        </div>
        <h2 id="hero-title"></h2>
        <p id="hero-desc"></p>
        <div id="hero-kpis" class="kpi-row"></div>
      </div>

      <div class="glass-panel" style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <span class="brand-badge" id="sim-mode-label">THREE.JS WEBGL + GSAP TELEMETRY</span>
        <canvas id="studio-3d-canvas" width="380" height="230" aria-label="Interactive 3D Telemetry Stage"></canvas>
        <div style="display:flex;gap:0.75rem;margin-top:0.85rem;">
          <button type="button" class="action-btn" onclick="triggerGsapShockwave()">
            Pulse GSAP 3D Shockwave
          </button>
        </div>
      </div>
    </section>

    <section class="arch-grid">
      <div class="glass-panel">
        <span class="brand-badge">Principal Engineer L8+ Architecture &amp; Trade-Offs</span>
        <p id="arch-overview" style="color:#e2e8f0;line-height:1.65;"></p>
        <span class="brand-badge" style="margin-top:1rem;">Sub-16ms Performance, Zero-Trust Security &amp; WCAG 2.2 AAA</span>
        <p id="arch-security" style="color:var(--muted);margin-bottom:0;line-height:1.6;"></p>
      </div>
      <div class="glass-panel">
        <span class="brand-badge">Oct 26, 2026 Implementation Mechanics</span>
        <ul id="arch-deep-dive" style="color:#e2e8f0;line-height:1.65;padding-left:1.2rem;margin-bottom:0;"></ul>
      </div>
    </section>

    <section class="glass-panel" style="margin-bottom:2rem;">
      <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem;">
        <div>
          <span class="brand-badge">macOS Terminal • pnpm 12 + Node 24 LTS + Prisma v6 + GitHub CLI (gh)</span>
          <h3 style="margin:0.25rem 0 0;font-size:1.15rem;">Quick-Run Workspace Verification Commands</h3>
        </div>
        <code id="cli-quick-cmd" style="background:#04070f;padding:0.6rem 1rem;border-radius:8px;color:var(--emerald);font-size:0.82rem;"></code>
      </div>
    </section>

    <section>
      <h2 style="font-size:1.55rem;font-weight:900;margin-bottom:1.2rem;">
        Complete Step-by-Step Follow-Along Blueprint (100% Untruncated Source Files)
      </h2>
      <div id="steps-container"></div>
    </section>
  </main>

  <script>
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
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 380 / 230, 0.1, 100);
      camera.position.z = 3.6;

      const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
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

    function copyCodeBlock(codeId, btn) {
      const el = document.getElementById(codeId);
      if (!el) return;
      navigator.clipboard.writeText(el.textContent);
      const prev = btn.textContent;
      btn.textContent = 'Copied 100% Full Code!';
      setTimeout(() => { btn.textContent = prev; }, 1400);
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
          <div class="kpi-bar"><div class="kpi-fill" style="width:${k.pct}%"></div></div>
        </div>
      `).join('');

      const deepDiveEl = document.getElementById('arch-deep-dive');
      deepDiveEl.innerHTML = proj.deepDive.map((d) => `<li style="margin-bottom:0.5rem;">${escapeHtml(d)}</li>`).join('');

      const stepsContainer = document.getElementById('steps-container');
      stepsContainer.innerHTML = proj.steps.map((s, idx) => {
        const codeId = `step-full-code-${idx}`;
        return `
          <article class="step-card">
            <div class="step-top">
              <div>
                <span class="step-tag">STEP 0${s.stepNumber} • ${escapeHtml(s.file)}</span>
                <h3 style="margin:0.25rem 0;font-size:1.2rem;">${escapeHtml(s.title)}</h3>
                <p style="margin:0;color:var(--muted);font-size:0.9rem;">${escapeHtml(s.rationale)}</p>
              </div>
              <button type="button" class="action-btn" onclick="copyCodeBlock('${codeId}', this)">
                Copy Full File
              </button>
            </div>
            <pre><code id="${codeId}">${escapeHtml(s.code)}</code></pre>
          </article>
        `;
      }).join('');

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
            onclick="selectProjectById('${p.id}')"
          >
            <span class="nav-num">${p.num}</span>
            <span style="font-size:0.84rem;line-height:1.3;">${escapeHtml(p.title)}</span>
          </button>
        `).join('');
    }

    window.selectProjectById = function(id) {
      const found = allProjects.find((p) => p.id === id);
      if (found) renderActiveProject(found);
    };

    document.getElementById('project-filter').addEventListener('input', (e) => {
      renderNavList(e.target.value);
    });

    if (allProjects.length > 0) {
      setupThreeStage();
      renderActiveProject(allProjects[0]);
    }
  </script>
</body>
</html>
"""


def main() -> None:
    portal_data = build_portal_data()
    js_payload = "window.ENTERPRISE_PROJECTS_DATA = " + json.dumps(portal_data, indent=2) + ";\n"
    (ROOT / "projects-data.js").write_text(js_payload)
    (ROOT / "index.html").write_text(MASTER_INDEX_HTML)
    print(f"Successfully generated Master Course Studio index.html and projects-data.js for {len(portal_data)} projects.")


if __name__ == "__main__":
    main()
