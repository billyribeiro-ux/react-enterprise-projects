'use client';
import React, { useState } from 'react';
import { updateCollabBlock } from './actions';

export function HolographicCollabDoc({ initialBlocks }: { initialBlocks: any[] }) {
  const [blocks, setBlocks] = useState(initialBlocks);

  const handleEdit = async (id: string, text: string) => {
    setBlocks((prev: any[]) => prev.map((b) => (b.id === id ? { ...b, content: text } : b)));
    await updateCollabBlock(id, text);
  };

  return (
    <div className="collab-doc-root" data-testid="collab-root">
      <header className="collab-header">
        <h2>Holographic Real-Time Document Canvas</h2>
        <div className="avatars-stream">
          <span className="live-avatar">BR</span>
          <span className="live-avatar">AI</span>
        </div>
      </header>

      <div className="doc-blocks">
        {blocks.map((b) => (
          <div key={b.id} className="block-card">
            <textarea
              value={b.content}
              onChange={(e) => handleEdit(b.id, e.target.value)}
              className="block-editor"
              data-testid={`block-${b.id}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}