'use client';
import React, { useState, useTransition } from 'react';
import { moveKineticTask } from './actions';

interface Column {
  id: string;
  title: string;
  tasks: Array<{ id: string; title: string; priority: string }>;
}

export function KineticKanban({ initialColumns }: { initialColumns: Column[] }) {
  const [columns, setColumns] = useState(initialColumns);
  const [isPending, startTransition] = useTransition();

  const handleShift = (taskId: string, fromId: string, toId: string) => {
    startTransition(async () => {
      setColumns((prev) => {
        const next = JSON.parse(JSON.stringify(prev)) as Column[];
        const source = next.find((c) => c.id === fromId);
        const dest = next.find((c) => c.id === toId);
        if (!source || !dest) return prev;
        const idx = source.tasks.findIndex((t) => t.id === taskId);
        if (idx === -1) return prev;
        const [moved] = source.tasks.splice(idx, 1);
        dest.tasks.push(moved);
        return next;
      });
      await moveKineticTask(taskId, toId);
    });
  };

  return (
    <div className="kinetic-kanban-root" data-testid="kanban-root">
      <header className="kanban-header">
        <h2>Kinetic URL-State Kanban &bull; GSAP Spring Physics</h2>
        <span className="sync-badge">{isPending ? 'Syncing...' : 'Live Synced'}</span>
      </header>

      <div className="columns-grid">
        {columns.map((col, cIdx) => (
          <div key={col.id} className="kanban-col-card" data-testid={`col-${col.id}`}>
            <div className="col-header">
              <h3>{col.title}</h3>
              <span className="badge-count">{col.tasks.length}</span>
            </div>

            <div className="col-tasks">
              {col.tasks.map((task) => (
                <div key={task.id} className="kinetic-card" data-testid={`task-${task.id}`}>
                  <div className="card-top">
                    <span className={`pill-priority ${task.priority}`}>{task.priority}</span>
                    <button
                      onClick={() => {
                        const nextCol = columns[(cIdx + 1) % columns.length];
                        handleShift(task.id, col.id, nextCol.id);
                      }}
                      className="btn-arrow"
                      aria-label="Shift task"
                    >
                      &rarr;
                    </button>
                  </div>
                  <p className="task-title">{task.title}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}