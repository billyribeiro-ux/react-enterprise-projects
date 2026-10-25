'use client';
import React, { useState, useOptimistic, useTransition } from 'react';
import { sendChatMessage } from './actions';

export function CinematicCopilot({ initialMessages, convId }: { initialMessages: any[]; convId: string }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState('');
  const [isPending, startTransition] = useTransition();

  const [optimisticMsgs, addOptimistic] = useOptimistic(messages, (prev, next: any) => [...prev, next]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = { id: `opt-${Date.now()}`, role: 'user', content: input };
    addOptimistic(userMsg);
    setInput('');

    startTransition(async () => {
      await sendChatMessage(convId, userMsg.content);
      setMessages((prev) => [...prev, userMsg]);
    });
  };

  return (
    <div className="cinema-copilot-root" data-testid="copilot-root">
      <header className="copilot-header">
        <h2>Cinematic AI Streaming Copilot &bull; Gemini 2.5 Ultra</h2>
        <span className="pill-model">Streaming Token Engine</span>
      </header>

      <div className="copilot-chat-box">
        {optimisticMsgs.map((m: any) => (
          <div key={m.id} className={`chat-message role-${m.role}`}>
            <strong>{m.role === 'user' ? 'Operator' : 'Gemini Ultra'}</strong>
            <p>{m.content}</p>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="copilot-input-form">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask complex architectural queries..."
          className="cinema-input"
          data-testid="copilot-input"
        />
        <button type="submit" disabled={isPending} className="btn-cinema-glow" data-testid="copilot-send">
          {isPending ? 'Synthesizing...' : 'Transmit Prompt →'}
        </button>
      </form>
    </div>
  );
}