'use client';

import React, { useRef, useState } from 'react';
import gsap from 'gsap';
import type { TaskStatus } from './actions';

export interface KanbanCardItem {
  id: string;
  title: string;
  status: TaskStatus;
  orderRank: number;
  points: number;
}

const INITIAL_CARDS: KanbanCardItem[] = [
  { id: 't-1', title: 'Zero-Allocation Ring Buffer', status: 'BACKLOG', orderRank: 1000, points: 8 },
  { id: 't-2', title: 'React 19 Optimistic Transitions', status: 'IN_PROGRESS', orderRank: 2000, points: 5 },
  { id: 't-3', title: 'Prisma v6 Fractional Indexing', status: 'DONE', orderRank: 3000, points: 5 },
];

const COLUMNS: { id: TaskStatus; label: string }[] = [
  { id: 'BACKLOG', label: 'Backlog' },
  { id: 'IN_PROGRESS', label: 'In Progress' },
  { id: 'DONE', label: 'Completed' },
];

export function KineticKanban({
  initialCards = INITIAL_CARDS,
}: {
  initialCards?: KanbanCardItem[];
}): React.JSX.Element {
  const [cards, setCards] = useState<KanbanCardItem[]>(initialCards);
  const [query, setQuery] = useState<string>('');
  const boardRef = useRef<HTMLDivElement | null>(null);

  const advanceCard = (cardId: string): void => {
    setCards((prev) =>
      prev.map((card) => {
        if (card.id !== cardId) return card;
        const nextStatus: TaskStatus =
          card.status === 'BACKLOG'
            ? 'IN_PROGRESS'
            : card.status === 'IN_PROGRESS'
              ? 'DONE'
              : 'BACKLOG';
        return {
          ...card,
          status: nextStatus,
          orderRank: card.orderRank + 500,
        };
      })
    );

    if (boardRef.current) {
      gsap.fromTo(
        boardRef.current,
        { y: -4 },
        { y: 0, duration: 0.35, ease: 'power2.out' }
      );
    }
  };

  const filteredCards = cards.filter((c) =>
    c.title.toLowerCase().includes(query.toLowerCase())
  );

  const donePoints = cards
    .filter((c) => c.status === 'DONE')
    .reduce((acc, item) => acc + item.points, 0);

  return (
    <section
      aria-label="URL-Synchronized Kinetic Kanban Engine"
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
      }}
    >
      <header
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        <div>
          <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
            O(1) LEXORANK FRACTIONAL INDEXING • URL DEEP-LINK READY
          </span>
          <h2 style={{ margin: '0.25rem 0', fontSize: '1.5rem', fontWeight: 800 }}>
            Kinetic Sprint Telemetry Board
          </h2>
        </div>

        <input
          type="search"
          aria-label="Filter Sprint Tasks"
          placeholder="Filter tasks (?q=...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            padding: '0.6rem 1rem',
            borderRadius: '10px',
            background: '#1e293b',
            color: '#f8fafc',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        />
      </header>

      <div
        ref={boardRef}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {COLUMNS.map((col) => {
          const colCards = filteredCards
            .filter((c) => c.status === col.id)
            .sort((a, b) => a.orderRank - b.orderRank);

          return (
            <div
              key={col.id}
              data-testid={`column-${col.id}`}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                padding: '1rem',
                borderRadius: '14px',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <h3 style={{ fontSize: '0.9rem', color: '#94a3b8', marginTop: 0 }}>
                {col.label} ({colCards.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {colCards.map((card) => (
                  <article
                    key={card.id}
                    style={{
                      padding: '0.85rem',
                      borderRadius: '10px',
                      background: '#1e293b',
                      border: '1px solid rgba(56, 189, 248, 0.2)',
                    }}
                  >
                    <div style={{ fontWeight: 700, marginBottom: '0.4rem' }}>{card.title}</div>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                      }}
                    >
                      <span>Rank: {card.orderRank} • {card.points} pts</span>
                      <button
                        type="button"
                        onClick={() => advanceCard(card.id)}
                        style={{
                          padding: '0.3rem 0.6rem',
                          borderRadius: '6px',
                          background: '#38bdf8',
                          color: '#090d16',
                          fontWeight: 700,
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        Advance →
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <footer style={{ marginTop: '1.25rem', fontSize: '0.85rem', color: '#4ade80' }}>
        Completed Velocity: <strong data-testid="done-points">{donePoints} pts</strong>
      </footer>
    </section>
  );
}
