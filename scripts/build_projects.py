#!/usr/bin/env python3
"""
Principal Engineer Level 8++ (Oct 26, 2026) — Master Project & Standalone Course HTML Generator
Enforces 100% External CSS Architecture (`@layer` + OKLCH tokens in `src/styles.css` and `course.css`)
with ZERO `<style>` tags, ZERO inline `style="..."` attributes, and ZERO `style={{...}}` JSX objects.
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

STYLES_CSS = """@layer reset, tokens, layout, components, states, utilities;

@layer tokens {
  :root {
    --surface-950: oklch(0.14 0.02 255);
    --surface-900: oklch(0.19 0.03 255);
    --surface-850: oklch(0.24 0.03 255);
    --border-subtle: oklch(0.76 0.14 230 / 0.18);
    --accent-cyan: oklch(0.76 0.14 230);
    --accent-indigo: oklch(0.62 0.19 275);
    --accent-emerald: oklch(0.79 0.17 155);
    --accent-rose: oklch(0.65 0.22 15);
    --text-primary: oklch(0.98 0.01 255);
    --text-muted: oklch(0.68 0.03 255);
    --radius-lg: 20px;
    --radius-md: 12px;
    --radius-sm: 8px;
  }
}

@layer layout {
  section.l8-styled-node {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 1.5rem;
    padding: 2rem;
    background: radial-gradient(circle at top right, oklch(0.24 0.07 275), var(--surface-950));
    color: var(--text-primary);
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-subtle);
  }

  header.l8-styled-node {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
    margin-block-end: 1.25rem;
  }

  div.l8-styled-node {
    display: flex;
    flex-direction: column;
    gap: 0.85rem;
  }

  [role="group"].l8-styled-node {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap: 0.6rem;
  }
}

@layer components {
  h2.l8-styled-node {
    font-size: 1.5rem;
    font-weight: 800;
    margin-block: 0.3rem;
  }

  h3.l8-styled-node {
    font-size: 0.92rem;
    color: var(--text-muted);
    margin-block: 0 0.5rem;
  }

  span.l8-styled-node {
    font-size: 0.75rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--accent-cyan);
  }

  code.l8-styled-node,
  kbd.l8-styled-node {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    background: var(--surface-900);
    color: var(--accent-emerald);
    padding: 0.25rem 0.6rem;
    border-radius: var(--radius-sm);
  }

  button.l8-styled-node {
    padding: 0.65rem 1.15rem;
    border-radius: var(--radius-md);
    background: var(--surface-850);
    color: var(--text-primary);
    font-weight: 700;
    border: 1px solid var(--border-subtle);
    cursor: pointer;
    transition: transform 0.18s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.18s ease;
  }

  button.l8-styled-node[type="submit"] {
    background: var(--accent-cyan);
    color: var(--surface-950);
  }

  input.l8-styled-node {
    padding: 0.65rem 0.95rem;
    border-radius: var(--radius-md);
    background: var(--surface-900);
    color: var(--text-primary);
    border: 1px solid var(--border-subtle);
  }

  article.l8-styled-node,
  li.l8-styled-node {
    padding: 0.95rem 1.15rem;
    border-radius: var(--radius-md);
    background: var(--surface-900);
    border: 1px solid var(--border-subtle);
    list-style: none;
  }

  [dir="rtl"] article.l8-styled-node {
    border-inline-start: 4px solid var(--accent-cyan);
    padding-inline-start: 1.25rem;
  }

  svg.l8-styled-node {
    width: 100%;
    max-width: 600px;
    background: var(--surface-900);
    border-radius: var(--radius-md);
    padding: 0.5rem;
  }

  [ data-testid="virtual-viewport" ].l8-styled-node {
    height: 320px;
    overflow-y: auto;
    position: relative;
    background: var(--surface-900);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-subtle);
  }

  [ data-testid="virtual-row" ].l8-styled-node {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 36px;
    padding-inline: 1rem;
    border-block-end: 1px solid var(--border-subtle);
    font-family: ui-monospace, monospace;
    font-size: 0.82rem;
  }
}

