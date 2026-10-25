#!/usr/bin/env python3
"""
Compiles the Master Interactive Hollywood/Apple-style Course Studio Portal (index.html)
with Three.js 3D background, GSAP animations, Monaco Code Editor, Live Simulation tabs,
and macOS 'gh' CLI recipes.
"""
import os
import json

BASE_DIR = "/Users/billyribeiro/Desktop/react-enterprise-projects"
PROJECTS_DIR = os.path.join(BASE_DIR, "projects")
OUTPUT_HTML = os.path.join(BASE_DIR, "index.html")

def build_portal():
    projects_data = []

    # Read each project directory
    project_dirs = sorted([d for d in os.listdir(PROJECTS_DIR) if os.path.isdir(os.path.join(PROJECTS_DIR, d))])

    for p_id in project_dirs:
        pdir = os.path.join(PROJECTS_DIR, p_id)
        
        # Read files
        pkg_json = json.load(open(os.path.join(pdir, "package.json")))
        schema_prisma = open(os.path.join(pdir, "prisma", "schema.prisma")).read()
        seed_ts = open(os.path.join(pdir, "prisma", "seed.ts")).read()
        prisma_ts = open(os.path.join(pdir, "lib", "prisma.ts")).read()
        actions_ts = open(os.path.join(pdir, "src", "actions.ts")).read()
        
        # Find UI component
        src_files = [f for f in os.listdir(os.path.join(pdir, "src")) if f.endswith(".tsx")]
        ui_file = src_files[0] if src_files else "Component.tsx"
        ui_code = open(os.path.join(pdir, "src", ui_file)).read()
        
        unit_test = open(os.path.join(pdir, "tests", "unit", "index.test.tsx")).read()
        e2e_test = open(os.path.join(pdir, "tests", "e2e", "flow.spec.ts")).read()
        readme = open(os.path.join(pdir, "README.md")).read()

        # Determine Tier & Tags
        title = readme.split("\n")[0].replace("#", "").strip()
        tier = "Tier 1: Enterprise Foundations"
        if any(x in p_id for x in ["06", "07", "08", "09", "10"]):
            tier = "Tier 2: Real-Time Systems"
        elif any(x in p_id for x in ["11", "12", "13", "14", "15"]):
            tier = "Tier 3: Distributed & Resilient"
        elif any(x in p_id for x in ["16", "17", "18", "19", "20"]):
            tier = "Tier 4: Enterprise Capstones"

        has_three = "THREE" in ui_code or "three" in ui_code
        has_gsap = "gsap" in ui_code

        tags = ["React 19", "Prisma ORM", "TypeScript", "Vitest", "Playwright"]
        if has_three: tags.append("Three.js 3D")
        if has_gsap: tags.append("GSAP Motion")
        if "Next.js" in readme or "use server" in actions_ts: tags.append("Next.js")

        blueprint_steps = [
            {
                "step": 1,
                "title": "Prisma Schema & SQLite Data Modeling",
                "desc": "Define database models, relational foreign keys, cascade triggers, and compound indexes.",
                "cmd": f"cd projects/{p_id}\npnpm add @prisma/client prisma\nnpx prisma init --datasource-provider sqlite",
                "code": schema_prisma,
                "filename": "prisma/schema.prisma"
            },
            {
                "step": 2,
                "title": "Database Push & Deterministic Seeding",
                "desc": "Sync the relational schema into SQLite dev.db and populate production-grade enterprise mock records.",
                "cmd": "pnpm db:push\npnpm db:seed",
                "code": seed_ts,
                "filename": "prisma/seed.ts"
            },
            {
                "step": 3,
                "title": "Type-Safe Server Actions & Zod Validation",
                "desc": "Create server actions using Next.js / Node.js with strict Zod parsing and Prisma singleton queries.",
                "cmd": "pnpm add zod",
                "code": actions_ts,
                "filename": "src/actions.ts"
            },
            {
                "step": 4,
                "title": "React 19 UI with Three.js / GSAP Animations",
                "desc": "Implement the visual presentation layer leveraging React 19 RSC, optimistic updates, and GPU-accelerated motion.",
                "cmd": "pnpm add react@^19 react-dom@^19 three gsap",
                "code": ui_code,
                "filename": f"src/{ui_file}"
            },
            {
                "step": 5,
                "title": "Vitest & Playwright Verification",
                "desc": "Execute sub-second unit and component specs along with end-to-end headless browser regression tests.",
                "cmd": "pnpm test\npnpm test:e2e",
                "code": f"// Vitest Unit Spec\n{unit_test}\n\n// Playwright E2E Spec\n{e2e_test}",
                "filename": "tests/verification.ts"
            }
        ]

        projects_data.append({
            "id": p_id,
            "title": title,
            "tier": tier,
            "tags": tags,
            "has_three": has_three,
            "has_gsap": has_gsap,
            "ui_file": ui_file,
            "ui_code": ui_code,
            "actions_ts": actions_ts,
            "schema_prisma": schema_prisma,
            "seed_ts": seed_ts,
            "prisma_ts": prisma_ts,
            "unit_test": unit_test,
            "e2e_test": e2e_test,
            "readme": readme,
            "steps": blueprint_steps
        })

    json_data = json.dumps(projects_data)

    html_content = f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Enterprise React 19 &bull; Next.js &bull; Prisma &bull; Three.js Course Studio</title>
  
  <!-- Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- Three.js & GSAP via CDN -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
  <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>

  <!-- Monaco Editor loader -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs/loader.min.js"></script>

  <style>
    :root {{
      --bg-dark: #050508;
      --bg-surface: #0b0d14;
      --bg-surface-elevated: #111422;
      --border-subtle: rgba(255, 255, 255, 0.08);
      --border-glow: rgba(6, 182, 212, 0.4);
      --cyan-neon: #06b6d4;
      --purple-neon: #8b5cf6;
      --pink-neon: #ec4899;
      --emerald-neon: #10b981;
      --amber-neon: #f59e0b;
      --text-main: #f8fafc;
      --text-muted: #94a3b8;
      --font-sans: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      --font-mono: 'JetBrains Mono', monospace;
    }}

    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}

    body {{
      background: var(--bg-dark);
      color: var(--text-main);
      font-family: var(--font-sans);
      min-height: 100vh;
      overflow-x: hidden;
      line-height: 1.5;
    }}

    /* Three.js 3D Background Canvas */
    #bg-webgl-canvas {{
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      z-index: 0;
      pointer-events: none;
      opacity: 0.45;
    }}

    /* Global Layout Wrap */
    .app-viewport {{
      position: relative;
      z-index: 1;
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }}

    /* Hollywood Glassmorphic Header */
    header.cinema-navbar {{
      position: sticky;
      top: 0;
      z-index: 50;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: rgba(5, 5, 8, 0.75);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid var(--border-subtle);
    }}

    .brand-group {{
      display: flex;
      align-items: center;
      gap: 1rem;
    }}

    .brand-logo-hex {{
      width: 40px;
      height: 40px;
      border-radius: 10px;
      background: linear-gradient(135deg, var(--cyan-neon), var(--purple-neon));
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 800;
      font-size: 1.25rem;
      color: #fff;
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.5);
    }}

    .brand-title h1 {{
      font-size: 1.15rem;
      font-weight: 700;
      letter-spacing: -0.02em;
      background: linear-gradient(to right, #fff, var(--cyan-neon));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}

    .brand-title p {{
      font-size: 0.75rem;
      color: var(--text-muted);
    }}

    .nav-actions {{
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }}

    .btn-gh-mac {{
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      color: var(--text-main);
      font-size: 0.85rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s ease;
    }}

    .btn-gh-mac:hover {{
      background: rgba(6, 182, 212, 0.15);
      border-color: var(--cyan-neon);
      box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
    }}

    /* KPI Holographic Ribbon */
    .kpi-metrics-ribbon {{
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      padding: 1.5rem 2rem;
      background: rgba(11, 13, 20, 0.6);
      border-bottom: 1px solid var(--border-subtle);
      backdrop-filter: blur(12px);
    }}

    .kpi-card {{
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 0.85rem 1.25rem;
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
      position: relative;
      overflow: hidden;
    }}

    .kpi-card::after {{
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: var(--cyan-neon);
    }}

    .kpi-card.purple::after {{ background: var(--purple-neon); }}
    .kpi-card.emerald::after {{ background: var(--emerald-neon); }}
    .kpi-card.pink::after {{ background: var(--pink-neon); }}

    .kpi-card .label {{
      font-size: 0.72rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      color: var(--text-muted);
    }}

    .kpi-card .val {{
      font-size: 1.35rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: var(--text-main);
      font-family: var(--font-mono);
    }}

    /* Main Studio Work Area */
    .studio-grid {{
      display: grid;
      grid-template-columns: 360px 1fr;
      flex: 1;
      min-height: calc(100vh - 180px);
    }}

    /* Left Sidebar: 20 Projects Explorer */
    .projects-sidebar {{
      background: rgba(11, 13, 20, 0.85);
      border-right: 1px solid var(--border-subtle);
      backdrop-filter: blur(16px);
      display: flex;
      flex-direction: column;
      height: calc(100vh - 170px);
      position: sticky;
      top: 73px;
    }}

    .sidebar-filter-bar {{
      padding: 1rem;
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }}

    .search-input-box {{
      width: 100%;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid var(--border-subtle);
      border-radius: 8px;
      padding: 0.55rem 0.85rem;
      color: var(--text-main);
      font-size: 0.85rem;
      outline: none;
      transition: border-color 0.2s;
    }}

    .search-input-box:focus {{
      border-color: var(--cyan-neon);
      box-shadow: 0 0 10px rgba(6, 182, 212, 0.2);
    }}

    .tier-pills {{
      display: flex;
      gap: 0.35rem;
      overflow-x: auto;
      padding-bottom: 0.25rem;
    }}

    .tier-pill {{
      padding: 0.25rem 0.65rem;
      border-radius: 20px;
      font-size: 0.7rem;
      font-weight: 600;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid transparent;
      color: var(--text-muted);
      cursor: pointer;
      white-space: nowrap;
      transition: all 0.2s ease;
    }}

    .tier-pill.active, .tier-pill:hover {{
      background: rgba(6, 182, 212, 0.15);
      border-color: var(--cyan-neon);
      color: var(--cyan-neon);
    }}

    .project-nav-list {{
      flex: 1;
      overflow-y: auto;
      padding: 0.75rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }}

    .nav-project-card {{
      padding: 0.85rem 1rem;
      border-radius: 10px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid transparent;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      flex-direction: column;
      gap: 0.35rem;
    }}

    .nav-project-card:hover {{
      background: rgba(255, 255, 255, 0.05);
      border-color: rgba(255, 255, 255, 0.1);
    }}

    .nav-project-card.active {{
      background: linear-gradient(90deg, rgba(6, 182, 212, 0.12), rgba(139, 92, 246, 0.12));
      border-color: var(--cyan-neon);
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.2);
    }}

    .card-top-row {{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}

    .project-num {{
      font-family: var(--font-mono);
      font-size: 0.75rem;
      color: var(--cyan-neon);
      font-weight: 700;
    }}

    .badge-3d {{
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      background: rgba(236, 72, 153, 0.2);
      color: var(--pink-neon);
      border: 1px solid rgba(236, 72, 153, 0.4);
    }}

    .badge-gsap {{
      font-size: 0.65rem;
      font-weight: 700;
      padding: 0.15rem 0.4rem;
      border-radius: 4px;
      background: rgba(16, 185, 129, 0.2);
      color: var(--emerald-neon);
      border: 1px solid rgba(16, 185, 129, 0.4);
    }}

    .nav-project-card h4 {{
      font-size: 0.88rem;
      font-weight: 600;
      color: var(--text-main);
      line-height: 1.3;
    }}

    /* Right Main Panel: Studio & Follow-Along Course */
    .studio-main-panel {{
      display: flex;
      flex-direction: column;
      background: var(--bg-surface);
      overflow-y: auto;
    }}

    /* Project Hero Header */
    .project-hero-header {{
      padding: 2rem;
      background: linear-gradient(180deg, rgba(17, 20, 34, 0.8), rgba(5, 5, 8, 0.4));
      border-bottom: 1px solid var(--border-subtle);
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }}

    .hero-meta-row {{
      display: flex;
      align-items: center;
      gap: 0.75rem;
      flex-wrap: wrap;
    }}

    .pill-tier {{
      font-size: 0.72rem;
      font-weight: 700;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      background: rgba(139, 92, 246, 0.15);
      border: 1px solid var(--purple-neon);
      color: #c4b5fd;
    }}

    .tag-chip {{
      font-size: 0.7rem;
      font-weight: 600;
      padding: 0.2rem 0.5rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
    }}

    .hero-title-row h2 {{
      font-size: 1.85rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      background: linear-gradient(to right, #fff, #93c5fd);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }}

    .hero-desc {{
      color: var(--text-muted);
      font-size: 0.95rem;
      max-width: 900px;
      line-height: 1.6;
    }}

    /* Studio Tab Bar */
    .studio-tab-bar {{
      display: flex;
      align-items: center;
      background: #090b12;
      border-bottom: 1px solid var(--border-subtle);
      padding: 0 1.5rem;
      gap: 0.5rem;
      overflow-x: auto;
    }}

    .studio-tab {{
      padding: 0.85rem 1.15rem;
      font-size: 0.82rem;
      font-weight: 600;
      color: var(--text-muted);
      cursor: pointer;
      border-bottom: 2px solid transparent;
      transition: all 0.2s ease;
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      white-space: nowrap;
    }}

    .studio-tab:hover {{
      color: var(--text-main);
    }}

    .studio-tab.active {{
      color: var(--cyan-neon);
      border-bottom-color: var(--cyan-neon);
    }}

    .tab-badge {{
      font-size: 0.65rem;
      background: rgba(6, 182, 212, 0.15);
      padding: 0.1rem 0.35rem;
      border-radius: 4px;
      color: var(--cyan-neon);
    }}

    /* Workspace Content Area */
    .workspace-pane {{
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }}

    /* Code Viewport Card */
    .code-editor-card {{
      background: #0d111a;
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
    }}

    .editor-top-bar {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.65rem 1.25rem;
      background: #090c14;
      border-bottom: 1px solid var(--border-subtle);
    }}

    .file-path-indicator {{
      font-family: var(--font-mono);
      font-size: 0.78rem;
      color: var(--cyan-neon);
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }}

    .btn-copy-code {{
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.35rem 0.75rem;
      border-radius: 6px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--border-subtle);
      color: var(--text-main);
      font-size: 0.75rem;
      font-weight: 600;
      cursor: pointer;
      transition: all 0.2s;
    }}

    .btn-copy-code:hover {{
      background: rgba(6, 182, 212, 0.2);
      border-color: var(--cyan-neon);
    }}

    #monaco-container {{
      height: 520px;
      width: 100%;
    }}

    /* Interactive Live Simulator Viewport */
    .live-sim-viewport {{
      background: #090c14;
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 2rem;
      min-height: 480px;
      display: flex;
      flex-direction: column;
      position: relative;
    }}

    .sim-header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--border-subtle);
    }}

    .sim-header h3 {{
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
    }}

    .sim-canvas-box {{
      flex: 1;
      width: 100%;
      height: 380px;
      border-radius: 10px;
      background: radial-gradient(circle at center, #131728 0%, #080a11 100%);
      border: 1px solid rgba(255, 255, 255, 0.05);
      position: relative;
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    /* Follow-Along Step Blueprints */
    .blueprint-timeline {{
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }}

    .blueprint-step-card {{
      background: #0d111a;
      border: 1px solid var(--border-subtle);
      border-radius: 12px;
      padding: 1.5rem;
      display: flex;
      flex-direction: column;
      gap: 1rem;
      position: relative;
      overflow: hidden;
    }}

    .step-header-row {{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}

    .step-badge {{
      font-family: var(--font-mono);
      font-size: 0.75rem;
      font-weight: 700;
      background: linear-gradient(135deg, var(--cyan-neon), var(--purple-neon));
      color: #fff;
      padding: 0.25rem 0.65rem;
      border-radius: 6px;
    }}

    .step-title {{
      font-size: 1.05rem;
      font-weight: 700;
      color: var(--text-main);
    }}

    .step-desc {{
      font-size: 0.88rem;
      color: var(--text-muted);
      line-height: 1.5;
    }}

    .step-cmd-box {{
      background: #06080e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 0.85rem 1rem;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      color: #38bdf8;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}

    /* Modal for macOS gh CLI */
    .modal-backdrop {{
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(12px);
      z-index: 100;
      display: none;
      align-items: center;
      justify-content: center;
      padding: 2rem;
    }}

    .modal-backdrop.open {{
      display: flex;
    }}

    .gh-modal-card {{
      background: #0d111a;
      border: 1px solid var(--cyan-neon);
      border-radius: 16px;
      max-width: 720px;
      width: 100%;
      padding: 2rem;
      box-shadow: 0 0 50px rgba(6, 182, 212, 0.3);
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
    }}

    .gh-modal-header {{
      display: flex;
      align-items: center;
      justify-content: space-between;
    }}

    .gh-modal-header h3 {{
      font-size: 1.25rem;
      font-weight: 700;
      color: var(--text-main);
    }}

    .close-btn {{
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 1.5rem;
      cursor: pointer;
    }}

    .gh-recipe-block {{
      background: #06080e;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 1rem;
      font-family: var(--font-mono);
      font-size: 0.82rem;
      color: #a5f3fc;
      line-height: 1.6;
      position: relative;
    }}

    /* Toast Notification */
    .toast-pill {{
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: var(--emerald-neon);
      color: #022c22;
      font-weight: 700;
      font-size: 0.85rem;
      padding: 0.65rem 1.25rem;
      border-radius: 30px;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
      z-index: 200;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      pointer-events: none;
    }}

    .toast-pill.show {{
      opacity: 1;
      transform: translateY(0);
    }}
  </style>
</head>
<body>
  <!-- Three.js 3D Background Canvas -->
  <canvas id="bg-webgl-canvas"></canvas>

  <div class="app-viewport">
    <!-- Navbar -->
    <header class="cinema-navbar">
      <div class="brand-group">
        <div class="brand-logo-hex">20</div>
        <div class="brand-title">
          <h1>React 19 &bull; Next.js App Router &bull; Prisma ORM Studio</h1>
          <p>Node.js 24 LTS &bull; pnpm Workspaces &bull; Three.js 3D &bull; GSAP Motion &bull; Vitest & Playwright</p>
        </div>
      </div>

      <div class="nav-actions">
        <button class="btn-gh-mac" onclick="openGhModal()">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
          </svg>
          macOS gh CLI Recipe
        </button>
      </div>
    </header>

    <!-- Top KPI Telemetry Ribbon -->
    <section class="kpi-metrics-ribbon">
      <div class="kpi-card">
        <span class="label">Total Enterprise Projects</span>
        <span class="val">20 Blueprints</span>
      </div>
      <div class="kpi-card purple">
        <span class="label">Data Layer Persistence</span>
        <span class="val">Prisma ORM v6</span>
      </div>
      <div class="kpi-card emerald">
        <span class="label">Runtime & Package Tool</span>
        <span class="val">Node 24 &bull; pnpm</span>
      </div>
      <div class="kpi-card pink">
        <span class="label">Visual & Motion Standards</span>
        <span class="val">Three.js & GSAP</span>
      </div>
    </section>

    <!-- Main Studio Grid -->
    <div class="studio-grid">
      <!-- Left Projects Navigation -->
      <aside class="projects-sidebar">
        <div class="sidebar-filter-bar">
          <input
            type="text"
            id="search-input"
            placeholder="Search 20 projects, Prisma models, shaders..."
            class="search-input-box"
            oninput="handleSearch(this.value)"
          />
          <div class="tier-pills">
            <button class="tier-pill active" onclick="filterTier('all')">All (20)</button>
            <button class="tier-pill" onclick="filterTier('Tier 1')">Tier 1: Foundations</button>
            <button class="tier-pill" onclick="filterTier('Tier 2')">Tier 2: Real-Time</button>
            <button class="tier-pill" onclick="filterTier('Tier 3')">Tier 3: Distributed</button>
            <button class="tier-pill" onclick="filterTier('Tier 4')">Tier 4: Capstones</button>
          </div>
        </div>

        <div class="project-nav-list" id="project-nav-list">
          <!-- Rendered via JS -->
        </div>
      </aside>

      <!-- Right Project Studio & Course Engine -->
      <main class="studio-main-panel">
        <!-- Hero Header -->
        <div class="project-hero-header">
          <div class="hero-meta-row">
            <span class="pill-tier" id="hero-tier">Tier 1</span>
            <div id="hero-tags" style="display:flex; gap:0.5rem; flex-wrap:wrap;"></div>
          </div>
          <div class="hero-title-row">
            <h2 id="hero-title">Project Title</h2>
          </div>
          <p class="hero-desc" id="hero-desc">Project Overview Description</p>
        </div>

        <!-- Studio Tabs -->
        <nav class="studio-tab-bar">
          <div class="studio-tab active" data-tab="blueprint" onclick="switchTab('blueprint')">
            <span>Guided 5-Step Blueprint</span>
            <span class="tab-badge">Follow-Along</span>
          </div>
          <div class="studio-tab" data-tab="live" onclick="switchTab('live')">
            <span>Interactive Live Simulation</span>
            <span class="tab-badge">WebGL 3D</span>
          </div>
          <div class="studio-tab" data-tab="ui" onclick="switchTab('ui')">
            <span>Component (TSX)</span>
          </div>
          <div class="studio-tab" data-tab="actions" onclick="switchTab('actions')">
            <span>Server Actions (TS)</span>
          </div>
          <div class="studio-tab" data-tab="prisma" onclick="switchTab('prisma')">
            <span>Prisma Schema</span>
          </div>
          <div class="studio-tab" data-tab="tests" onclick="switchTab('tests')">
            <span>Vitest & Playwright</span>
          </div>
        </nav>

        <!-- Dynamic Tab Workspace -->
        <div class="workspace-pane">
          <!-- 1. Blueprint Step-by-Step View -->
          <div id="tab-blueprint-view" class="tab-content-view">
            <div class="blueprint-timeline" id="blueprint-steps-container">
              <!-- Rendered via JS -->
            </div>
          </div>

          <!-- 2. Interactive Live Simulation View -->
          <div id="tab-live-view" class="tab-content-view" style="display: none;">
            <div class="live-sim-viewport">
              <div class="sim-header">
                <div>
                  <h3 id="sim-project-title">Interactive Runtime Preview</h3>
                  <p style="color:var(--text-muted); font-size:0.85rem;">Live Three.js 3D WebGL / Canvas / GSAP Simulation</p>
                </div>
                <button class="btn-copy-code" onclick="initSimulation()">
                  &#x21bb; Reset Simulation
                </button>
              </div>

              <div class="sim-canvas-box" id="sim-canvas-container">
                <canvas id="sim-webgl-canvas" style="width:100%; height:100%;"></canvas>
              </div>
            </div>
          </div>

          <!-- 3. Monaco Code Inspector View -->
          <div id="tab-code-view" class="tab-content-view" style="display: none;">
            <div class="code-editor-card">
              <div class="editor-top-bar">
                <div class="file-path-indicator" id="current-filename">
                  <span>src/Component.tsx</span>
                </div>
                <button class="btn-copy-code" onclick="copyCurrentCode()">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                  </svg>
                  Copy File Code
                </button>
              </div>
              <div id="monaco-container"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>

  <!-- Modal: macOS gh CLI Recipe -->
  <div class="modal-backdrop" id="gh-modal" onclick="if(event.target===this) closeGhModal()">
    <div class="gh-modal-card">
      <div class="gh-modal-header">
        <h3>macOS GitHub CLI (`gh`) Automation Station</h3>
        <button class="close-btn" onclick="closeGhModal()">&times;</button>
      </div>

      <p style="color:var(--text-muted); font-size:0.88rem;">
        Authenticate, provision remote repository, and trigger the GitHub Actions CI matrix directly from your macOS terminal:
      </p>

      <div class="gh-recipe-block" id="gh-recipe-text">
# 1. Verify GitHub authentication
gh auth status

# 2. Create the remote public repository and push main
gh repo create billyribeiro-ux/react-enterprise-projects --public --source=. --remote=origin --push

# 3. Trigger and monitor GitHub Actions CI workflow
gh workflow run ci.yml
gh run watch

# 4. Automate PR creation
gh pr create --title "feat: 20 Enterprise React 19 Projects" --body "Complete suite with Prisma, Vitest, Playwright, Three.js and GSAP"
      </div>

      <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
        <button class="btn-copy-code" onclick="copyText(document.getElementById('gh-recipe-text').innerText)">
          Copy macOS Commands
        </button>
        <button class="btn-gh-mac" onclick="closeGhModal()">Done</button>
      </div>
    </div>
  </div>

  <!-- Toast Element -->
  <div class="toast-pill" id="toast">Copied to Clipboard!</div>

  <script>
    // Embedded Master Projects Data
    const PROJECTS = {json_data};

    let activeProject = PROJECTS[0];
    let activeTab = 'blueprint';
    let currentCode = '';
    let monacoEditor = null;
    let simRenderer = null;
    let simAnimId = null;

    // Initialize Three.js 3D Cyber Background Canvas
    function initBackground3D() {{
      const canvas = document.getElementById('bg-webgl-canvas');
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 25;

      const renderer = new THREE.WebGLRenderer({{ canvas, alpha: true, antialias: true }});
      renderer.setSize(window.innerWidth, window.innerHeight);

      // Crystalline Icosahedron Lattice
      const geom = new THREE.IcosahedronGeometry(12, 1);
      const wireMat = new THREE.MeshBasicMaterial({{ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.18 }});
      const mesh = new THREE.Mesh(geom, wireMat);
      scene.add(mesh);

      // Ambient Particle Constellation
      const pGeom = new THREE.BufferGeometry();
      const pCount = 350;
      const pos = new Float32Array(pCount * 3);
      for (let i = 0; i < pCount * 3; i++) {{
        pos[i] = (Math.random() - 0.5) * 60;
      }}
      pGeom.setAttribute('position', new THREE.BufferAttribute(pos, 3));
      const pMat = new THREE.PointsMaterial({{ size: 0.8, color: 0x8b5cf6, transparent: true, opacity: 0.6 }});
      const particles = new THREE.Points(pGeom, pMat);
      scene.add(particles);

      window.addEventListener('resize', () => {{
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }});

      let mouseX = 0, mouseY = 0;
      window.addEventListener('mousemove', (e) => {{
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      }});

      const animate = () => {{
        requestAnimationFrame(animate);
        mesh.rotation.y += 0.0015;
        mesh.rotation.x += 0.0008;
        particles.rotation.y -= 0.0005;

        camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 3 - camera.position.y) * 0.02;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      }};
      animate();
    }}

    // Render Navigation List
    function renderProjectList(filter = 'all', query = '') {{
      const container = document.getElementById('project-nav-list');
      container.innerHTML = '';

      const filtered = PROJECTS.filter(p => {{
        const matchesTier = filter === 'all' || p.tier.includes(filter);
        const matchesQuery = !query || p.title.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase());
        return matchesTier && matchesQuery;
      }});

      filtered.forEach((p, idx) => {{
        const card = document.createElement('div');
        card.className = `nav-project-card ${{p.id === activeProject.id ? 'active' : ''}}`;
        card.onclick = () => selectProject(p.id);

        card.innerHTML = `
          <div class="card-top-row">
            <span class="project-num">${{p.id.split('-')[0]}}</span>
            <div style="display:flex; gap:0.25rem;">
              ${{p.has_three ? '<span class="badge-3d">3D WebGL</span>' : ''}}
              ${{p.has_gsap ? '<span class="badge-gsap">GSAP</span>' : ''}}
            </div>
          </div>
          <h4>${{p.title}}</h4>
        `;
        container.appendChild(card);
      }});
    }}

    // Select Project
    function selectProject(id) {{
      activeProject = PROJECTS.find(p => p.id === id);
      renderProjectList();
      updateHero();
      renderBlueprintSteps();
      if (activeTab === 'live') initSimulation();
      else if (activeTab !== 'blueprint') updateCodeView();
    }}

    function updateHero() {{
      document.getElementById('hero-tier').textContent = activeProject.tier;
      document.getElementById('hero-title').textContent = activeProject.title;
      document.getElementById('hero-desc').textContent = activeProject.desc;
      
      const tagsContainer = document.getElementById('hero-tags');
      tagsContainer.innerHTML = activeProject.tags.map(t => `<span class="tag-chip">${{t}}</span>`).join('');
    }}

    // Switch Studio Tabs
    function switchTab(tab) {{
      activeTab = tab;
      document.querySelectorAll('.studio-tab').forEach(el => {{
        el.classList.toggle('active', el.dataset.tab === tab);
      }});

      const blueprintView = document.getElementById('tab-blueprint-view');
      const liveView = document.getElementById('tab-live-view');
      const codeView = document.getElementById('tab-code-view');

      blueprintView.style.display = tab === 'blueprint' ? 'block' : 'none';
      liveView.style.display = tab === 'live' ? 'block' : 'none';
      codeView.style.display = (tab !== 'blueprint' && tab !== 'live') ? 'block' : 'none';

      if (tab === 'live') {{
        initSimulation();
      }} else if (tab !== 'blueprint') {{
        updateCodeView();
      }}
    }}

    // Render 5-Step Follow-Along Blueprint
    function renderBlueprintSteps() {{
      const container = document.getElementById('blueprint-steps-container');
      container.innerHTML = '';

      activeProject.steps.forEach((s) => {{
        const card = document.createElement('div');
        card.className = 'blueprint-step-card';
        card.innerHTML = `
          <div class="step-header-row">
            <span class="step-badge">STEP ${{s.step}}</span>
            <span style="font-family:var(--font-mono); font-size:0.75rem; color:var(--text-muted);">${{s.filename}}</span>
          </div>
          <h3 class="step-title">${{s.title}}</h3>
          <p class="step-desc">${{s.desc}}</p>
          <div class="step-cmd-box">
            <code>${{s.cmd.replace(/\\n/g, '<br>')}}</code>
            <button class="btn-copy-code" onclick="copyText(\`${{s.cmd}}\`)">Copy</button>
          </div>
          <div style="background:#080a11; border:1px solid rgba(255,255,255,0.06); border-radius:8px; padding:1rem; position:relative;">
            <button class="btn-copy-code" style="position:absolute; top:0.75rem; right:0.75rem;" onclick="copyText(\`${{encodeURIComponent(s.code)}}\`, true)">
              Copy Step Code
            </button>
            <pre style="font-family:var(--font-mono); font-size:0.78rem; color:#cbd5e1; max-height:220px; overflow-y:auto; line-height:1.5;">${{escapeHtml(s.code.slice(0, 800))}}${{s.code.length > 800 ? '...' : ''}}</pre>
          </div>
        `;
        container.appendChild(card);
      }});
    }}

    function escapeHtml(text) {{
      return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }}

    // Monaco Editor Update
    function updateCodeView() {{
      let code = '';
      let lang = 'typescript';
      let filename = '';

      if (activeTab === 'ui') {{
        code = activeProject.ui_code;
        lang = 'typescript';
        filename = `src/${{activeProject.ui_file}}`;
      }} else if (activeTab === 'actions') {{
        code = activeProject.actions_ts;
        lang = 'typescript';
        filename = 'src/actions.ts';
      }} else if (activeTab === 'prisma') {{
        code = activeProject.schema_prisma;
        lang = 'graphql';
        filename = 'prisma/schema.prisma';
      }} else if (activeTab === 'tests') {{
        code = `// Vitest Unit Spec\\n${{activeProject.unit_test}}\\n\\n// Playwright E2E Spec\\n${{activeProject.e2e_test}}`;
        lang = 'typescript';
        filename = 'tests/unit/index.test.tsx';
      }}

      currentCode = code;
      document.getElementById('current-filename').innerHTML = `<span>${{filename}}</span>`;

      if (monacoEditor) {{
        monacoEditor.setValue(code);
        monaco.editor.setModelLanguage(monacoEditor.getModel(), lang);
      }} else {{
        require.config({{ paths: {{ vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.45.0/min/vs' }} }});
        require(['vs/editor/editor.main'], function () {{
          monacoEditor = monaco.editor.create(document.getElementById('monaco-container'), {{
            value: code,
            language: lang,
            theme: 'vs-dark',
            automaticLayout: true,
            fontSize: 13,
            fontFamily: 'JetBrains Mono',
            minimap: {{ enabled: true }}
          }});
        }});
      }}
    }}

    // Interactive Live Simulation Engine (Three.js WebGL / Canvas / Radars)
    function initSimulation() {{
      const canvas = document.getElementById('sim-webgl-canvas');
      const container = document.getElementById('sim-canvas-container');
      document.getElementById('sim-project-title').textContent = activeProject.title;

      if (simAnimId) cancelAnimationFrame(simAnimId);
      if (simRenderer) {{
        simRenderer.dispose();
      }}

      const width = container.clientWidth;
      const height = container.clientHeight;

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
      camera.position.z = 4;

      simRenderer = new THREE.WebGLRenderer({{ canvas, alpha: true, antialias: true }});
      simRenderer.setSize(width, height);

      // Create tailored 3D interactive mesh based on project type
      let activeMesh;
      if (activeProject.id.includes('01')) {{
        // Physical PBR Orb
        const geom = new THREE.IcosahedronGeometry(1.4, 32);
        const mat = new THREE.MeshPhysicalMaterial({{ color: 0x38bdf8, roughness: 0.1, metalness: 0.9, clearcoat: 1.0 }});
        activeMesh = new THREE.Mesh(geom, mat);
      }} else if (activeProject.id.includes('07')) {{
        // Order book mountains
        const geom = new THREE.BoxGeometry(2.4, 1.2, 0.4);
        const mat = new THREE.MeshBasicMaterial({{ color: 0x10b981, wireframe: true }});
        activeMesh = new THREE.Mesh(geom, mat);
      }} else if (activeProject.id.includes('10')) {{
        // Audio wave ribbon
        const geom = new THREE.PlaneGeometry(5, 2, 32, 16);
        const mat = new THREE.MeshBasicMaterial({{ color: 0x8b5cf6, wireframe: true }});
        activeMesh = new THREE.Mesh(geom, mat);
      }} else if (activeProject.id.includes('15')) {{
        // Titanium Torus Ring Vault
        const geom = new THREE.TorusGeometry(1.3, 0.1, 16, 64);
        const mat = new THREE.MeshBasicMaterial({{ color: 0x06b6d4, wireframe: true }});
        activeMesh = new THREE.Mesh(geom, mat);
      }} else {{
        // Global Observability Telemetry Globe
        const geom = new THREE.SphereGeometry(1.3, 32, 32);
        const mat = new THREE.MeshBasicMaterial({{ color: 0x06b6d4, wireframe: true }});
        activeMesh = new THREE.Mesh(geom, mat);
      }}

      scene.add(activeMesh);

      const light1 = new THREE.DirectionalLight(0xffffff, 2.5);
      light1.position.set(5, 5, 5);
      scene.add(light1);
      scene.add(new THREE.AmbientLight(0x1e293b, 1.5));

      let t = 0;
      const simLoop = () => {{
        simAnimId = requestAnimationFrame(simLoop);
        t += 0.01;
        activeMesh.rotation.y += 0.01;
        activeMesh.rotation.x += 0.005;
        simRenderer.render(scene, camera);
      }};
      simLoop();
    }}

    // Filter by Tier
    function filterTier(tier) {{
      document.querySelectorAll('.tier-pill').forEach(btn => {{
        btn.classList.toggle('active', btn.textContent.includes(tier) || (tier === 'all' && btn.textContent.includes('All')));
      }});
      renderProjectList(tier, document.getElementById('search-input').value);
    }}

    function handleSearch(val) {{
      renderProjectList('all', val);
    }}

    // Toast and Copy Utilities
    function copyText(str, isEncoded = false) {{
      const text = isEncoded ? decodeURIComponent(str) : str;
      navigator.clipboard.writeText(text).then(() => showToast('Copied to Clipboard!'));
    }}

    function copyCurrentCode() {{
      navigator.clipboard.writeText(currentCode).then(() => showToast('Code Copied!'));
    }}

    function showToast(msg) {{
      const toast = document.getElementById('toast');
      toast.textContent = msg;
      toast.classList.add('show');
      setTimeout(() => toast.classList.remove('show'), 2000);
    }}

    // macOS gh Modal Handlers
    function openGhModal() {{
      document.getElementById('gh-modal').classList.add('open');
    }}

    function closeGhModal() {{
      document.getElementById('gh-modal').classList.remove('open');
    }}

    // Boot Studio
    window.addEventListener('DOMContentLoaded', () => {{
      initBackground3D();
      renderProjectList();
      selectProject(PROJECTS[0].id);
    }});
  </script>
</body>
</html>
"""

    with open(OUTPUT_HTML, "w") as f:
        f.write(html_content)

    print(f"Master Studio Portal successfully written to {OUTPUT_HTML} (Size: {len(html_content)} bytes)")

if __name__ == "__main__":
    build_portal()
