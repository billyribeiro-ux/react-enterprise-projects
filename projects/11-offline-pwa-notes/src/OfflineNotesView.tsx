'use client';
import React, { useState } from 'react';

export function OfflineNotesView({ initialNotes }: { initialNotes: any[] }) {
  const [notes] = useState(initialNotes);

  return (
    <div className="offline-notes-root" data-testid="offline-root">
      <header className="notes-header">
        <h2>Local-First Offline Vector Notes Engine</h2>
        <span className="pwa-badge">IndexedDB Synced</span>
      </header>

      <div className="notes-grid">
        {notes.map((n) => (
          <div key={n.id} className="note-card">
            <h3>{n.title}</h3>
            <p>{n.content}</p>
            <span className="ver-tag">v{n.version}</span>
          </div>
        ))}
      </div>
    </div>
  );
}