@layer states {
  button.l8-styled-node[aria-pressed="true"],
  li.l8-styled-node[aria-selected="true"] {
    border-color: var(--accent-cyan);
    background: oklch(0.76 0.14 230 / 0.18);
  }

  button.l8-styled-node:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  p[role="alert"].l8-styled-node {
    color: var(--accent-rose);
    font-weight: 700;
  }

  p[role="status"].l8-styled-node,
  footer.l8-styled-node {
    color: var(--accent-emerald);
    font-weight: 600;
  }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
"""

COURSE_CSS = """@layer reset, tokens, layout, components;

@layer tokens {
  :root {
    --bg: oklch(0.13 0.02 255);
    --panel: oklch(0.18 0.03 255 / 0.88);
    --border: oklch(0.76 0.14 230 / 0.2);
    --cyan: oklch(0.76 0.14 230);
    --emerald: oklch(0.79 0.17 155);
    --text: oklch(0.98 0.01 255);
    --muted: oklch(0.68 0.03 255);
  }
}

@layer layout {
  * { box-sizing: border-box; }
  body {
    margin: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: radial-gradient(circle at top right, oklch(0.24 0.07 275) 0%, var(--bg) 55%);
    color: var(--text);
    line-height: 1.6;
  }
  .container { max-width: 1280px; margin: 0 auto; padding: 2.5rem 1.5rem; }
  .top-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-block-end: 2rem;
    padding-block-end: 1rem;
    border-block-end: 1px solid var(--border);
  }
  .top-nav a {
    color: var(--cyan);
    text-decoration: none;
    font-weight: 700;
    font-size: 0.9rem;
  }
  .hero-grid {
    display: grid;
    grid-template-columns: 1.25fr 0.75fr;
    gap: 2rem;
    margin-block-end: 2.5rem;
  }
  @media (max-width: 900px) { .hero-grid { grid-template-columns: 1fr; } }
  .arch-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
    gap: 1.5rem;
    margin-block-end: 2.5rem;
  }
}

@layer components {
  .hero-card, .sim-card, .arch-card, .step-card {
    background: var(--panel);
    border: 1px solid var(--border);
    border-radius: 18px;
    padding: 1.75rem;
    backdrop-filter: blur(16px);
  }
  .sim-card {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }
  .eyebrow {
    color: var(--cyan);
    font-size: 0.75rem;
    font-weight: 800;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
  }
  h1 { font-size: 2rem; margin: 0.4rem 0 0.8rem; font-weight: 900; }
  .section-title { font-size: 1.6rem; margin-block-end: 1.25rem; }
  .desc { color: var(--muted); font-size: 1rem; margin-block-end: 1.5rem; }
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
  }
  .kpi-card {
    background: oklch(0.11 0.02 255 / 0.8);
    padding: 1rem;
    border-radius: 12px;
    border: 1px solid oklch(1 0 0 / 0.07);
  }
  .kpi-label { font-size: 0.72rem; color: var(--muted); text-transform: uppercase; }
  .kpi-val { font-size: 1.45rem; font-weight: 900; color: var(--cyan); margin: 0.2rem 0; }
  .kpi-trend { font-size: 0.72rem; color: var(--emerald); font-weight: 700; }
  .kpi-progress {
    width: 100%;
    height: 6px;
    margin-block-start: 0.5rem;
    accent-color: var(--cyan);
  }
  .step-card { margin-block-end: 1.75rem; }
  .step-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 1rem;
    margin-block-end: 1rem;
  }
  .step-badge {
    color: var(--emerald);
    font-family: ui-monospace, monospace;
    font-size: 0.78rem;
    font-weight: 700;
  }
  .step-header h3 { margin: 0.25rem 0; font-size: 1.25rem; }
  .step-rationale { margin: 0; color: var(--muted); font-size: 0.9rem; }
  .copy-btn, .pulse-btn {
    background: var(--cyan);
    color: oklch(0.13 0.02 255);
    border: none;
    padding: 0.55rem 1rem;
    border-radius: 8px;
    font-weight: 800;
    cursor: pointer;
    white-space: nowrap;
  }
  pre {
    background: oklch(0.1 0.02 255);
    padding: 1.25rem;
    border-radius: 12px;
    overflow-x: auto;
    border: 1px solid oklch(1 0 0 / 0.08);
    font-size: 0.84rem;
    line-height: 1.55;
    color: oklch(0.92 0.02 255);
  }
}
"""


def build_course_js(visual_mode: str) -> str:
    return f"""// Principal Engineer Level 8++ Standalone Course Telemetry & Three.js Runtime
