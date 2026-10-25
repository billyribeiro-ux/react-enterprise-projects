'use client';
import React, { useState } from 'react';

export function CyberAuditFeed({ initialLogs }: { initialLogs: any[] }) {
  const [logs] = useState(initialLogs);

  return (
    <div className="cyber-feed-root" data-testid="audit-feed-root">
      <header className="cyber-header">
        <h2>Zero-Trust Cybernetic Audit Stream</h2>
        <span className="telemetry-counter">{logs.length} Buffered Events (Sub-16ms INP)</span>
      </header>

      <div className="audit-table-wrapper">
        <table className="cyber-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Actor</th>
              <th>Action</th>
              <th>Severity</th>
              <th>Network Node</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr key={l.id} className={`row-${l.severity}`} data-testid="audit-row">
                <td>{new Date(l.timestamp).toLocaleTimeString()}</td>
                <td><code>{l.actorEmail}</code></td>
                <td><span className="action-pill">{l.actionType}</span></td>
                <td><span className={`severity-tag ${l.severity}`}>{l.severity.toUpperCase()}</span></td>
                <td>{l.ipAddress}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}