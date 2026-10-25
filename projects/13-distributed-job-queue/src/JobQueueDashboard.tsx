'use client';
import React, { useState } from 'react';
import { requeueJob } from './actions';

export function JobQueueDashboard({ initialJobs }: { initialJobs: any[] }) {
  const [jobs, setJobs] = useState(initialJobs);

  const handleRequeue = async (id: string) => {
    setJobs((prev: any[]) => prev.map((j) => (j.id === id ? { ...j, status: 'queued', attempts: 0 } : j)));
    await requeueJob(id);
  };

  return (
    <div className="jobqueue-root" data-testid="jobqueue-root">
      <header className="queue-header">
        <h2>Distributed Job Queue &bull; DLQ Telemetry</h2>
        <span className="live-pill">Workers: 16 Cores</span>
      </header>

      <table className="jobs-table">
        <thead>
          <tr><th>ID</th><th>Queue</th><th>Status</th><th>Attempts</th><th>Action</th></tr>
        </thead>
        <tbody>
          {jobs.map((j) => (
            <tr key={j.id} className={`status-${j.status}`}>
              <td><code>{j.id}</code></td>
              <td>{j.queueName}</td>
              <td><span className="pill">{j.status}</span></td>
              <td>{j.attempts} / 3</td>
              <td>
                {j.status === 'failed' && (
                  <button onClick={() => handleRequeue(j.id)} className="btn-retry" data-testid={`retry-${j.id}`}>
                    Requeue
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}