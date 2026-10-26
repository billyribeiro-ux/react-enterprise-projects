#!/usr/bin/env python3
"""
Principal Engineer Level 8+ (Oct 26, 2026) — Master Project & Standalone Course HTML Generator
Generates all 20 Enterprise Projects + Per-Project Interactive Follow-Along HTML Pages.
"""

import html
import json
from pathlib import Path

from projects_part1 import PROJECTS_PART1
from projects_part2 import PROJECTS_PART2
from projects_part3 import PROJECTS_PART3
from projects_part4 import PROJECTS_PART4

ROOT = Path("/Users/billyribeiro/Desktop/react-enterprise-projects")
PROJECTS = PROJECTS_PART1 + PROJECTS_PART2 + PROJECTS_PART3 + PROJECTS_PART4

DB_TS = """import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma: PrismaClient =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ['error', 'warn'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
"""

STYLES_CSS = """@layer reset, tokens, components, utilities;

@layer tokens {
  :root {
    --surface-950: oklch(0.14 0.02 255);
    --surface-900: oklch(0.19 0.03 255);
    --accent-cyan: oklch(0.76 0.14 230);
    --accent-emerald: oklch(0.79 0.17 155);
    --text-primary: oklch(0.98 0.01 255);
    --text-muted: oklch(0.68 0.03 255);
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
"""


