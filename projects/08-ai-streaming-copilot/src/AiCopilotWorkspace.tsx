'use client';
import './styles.css';

import React, { useOptimistic, useState, useTransition } from 'react';

export interface CopilotTurn {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  optimistic?: boolean;
}

export function AiCopilotWorkspace(): React.JSX.Element {
  const [messages, setMessages] = useState<CopilotTurn[]>([
    {
      id: 'm-init',
      role: 'assistant',
      content: 'Principal Copilot Online • TTFT 28ms • Ready for Architecture Audit.',
    },
  ]);
  const [prompt, setPrompt] = useState<string>('');
  const [isPending, startTransition] = useTransition();

  const [optimisticMessages, addOptimisticMessage] = useOptimistic<CopilotTurn[], CopilotTurn>(
    messages,
    (current, newTurn) => [...current, newTurn]
  );

  const handleSend = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const trimmed = prompt.trim();
    if (!trimmed) return;
    setPrompt('');

    startTransition(() => {
      addOptimisticMessage({
        id: `opt-${Date.now()}`,
        role: 'user',
        content: trimmed,
        optimistic: true,
      });

      setMessages((prev) => [
        ...prev,
        { id: `usr-${Date.now()}`, role: 'user', content: trimmed },
        {
          id: `ast-${Date.now()}`,
          role: 'assistant',
          content: `Generative UI Diagnostic for "${trimmed}": Sub-16ms frame budget verified.`,
        },
      ]);
    });
  };

  return (
    <section
      aria-label="Streaming AI Copilot & Generative UI Workspace"
      className="l8-styled-node"
    >
      <header className="l8-styled-node">
        <span className="l8-styled-node">
          REACT 19 USEOPTIMISTIC STREAM • GENERATIVE SERVER ARTIFACTS
        </span>
        <h2 className="l8-styled-node">
          Agentic Architecture Copilot
        </h2>
      </header>

      <div
        role="log"
        aria-live="polite"
        data-testid="copilot-log"
        className="l8-styled-node"
      >
        {optimisticMessages.map((msg) => (
          <div
            key={msg.id}
            className="l8-styled-node"
          >
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} className="l8-styled-node">
        <input
          type="text"
          aria-label="Copilot Prompt Input"
          placeholder="Ask Copilot to synthesize an architecture diagram..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="l8-styled-node"
        />
        <button
          type="submit"
          disabled={isPending}
          className="l8-styled-node"
        >
          Stream Synthesis
        </button>
      </form>
    </section>
  );
}
