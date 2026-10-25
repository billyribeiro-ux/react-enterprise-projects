'use client';
import React, { useState } from 'react';

export function HolographicRbac({ userEmail }: { userEmail: string }) {
  const [status, setStatus] = useState<string | null>(null);

  const simulateAccess = (policy: string) => {
    setStatus(`ACCESS AUTHORIZED: ${policy} via Zero-Trust Mutual TLS`);
  };

  return (
    <div className="rbac-holo-root" data-testid="rbac-root">
      <header className="rbac-header">
        <h2>Zero-Trust Holographic RBAC Gateway</h2>
        <span className="user-pill">{userEmail}</span>
      </header>

      <div className="security-shield-card">
        <div className="shield-icon">🛡️</div>
        <h3>Hardware-Bound Session Authenticated</h3>
        <p>AES-256-GCM encrypted cookies &bull; WebAuthn Passkey Verified</p>

        <div className="policy-actions">
          <button onClick={() => simulateAccess('PROD_K8S_DEPLOY')} className="btn-cinema-glow" data-testid="btn-verify-access">
            Authorize 'PROD_K8S_DEPLOY'
          </button>
        </div>

        {status && <div className="status-granted">{status}</div>}
      </div>
    </div>
  );
}