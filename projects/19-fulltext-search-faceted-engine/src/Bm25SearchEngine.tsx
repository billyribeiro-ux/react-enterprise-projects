'use client';
import './styles.css';

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
      className="l8-styled-node"
    >
      <span className="l8-styled-node">
        OKAPI BM25 PROBABILISTIC RANKING (k1=1.5, b=0.75) • DISJUNCTIVE FACETS
      </span>
      <h2 className="l8-styled-node">
        Matched Documents: <span data-testid="doc-count" className="l8-styled-node">{filtered.length}</span>
      </h2>

      <div className="l8-styled-node">
        {(['ALL', 'Database', 'WebGL', 'Security'] as const).map((dom) => (
          <button
            key={dom}
            type="button"
            aria-pressed={facet === dom}
            onClick={() => setFacet(dom)}
            className="l8-styled-node"
          >
            {dom}
          </button>
        ))}
      </div>

      <div className="l8-styled-node">
        {filtered.map((doc) => (
          <article
            key={doc.slug}
            className="l8-styled-node"
          >
            <div>
              <div className="l8-styled-node">{doc.title}</div>
              <div className="l8-styled-node">Facet: {doc.domain}</div>
            </div>
            <code className="l8-styled-node">BM25: {doc.bm25}</code>
          </article>
        ))}
      </div>
    </section>
  );
}
