'use client';
import './styles.css';

import React, { useDeferredValue, useMemo, useState } from 'react';

export interface CommandItem {
  slug: string;
  title: string;
  shortcut: string;
  category: string;
  invocations: number;
}

const DEFAULT_COMMANDS: CommandItem[] = [
  { slug: 'deploy-canary', title: 'Deploy Production Canary', shortcut: '⌘+D', category: 'DevOps', invocations: 48 },
  { slug: 'rotate-jwt-keys', title: 'Rotate Zero-Trust JWT Signing Keys', shortcut: '⌘+K', category: 'Security', invocations: 31 },
  { slug: 'inspect-webgl-vram', title: 'Inspect Three.js WebGL VRAM Heap', shortcut: '⌘+G', category: 'Graphics', invocations: 19 },
  { slug: 'prisma-studio-audit', title: 'Run Prisma v6 Query Plan Analyzer', shortcut: '⌘+P', category: 'Database', invocations: 64 },
];

export function scoreCommand(title: string, query: string, invocations: number): number {
  const freqBonus = Math.log2(invocations + 1) * 5;
  if (!query.trim()) return 100 + freqBonus;
  const target = title.toLowerCase();
  const q = query.toLowerCase().trim();
  if (target.includes(q)) {
    return 200 - target.indexOf(q) * 2 + freqBonus;
  }
  return -1;
}

export function CommandPaletteEngine({
  commands = DEFAULT_COMMANDS,
}: {
  commands?: CommandItem[];
}): React.JSX.Element {
  const [query, setQuery] = useState<string>('');
  const deferredQuery = useDeferredValue(query);
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [lastExecuted, setLastExecuted] = useState<string>('None');

  const ranked = useMemo(() => {
    return commands
      .map((cmd) => ({
        ...cmd,
        score: scoreCommand(cmd.title, deferredQuery, cmd.invocations),
      }))
      .filter((cmd) => cmd.score >= 0)
      .sort((a, b) => b.score - a.score);
  }, [commands, deferredQuery]);

  const activeCmd = ranked[activeIndex] ?? ranked[0];

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (ranked.length > 0 ? (prev + 1) % ranked.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (ranked.length > 0 ? (prev - 1 + ranked.length) % ranked.length : 0));
    } else if (e.key === 'Enter' && activeCmd) {
      e.preventDefault();
      setLastExecuted(activeCmd.title);
    }
  };

  return (
    <section
      aria-label="Zero-Latency Command Palette & Omni-Search Engine"
      className="l8-styled-node"
    >
      <input
        role="combobox"
        aria-expanded="true"
        aria-controls="omni-command-listbox"
        aria-activedescendant={activeCmd ? `cmd-${activeCmd.slug}` : undefined}
        aria-label="Omni-Search Command Input"
        placeholder="Type a command or search (e.g., Canary, Prisma, WebGL)..."
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setActiveIndex(0);
        }}
        onKeyDown={handleKeyDown}
        className="l8-styled-node"
      />

      <ul
        id="omni-command-listbox"
        role="listbox"
        className="l8-styled-node"
      >
        {ranked.map((cmd, idx) => {
          const isSelected = idx === activeIndex;
          return (
            <li
              key={cmd.slug}
              id={`cmd-${cmd.slug}`}
              role="option"
              aria-selected={isSelected}
              onClick={() => setLastExecuted(cmd.title)}
              className="l8-styled-node"
            >
              <div>
                <div className="l8-styled-node">{cmd.title}</div>
                <div className="l8-styled-node">
                  {cmd.category} • Score: {cmd.score.toFixed(1)}
                </div>
              </div>
              <kbd
                className="l8-styled-node"
              >
                {cmd.shortcut}
              </kbd>
            </li>
          );
        })}
      </ul>

      <footer className="l8-styled-node">
        Last Executed Command: <strong data-testid="executed-cmd">{lastExecuted}</strong>
      </footer>
    </section>
  );
}
