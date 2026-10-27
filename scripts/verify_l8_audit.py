#!/usr/bin/env python3
"""
Principal Engineer Level 8+ (Oct 26, 2026) — Automated Zero-Drift, Zero-Any & Completeness Auditor
Audits all 20 Enterprise Projects and all 21 Course HTML files (root index.html + 20 per-project index.html).
"""

import html
import json
import re
from pathlib import Path

ROOT = Path("/Users/billyribeiro/Desktop/react-enterprise-projects")


def main() -> None:
    js_text = (ROOT / "projects-data.js").read_text()
    prefix = "window.ENTERPRISE_PROJECTS_DATA = "
    assert js_text.startswith(prefix), "projects-data.js header malformed"
    data = json.loads(js_text[len(prefix) :].rstrip(";\n"))
    assert len(data) == 20, f"Expected 20 projects, got {len(data)}"

    master_html = (ROOT / "index.html").read_text()
    assert ".slice(0, 800)" not in master_html, "Found forbidden code truncation in root index.html"
    assert not re.search(r"<style\b|\bstyle\s*=", master_html, re.I), "Forbidden inline CSS in root index.html"

    required_css_primitives = [
        "@layer reset, tokens, base, layout, components, utilities;",
        "--color-surface-bg:",
        "--color-brand-primary:",
        "oklch(from ",
        "color-mix(in oklch,",
        "clamp(",
        "@container",
        ":has(",
        "@starting-style",
        "text-wrap: balance",
        "100dvh",
        "padding-inline",
    ]
    portal_css = (ROOT / "portal.css").read_text()
    for prim in required_css_primitives:
        assert prim in portal_css, f"Missing Oct 27, 2026 CSS primitive `{prim}` in portal.css"

    total_files_verified = 0
    for p in data:
        pid = p["id"]
        pdir = ROOT / "projects" / pid
        assert pdir.exists(), f"Missing directory {pdir}"

        # 1. Verify L8+ Curriculum Metadata
        assert p.get("desc") and p["desc"] != "undefined", f"Missing desc in {pid}"
        assert p.get("architecture") and len(p["architecture"]) > 80, f"Weak architecture note in {pid}"
        assert len(p.get("deepDive", [])) >= 2, f"Missing deepDive items in {pid}"
        assert len(p.get("kpis", [])) == 3, f"Expected 3 KPIs in {pid}"
        assert len(p.get("steps", [])) == 5, f"Expected 5 follow-along steps in {pid}"

        # 2. Verify Multi-Model Relational Prisma v6 Schema
        schema = (pdir / "prisma" / "schema.prisma").read_text()
        models = re.findall(r"^model\s+\w+", schema, flags=re.M)
        assert len(models) >= 2, f"Expected >=2 relational models in {pid}, found {models}"
        assert "@relation" in schema, f"Missing @relation in {pid}/prisma/schema.prisma"
        if pid == "18-i18n-rtl-global-cms":
            assert "@@unique([slug, locale])" in schema, "Project 18 must use @@unique([slug, locale])"

        # 3. Verify Zero `any` Types AND Zero Inline `style={{` Across All TypeScript/TSX Files
        for ts_file in pdir.rglob("*.ts*"):
            content = ts_file.read_text()
            assert not re.search(r":\s*any\b|as\s+any\b|<any>", content), f"Forbidden `any` in {ts_file}"
            assert not re.search(r"\bstyle\s*=", content), f"Forbidden inline `style=` in {ts_file}"
            total_files_verified += 1

        # 4. Verify 100% Untruncated Byte-for-Byte Match Between Disk Source Files and Course Steps
        comp_name = p["componentName"]
        disk_schema = (pdir / "prisma" / "schema.prisma").read_text().strip()
        disk_seed = (pdir / "prisma" / "seed.ts").read_text().strip()
        disk_db = (pdir / "src" / "db.ts").read_text().strip()
        disk_actions = (pdir / "src" / "actions.ts").read_text().strip()
        disk_comp = (pdir / "src" / f"{comp_name}.tsx").read_text().strip()
        disk_unit = (pdir / "tests" / "unit.test.tsx").read_text().strip()
        disk_e2e = (pdir / "tests" / "e2e.spec.ts").read_text().strip()

        assert disk_schema == p["steps"][0]["code"].strip(), f"Step 1 schema mismatch in {pid}"
        assert disk_seed == p["steps"][1]["code"].strip(), f"Step 2 seed mismatch in {pid}"
        assert disk_db in p["steps"][2]["code"] and disk_actions in p["steps"][2]["code"], f"Step 3 actions mismatch in {pid}"
        assert disk_comp in p["steps"][3]["code"], f"Step 4 component mismatch in {pid}"
        assert disk_unit in p["steps"][4]["code"] and disk_e2e in p["steps"][4]["code"], f"Step 5 tests mismatch in {pid}"

        # 5. Verify Standalone Per-Project Course HTML Page (`projects/<id>/index.html`) Has Zero Inline CSS
        proj_html = (pdir / "index.html").read_text()
        assert not re.search(r"<style\b|\bstyle\s*=", proj_html, re.I), f"Forbidden inline CSS in {pid}/index.html"
        assert (pdir / "course.css").exists() and (pdir / "course.js").exists(), f"Missing external course.css/js in {pid}"
        for css_file in [pdir / "src" / "styles.css", pdir / "course.css"]:
            css_txt = css_file.read_text()
            for prim in required_css_primitives:
                assert prim in css_txt, f"Missing Oct 27, 2026 CSS primitive `{prim}` in {css_file}"
        assert html.escape(disk_comp) in proj_html, f"Untruncated component code missing from {pid}/index.html"
        assert html.escape(disk_actions) in proj_html, f"Untruncated actions code missing from {pid}/index.html"
        assert html.escape(disk_schema) in proj_html, f"Untruncated schema code missing from {pid}/index.html"
        total_files_verified += 1

    print(
        f"✅ L8++ PRINCIPAL ENGINEER AUDIT PASSED: 20/20 Projects, 21/21 Interactive Course HTML Pages, "
        f"{total_files_verified} Source & Course Artifacts Verified (0 `any`, 0 inline `<style>`/`style=`, 0 truncations, 100% external CSS)."
    )


if __name__ == "__main__":
    main()
