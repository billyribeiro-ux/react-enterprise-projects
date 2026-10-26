'use client';

import React, { useState } from 'react';
import { computeBm25Score } from './actions';

interface CorpusDoc {
  slug: string;
  title: string;
  domain: 'Database' | 'WebGL' | 'Security';
  docLen: number;
}

const CORPUS: CorpusDoc[] = [
  { slug: 'doc-1', title: 'Prisma v6 Optimistic Concurrency Control & Prisma Indexes', domain: 'Database', docLen: 42 },
  { slug: 'doc-2', title: 'Three.js WebGL PBR Shader & GPU Memory Disposal', domain: 'WebGL', docLen: 38 },
  { slug: 'doc-3', title: 'Zero-Trust AES-GCM WebCrypto Enclave Architecture', domain: 'Security', docLen: 45 },
];

export function Bm25SearchEngine(): React.JSX.Element {
  const [facet, setFacet] = useState<'ALL' | 'Database' | 'WebGL' | 'Security'>('ALL');

  const filtered = CORPUS.filter((d) => facet === 'ALL' || d.domain === facet).map((d) => ({
    ...d,
    bm25: computeBm25Score(d.domain === 'Database' ? 3 : 2, d.docLen),
  }));

  return (
    <section
      aria-label="BM25 Probabilistic Search & Disjunctive Faceted Engine"
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
        OKAPI BM25 PROBABILISTIC RANKING (k1=1.5, b=0.75) • DISJUNCTIVE FACETS
      </span>
      <h2 style={{ margin: '0.35rem 0 1rem', fontSize: '1.45rem', fontWeight: 800 }}>
        Matched Documents: <span data-testid="doc-count" style={{ color: '#4ade80' }}>{filtered.length}</span>
      </h2>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(['ALL', 'Database', 'WebGL', 'Security'] as const).map((dom) => (
          <button
            key={dom}
            type="button"
            aria-pressed={facet === dom}
            onClick={() => setFacet(dom)}
            style={{
              padding: '0.45rem 0.9rem',
              borderRadius: '8px',
              background: facet === dom ? '#38bdf8' : '#1e293b',
              color: facet === dom ? '#090d16' : '#f8fafc',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {dom}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {filtered.map((doc) => (
          <article
            key={doc.slug}
            style={{
              padding: '0.9rem 1.1rem',
              borderRadius: '10px',
              background: 'rgba(15, 23, 42, 0.75)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>{doc.title}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Facet: {doc.domain}</div>
            </div>
            <code style={{ color: '#4ade80', fontWeight: 700 }}>BM25: {doc.bm25}</code>
          </article>
        ))}
      </div>
    </section>
  );
}
