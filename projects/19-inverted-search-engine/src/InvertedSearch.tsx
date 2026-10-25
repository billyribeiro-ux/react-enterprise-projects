'use client';
import React, { useState } from 'react';
import { searchDocs } from './actions';

export function InvertedSearch() {
  const [q, setQ] = useState('');
  const [results, setResults] = useState<any[]>([
    { id: '1', title: 'Three.js Shaders in React 19', content: 'Compile WebGL shaders for real-time 3D telemetry.' }
  ]);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!q.trim()) return;
    const res = await searchDocs(q);
    if (res.results) setResults(res.results);
  };

  return (
    <div className="search-root" data-testid="search-root">
      <header className="search-header">
        <h2>BM25 Inverted-Index Full-Text Search Engine</h2>
      </header>

      <form onSubmit={handleSearch} className="search-box">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search engineering repository (e.g. shaders, prisma)..."
          className="cinema-input"
          data-testid="search-input"
        />
        <button type="submit" className="btn-cinema-glow" data-testid="btn-search">Query Index →</button>
      </form>

      <div className="results-list">
        {results.map((r) => (
          <div key={r.id} className="res-card">
            <h4>{r.title}</h4>
            <p>{r.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}