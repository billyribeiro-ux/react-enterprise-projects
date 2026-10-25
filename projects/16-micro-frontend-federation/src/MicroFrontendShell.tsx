'use client';
import React, { useState } from 'react';

export function MicroFrontendShell() {
  const [tab, setTab] = useState<'analytics' | 'billing'>('analytics');

  return (
    <div className="mfe-root" data-testid="mfe-root">
      <header className="mfe-header">
        <h2>Vite Module Federation Enterprise Host Shell</h2>
        <div className="tabs">
          <button onClick={() => setTab('analytics')} className={tab === 'analytics' ? 'active' : ''} data-testid="tab-analytics">Analytics</button>
          <button onClick={() => setTab('billing')} className={tab === 'billing' ? 'active' : ''} data-testid="tab-billing">Billing</button>
        </div>
      </header>

      <div className="remote-view">
        <h3>Active Federated Container: {tab.toUpperCase()}</h3>
        <p>Zero vendor duplication via shared React 19 singletons.</p>
      </div>
    </div>
  );
}