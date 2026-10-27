'use client';
import './styles.css';

import React, { useState } from 'react';

export interface RemoteModuleSlot {
  scope: string;
  version: string;
  sriVerified: boolean;
  crashed: boolean;
}

export function MicroFrontendHost(): React.JSX.Element {
  const [remotes, setRemotes] = useState<RemoteModuleSlot[]>([
    { scope: '@acme/billing-cockpit', version: 'v3.1.0', sriVerified: true, crashed: false },
    { scope: '@acme/recommendations-ai', version: 'v1.9.4-canary', sriVerified: true, crashed: false },
  ]);

  const toggleFault = (scope: string): void => {
    setRemotes((prev) =>
      prev.map((r) => (r.scope === scope ? { ...r, crashed: !r.crashed } : r))
    );
  };

  return (
    <section
      aria-label="Micro-Frontend Federation Host & SRI Shell"
      className="l8-styled-node"
    >
      <span className="l8-styled-node">
        MODULE FEDERATION ISOLATION • SHA-384 SUBRESOURCE INTEGRITY
      </span>
      <h2 className="l8-styled-node">
        Host Shell Status: <span data-testid="host-shell-status" className="l8-styled-node">100% HEALTHY</span>
      </h2>

      <div className="l8-styled-node">
        {remotes.map((rem) => (
          <article
            key={rem.scope}
            data-testid={`slot-${rem.scope}`}
            className="l8-styled-node"
          >
            <div className="l8-styled-node">{rem.scope}</div>
            <div className="l8-styled-node">
              {rem.version} • SRI SHA-384 Verified
            </div>

            {rem.crashed ? (
              <div role="alert" className="l8-styled-node">
                ErrorBoundary Contained Fault! Host shell unaffected.
              </div>
            ) : (
              <div className="l8-styled-node">
                Remote Mounted & Streaming
              </div>
            )}

            <button
              type="button"
              onClick={() => toggleFault(rem.scope)}
              className="l8-styled-node"
            >
              {rem.crashed ? 'Rollback to Last Known Good' : `Inject Fault in ${rem.scope}`}
            </button>
          </article>
        ))}
      </div>
    </section>
  );
}