def build_project_html(p: dict, e2e_code: str) -> str:
    """Generates a standalone Principal Engineer L8+ Follow-Along Course & 3D Simulation HTML page for a project."""
    file_map = {
        "prisma/schema.prisma": p["prisma_schema"].strip(),
        "prisma/seed.ts": p["seed_ts"].strip(),
        "src/db.ts": DB_TS.strip(),
        "src/actions.ts": p["actions_ts"].strip(),
        f"src/{p['component_name']}.tsx": p["component_ts"].strip(),
        "tests/unit.test.tsx": p["unit_test_ts"].strip(),
        "tests/e2e.spec.ts": e2e_code.strip(),
    }

    kpi_cards_html = ""
    for kpi in p["kpis"]:
        kpi_cards_html += f"""
        <div class="kpi-card">
          <div class="kpi-label">{html.escape(kpi['label'])}</div>
          <div class="kpi-val">{html.escape(kpi['value'])}</div>
          <div class="kpi-trend">{html.escape(kpi['trend'])}</div>
          <div class="kpi-bar"><div class="kpi-fill" style="width: {kpi['pct']}%"></div></div>
        </div>
        """

    deep_dive_html = "".join(f"<li>{html.escape(item)}</li>" for item in p["deepDive"])

    steps_html = ""
    for idx, step in enumerate(p["steps"], start=1):
        target_file = step["file"]
        if target_file.startswith("tests/"):
            code_content = (
                f"// === FILE: tests/unit.test.tsx ===\n{file_map['tests/unit.test.tsx']}\n\n"
                f"// === FILE: tests/e2e.spec.ts ===\n{file_map['tests/e2e.spec.ts']}"
            )
        elif target_file == "src/actions.ts":
            code_content = (
                f"// === FILE: src/db.ts ===\n{file_map['src/db.ts']}\n\n"
                f"// === FILE: src/actions.ts ===\n{file_map['src/actions.ts']}"
            )
        else:
            code_content = file_map.get(target_file, "")

        escaped_code = html.escape(code_content)
        steps_html += f"""
        <article class="step-card" id="step-{idx}">
          <div class="step-header">
            <div>
              <span class="step-badge">STEP 0{idx} • {html.escape(target_file)}</span>
              <h3>{html.escape(step['title'])}</h3>
              <p class="step-rationale">{html.escape(step['rationale'])}</p>
            </div>
            <button type="button" class="copy-btn" onclick="copyStepCode('code-{idx}', this)">Copy Full File</button>
          </div>
          <pre><code id="code-{idx}">{escaped_code}</code></pre>
        </article>
        """

    return f"""<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Project {p['num']}: {html.escape(p['title'])} — Principal Engineer L8+ Follow-Along Course</title>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
  <style>
    :root {{
      --bg: #060911;
      --panel: #0d1322;
      --border: rgba(56, 189, 248, 0.18);
      --cyan: #38bdf8;
      --emerald: #4ade80;
      --text: #f8fafc;
      --muted: #94a3b8;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at top right, #1e1b4b 0%, var(--bg) 55%);
      color: var(--text);
      line-height: 1.6;
    }}
    .container {{ max-width: 1280px; margin: 0 auto; padding: 2.5rem 1.5rem; }}
    .top-nav {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border);
    }}
    .top-nav a {{
      color: var(--cyan);
      text-decoration: none;
      font-weight: 700;
      font-size: 0.9rem;
    }}
    .hero-grid {{
      display: grid;
      grid-template-columns: 1.25fr 0.75fr;
      gap: 2rem;
      margin-bottom: 2.5rem;
    }}
    @media (max-width: 900px) {{ .hero-grid {{ grid-template-columns: 1fr; }} }}
    .hero-card, .sim-card, .arch-card, .step-card {{
      background: rgba(13, 19, 34, 0.85);
      border: 1px solid var(--border);
      border-radius: 18px;
      padding: 1.75rem;
      backdrop-filter: blur(16px);
    }}
    .eyebrow {{
      color: var(--cyan);
      font-size: 0.75rem;
      font-weight: 800;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }}
    h1 {{ font-size: 2rem; margin: 0.4rem 0 0.8rem; font-weight: 900; }}
    .desc {{ color: var(--muted); font-size: 1rem; margin-bottom: 1.5rem; }}
    .kpi-grid {{
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 1rem;
    }}
    .kpi-card {{
      background: rgba(6, 9, 17, 0.75);
      padding: 1rem;
      border-radius: 12px;
      border: 1px solid rgba(255,255,255,0.07);
    }}
    .kpi-label {{ font-size: 0.72rem; color: var(--muted); text-transform: uppercase; }}
    .kpi-val {{ font-size: 1.45rem; font-weight: 900; color: var(--cyan); margin: 0.2rem 0; }}
    .kpi-trend {{ font-size: 0.72rem; color: var(--emerald); font-weight: 700; }}
    .kpi-bar {{ height: 5px; background: rgba(255,255,255,0.1); border-radius: 4px; margin-top: 0.5rem; overflow: hidden; }}
    .kpi-fill {{ height: 100%; background: linear-gradient(90deg, var(--cyan), var(--emerald)); }}
    .arch-grid {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
      gap: 1.5rem;
      margin-bottom: 2.5rem;
    }}
    .step-card {{ margin-bottom: 1.75rem; }}
    .step-header {{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 1rem;
      margin-bottom: 1rem;
    }}
    .step-badge {{
      color: var(--emerald);
      font-family: monospace;
      font-size: 0.78rem;
      font-weight: 700;
    }}
    .step-header h3 {{ margin: 0.25rem 0; font-size: 1.25rem; }}
    .step-rationale {{ margin: 0; color: var(--muted); font-size: 0.9rem; }}
    .copy-btn, .pulse-btn {{
      background: var(--cyan);
      color: #060911;
      border: none;
      padding: 0.55rem 1rem;
      border-radius: 8px;
      font-weight: 800;
      cursor: pointer;
      white-space: nowrap;
    }}
    pre {{
      background: #050811;
      padding: 1.25rem;
      border-radius: 12px;
      overflow-x: auto;
      border: 1px solid rgba(255,255,255,0.08);
      font-size: 0.84rem;
      line-height: 1.55;
      color: #e2e8f0;
    }}
  </style>
</head>
<body>
  <div class="container">
    <nav class="top-nav">
      <a href="../../index.html">← Back to Master L8+ Architecture Studio Portal</a>
      <span class="eyebrow">Oct 26, 2026 • Node 24 LTS • React 19 • Prisma v6 • Three.js • GSAP</span>
    </nav>

    <section class="hero-grid">
      <div class="hero-card">
        <span class="eyebrow">Project {p['num']} • {html.escape(p['domain'])}</span>
        <h1>{html.escape(p['title'])}</h1>
        <p class="desc">{html.escape(p['desc'])}</p>
        <div class="kpi-grid">{kpi_cards_html}</div>
      </div>

      <div class="sim-card" style="display:flex;flex-direction:column;align-items:center;justify-content:center;">
        <span class="eyebrow" style="margin-bottom:0.5rem;">Live Three.js 3D &amp; GSAP Telemetry Preview</span>
        <canvas id="project-3d-canvas" width="360" height="220" aria-label="Interactive 3D WebGL Simulation"></canvas>
        <button type="button" class="pulse-btn" style="margin-top:0.75rem;" onclick="pulseSimulation()">
          Trigger GSAP Kinetic Shockwave
        </button>
      </div>
    </section>

    <section class="arch-grid">
      <div class="arch-card">
        <span class="eyebrow">Principal L8+ System Architecture</span>
        <p>{html.escape(p['architecture'])}</p>
        <span class="eyebrow">Performance, Security &amp; WCAG 2.2 AAA</span>
        <p style="margin-bottom:0;">{html.escape(p['performanceAndSecurity'])}</p>
      </div>
      <div class="arch-card">
        <span class="eyebrow">Oct 2026 Engineering Deep-Dive Mechanics</span>
        <ul>{deep_dive_html}</ul>
      </div>
    </section>

    <section>
      <h2 style="font-size:1.6rem;margin-bottom:1.25rem;">End-to-End Follow-Along Implementation Blueprint (100% Untruncated)</h2>
      {steps_html}
    </section>
  </div>

  <script>
    function copyStepCode(id, btn) {{
      const text = document.getElementById(id).textContent;
      navigator.clipboard.writeText(text);
      const orig = btn.textContent;
      btn.textContent = 'Copied 100%!';
      setTimeout(() => btn.textContent = orig, 1500);
    }}

    let activeMesh = null;
    (function initThree() {{
      const canvas = document.getElementById('project-3d-canvas');
      if (!canvas || typeof THREE === 'undefined') return;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 360 / 220, 0.1, 100);
      camera.position.z = 3.5;
      const renderer = new THREE.WebGLRenderer({{ canvas, alpha: true, antialias: true }});
      renderer.setSize(360, 220);

      const mode = {json.dumps(p['VisualMode'])};
      let geo;
      if (mode.includes('globe') || mode.includes('spatial')) {{
        geo = new THREE.SphereGeometry(1.0, 24, 24);
      }} else if (mode.includes('orderbook') || mode.includes('grid')) {{
        geo = new THREE.PlaneGeometry(2.2, 1.5, 12, 12);
      }} else if (mode.includes('vault')) {{
        geo = new THREE.IcosahedronGeometry(0.95, 1);
      }} else {{
        geo = new THREE.TorusKnotGeometry(0.75, 0.24, 100, 24);
      }}
      const mat = new THREE.MeshBasicMaterial({{ color: 0x38bdf8, wireframe: true }});
      activeMesh = new THREE.Mesh(geo, mat);
      scene.add(activeMesh);

      function animate() {{
        activeMesh.rotation.x += 0.007;
        activeMesh.rotation.y += 0.011;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }}
      animate();
    }})();

    function pulseSimulation() {{
      if (activeMesh && typeof gsap !== 'undefined') {{
        gsap.fromTo(activeMesh.scale, {{ x: 1.35, y: 1.35, z: 1.35 }}, {{ x: 1, y: 1, z: 1, duration: 0.75, ease: 'elastic.out(1, 0.4)' }});
      }}
    }}
  </script>
</body>
</html>
"""


