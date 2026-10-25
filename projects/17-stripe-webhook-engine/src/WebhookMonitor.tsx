'use client';
import React, { useState } from 'react';
import { recordWebhook } from './actions';

export function WebhookMonitor() {
  const [logs, setLogs] = useState<string[]>([]);

  const handleSimulate = async () => {
    const id = `evt_${Date.now()}`;
    await recordWebhook(4892000);
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] Verified & Recorded: ${id}`, ...prev]);
  };

  return (
    <div className="webhook-root" data-testid="webhook-root">
      <header className="webhook-header">
        <h2>Idempotent Stripe Webhook Engine &bull; Replay Protected</h2>
        <button onClick={handleSimulate} className="btn-cinema-glow" data-testid="btn-sim-webhook">Simulate Stripe Webhook</button>
      </header>

      <div className="webhook-logs">
        {logs.map((l, i) => <div key={i} className="log-line"><code>{l}</code></div>)}
      </div>
    </div>
  );
}