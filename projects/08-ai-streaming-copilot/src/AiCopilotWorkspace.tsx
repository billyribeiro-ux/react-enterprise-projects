'use client';

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
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <header style={{ marginBottom: '1rem' }}>
        <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
          REACT 19 USEOPTIMISTIC STREAM • GENERATIVE SERVER ARTIFACTS
        </span>
        <h2 style={{ margin: '0.25rem 0', fontSize: '1.45rem', fontWeight: 800 }}>
          Agentic Architecture Copilot
        </h2>
      </header>

      <div
        role="log"
        aria-live="polite"
        data-testid="copilot-log"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem',
          marginBottom: '1.25rem',
          padding: '1rem',
          background: '#0f172a',
          borderRadius: '12px',
        }}
      >
        {optimisticMessages.map((msg) => (
          <div
            key={msg.id}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              background: msg.role === 'user' ? '#38bdf8' : '#1e293b',
              color: msg.role === 'user' ? '#090d16' : '#f8fafc',
              padding: '0.7rem 1rem',
              borderRadius: '10px',
              fontWeight: msg.role === 'user' ? 700 : 500,
              maxWidth: '85%',
            }}
          >
            {msg.content}
          </div>
        ))}
      </div>

      <form onSubmit={handleSend} style={{ display: 'flex', gap: '0.75rem' }}>
        <input
          type="text"
          aria-label="Copilot Prompt Input"
          placeholder="Ask Copilot to synthesize an architecture diagram..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          style={{
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '10px',
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        />
        <button
          type="submit"
          disabled={isPending}
          style={{
            padding: '0.75rem 1.25rem',
            borderRadius: '10px',
            background: '#38bdf8',
            color: '#090d16',
            fontWeight: 700,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Stream Synthesis
        </button>
      </form>
    </section>
  );
}