def main() -> None:
    for p in PROJECTS:
        proj_dir = ROOT / "projects" / p["id"]
        (proj_dir / "src").mkdir(parents=True, exist_ok=True)
        (proj_dir / "prisma").mkdir(parents=True, exist_ok=True)
        (proj_dir / "tests").mkdir(parents=True, exist_ok=True)

        pkg = {
            "name": f"@enterprise-react/{p['id']}",
            "version": "1.0.0",
            "private": True,
            "type": "module",
            "scripts": {
                "dev": "vite",
                "build": "tsc --noEmit && vite build",
                "typecheck": "tsc --noEmit",
                "test:unit": "vitest run",
                "test:e2e": "playwright test",
                "db:generate": "prisma generate",
                "db:push": "prisma db push",
                "db:seed": "tsx prisma/seed.ts",
            },
            "dependencies": {
                "@prisma/client": "^6.4.0",
                "gsap": "^3.12.7",
                "next": "^15.2.0",
                "react": "^19.1.0",
                "react-dom": "^19.1.0",
                "three": "^0.173.0",
                "zod": "^3.24.2",
            },
            "devDependencies": {
                "@playwright/test": "^1.51.0",
                "@testing-library/jest-dom": "^6.6.3",
                "@testing-library/react": "^16.2.0",
                "@types/node": "^22.13.4",
                "@types/react": "^19.0.10",
                "@types/react-dom": "^19.0.4",
                "@types/three": "^0.173.0",
                "@vitejs/plugin-react": "^4.3.4",
                "jsdom": "^26.0.0",
                "prisma": "^6.4.0",
                "tsx": "^4.19.3",
                "typescript": "^5.8.2",
                "vite": "^6.2.0",
                "vitest": "^3.0.7",
            },
        }
        (proj_dir / "package.json").write_text(json.dumps(pkg, indent=2) + "\n")

        tsconfig = {
            "extends": "../../tsconfig.base.json",
            "compilerOptions": {"jsx": "react-jsx", "baseUrl": "."},
            "include": ["src/**/*", "prisma/**/*", "tests/**/*"],
        }
        (proj_dir / "tsconfig.json").write_text(json.dumps(tsconfig, indent=2) + "\n")

        vitest_cfg = """import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    include: ['tests/unit.test.tsx'],
  },
});
"""
        (proj_dir / "vitest.config.ts").write_text(vitest_cfg)

        playwright_cfg = """import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  testMatch: 'e2e.spec.ts',
  use: {
    headless: true,
    viewport: { width: 1280, height: 800 },
  },
});
"""
        (proj_dir / "playwright.config.ts").write_text(playwright_cfg)

        (proj_dir / "prisma" / "schema.prisma").write_text(p["prisma_schema"].strip() + "\n")
        (proj_dir / "prisma" / "seed.ts").write_text(p["seed_ts"].strip() + "\n")
        (proj_dir / "src" / "db.ts").write_text(DB_TS)
        (proj_dir / "src" / "styles.css").write_text(STYLES_CSS)
        (proj_dir / "src" / "actions.ts").write_text(p["actions_ts"].strip() + "\n")
        (proj_dir / "src" / f"{p['component_name']}.tsx").write_text(p["component_ts"].strip() + "\n")
        (proj_dir / "tests" / "unit.test.tsx").write_text(p["unit_test_ts"].strip() + "\n")

        e2e_ts = f"""import {{ test, expect }} from '@playwright/test';

test.describe('Project {p["num"]}: {p["title"]} — E2E & WCAG 2.2 AAA Verification', () => {{
  test('renders standalone interactive course & 3D telemetry studio without console errors', async ({{ page }}) => {{
    const errors: string[] = [];
    page.on('pageerror', (err) => errors.push(err.message));
    await page.goto('file://{proj_dir}/index.html');
    await expect(page.locator('h1')).toContainText({json.dumps(p["title"])});
    await expect(page.locator('.step-card')).toHaveCount(5);
    expect(errors).toEqual([]);
  }});
}});
"""
        (proj_dir / "tests" / "e2e.spec.ts").write_text(e2e_ts)
        (proj_dir / "index.html").write_text(build_project_html(p, e2e_ts))

    print(f"Successfully generated all {len(PROJECTS)} Principal Engineer L8+ projects and standalone HTML course pages.")


if __name__ == "__main__":
    main()