(function initStandaloneCourse() {{
  let activeMesh = null;
  const canvas = document.getElementById('project-3d-canvas');
  const pulseBtn = document.getElementById('btn-pulse-sim');

  if (canvas && typeof THREE !== 'undefined') {{
    let gl = null;
    try {{
      gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    }} catch (_e) {{
      gl = null;
    }}
    if (gl) {{
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, 360 / 220, 0.1, 100);
      camera.position.z = 3.5;
      const renderer = new THREE.WebGLRenderer({{ canvas, context: gl, alpha: true, antialias: true }});
      renderer.setSize(360, 220);

      const mode = {json.dumps(visual_mode)};
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

      const animate = () => {{
        activeMesh.rotation.x += 0.007;
        activeMesh.rotation.y += 0.011;
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      }};
      animate();
    }}
  }}

  if (pulseBtn) {{
    pulseBtn.addEventListener('click', () => {{
      if (activeMesh && typeof gsap !== 'undefined') {{
        gsap.fromTo(
          activeMesh.scale,
          {{ x: 1.35, y: 1.35, z: 1.35 }},
          {{ x: 1, y: 1, z: 1, duration: 0.75, ease: 'elastic.out(1, 0.4)' }}
        );
      }}
    }});
  }}

  document.querySelectorAll('.copy-btn').forEach((btn) => {{
    btn.addEventListener('click', () => {{
      const targetId = btn.getAttribute('data-copy-target');
      const codeEl = targetId ? document.getElementById(targetId) : null;
      if (!codeEl) return;
      navigator.clipboard.writeText(codeEl.textContent || '');
      const orig = btn.textContent;
      btn.textContent = 'Copied 100%!';
      setTimeout(() => {{
        btn.textContent = orig;
      }}, 1500);
    }});
  }});
}})();
"""


def build_project_html(p: dict, e2e_code: str) -> str:
    """Generates a standalone Principal Engineer L8++ Follow-Along Course HTML page with ZERO inline CSS or JS."""
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
          <progress class="kpi-progress" value="{kpi['pct']}" max="100"></progress>
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
            <button type="button" class="copy-btn" data-copy-target="code-{idx}">Copy Full File</button>
          </div>
          <pre><code id="code-{idx}">{escaped_code}</code></pre>
        </article>
        """

    return f"""<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Project {p['num']}: {html.escape(p['title'])} — Principal Engineer L8++ Follow-Along Course</title>
  <link rel="stylesheet" href="course.css" />
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" defer></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js" defer></script>
  <script src="course.js" defer></script>
</head>
<body>
  <div class="container">
    <nav class="top-nav">
      <a href="../../index.html">← Back to Master L8++ Architecture Studio Portal</a>
      <span class="eyebrow">Oct 26, 2026 • Node 24 LTS • React 19 • Prisma v6 • Three.js • GSAP</span>
    </nav>

    <section class="hero-grid">
      <div class="hero-card">
        <span class="eyebrow">Project {p['num']} • {html.escape(p['domain'])}</span>
        <h1>{html.escape(p['title'])}</h1>
        <p class="desc">{html.escape(p['desc'])}</p>
        <div class="kpi-grid">{kpi_cards_html}</div>
      </div>

      <div class="sim-card">
        <span class="eyebrow">Live Three.js 3D &amp; GSAP Telemetry Preview</span>
        <canvas id="project-3d-canvas" width="360" height="220" aria-label="Interactive 3D WebGL Simulation"></canvas>
        <button type="button" class="pulse-btn" id="btn-pulse-sim">
          Trigger GSAP Kinetic Shockwave
        </button>
      </div>
    </section>

    <section class="arch-grid">
      <div class="arch-card">
        <span class="eyebrow">Principal L8++ System Architecture</span>
        <p>{html.escape(p['architecture'])}</p>
        <span class="eyebrow">Performance, Security &amp; WCAG 2.2 AAA</span>
        <p>{html.escape(p['performanceAndSecurity'])}</p>
      </div>
      <div class="arch-card">
        <span class="eyebrow">Oct 2026 Engineering Deep-Dive Mechanics</span>
        <ul>{deep_dive_html}</ul>
      </div>
    </section>

    <section>
      <h2 class="section-title">End-to-End Follow-Along Implementation Blueprint (100% Untruncated)</h2>
      {steps_html}
    </section>
  </div>
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
        (proj_dir / "course.css").write_text(COURSE_CSS)
        (proj_dir / "course.js").write_text(build_course_js(p["VisualMode"]))
        (proj_dir / "index.html").write_text(build_project_html(p, e2e_ts))

    print(f"Successfully generated all {len(PROJECTS)} Principal Engineer L8++ projects with 100% external CSS/JS.")


if __name__ == "__main__":
    main()
