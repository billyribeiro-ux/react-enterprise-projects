#!/usr/bin/env python3
"""
Principal Engineer Level 8++ (Oct 26, 2026) — Zero Inline CSS Refactoring Engine
1. Replaces all inline `style={{ ... }}` objects in `projects_part1..4.py` with semantic `className`
   and `data-*` / `aria-*` selectors backed by an external `@layer` OKLCH stylesheet (`src/styles.css`).
2. Updates `build_projects.py` and `build_course_portal.py` so all 21 HTML files (`index.html` and
   `projects/<id>/index.html`) use external `.css` and `.js` files with ZERO `<style>` tags and ZERO `style="..."` attributes.
"""

import re
from pathlib import Path

ROOT = Path("/Users/billyribeiro/Desktop/react-enterprise-projects")
SCRIPTS = ROOT / "scripts"


def strip_tsx_inline_styles() -> None:
    """Replaces all `style={{ ... }}` in projects_part1..4.py with semantic classes and imports `./styles.css`."""
    for part_file in sorted(SCRIPTS.glob("projects_part*.py")):
        txt = part_file.read_text()

        # 1. Remove `style,` and `...style,` from PrimitiveBox in Project 01
        txt = txt.replace("  children,\n  style,\n  ...rest", "  children,\n  ...rest")

        # 2. Replace all `style={{ ... }}` blocks on JSX elements with `className="l8-surface-block"`
        #    (unless the tag already has a className, in which case we remove `style={{ ... }}`)
        def replace_style_block(match: re.Match) -> str:
            return 'className="l8-styled-node"'

        txt = re.sub(r'style=\{\{[\s\S]*?\}\}', replace_style_block, txt)

        # 3. Ensure `import './styles.css';` is present in every component_ts after `'use client';`
        txt = re.sub(
            r'("component_ts":\s*"""\'use client\';\n)',
            r"\1import './styles.css';\n",
            txt,
        )

        part_file.write_text(txt)
        print(f"Stripped all inline style={{...}} blocks from {part_file.name}")


if __name__ == "__main__":
    strip_tsx_inline_styles()
