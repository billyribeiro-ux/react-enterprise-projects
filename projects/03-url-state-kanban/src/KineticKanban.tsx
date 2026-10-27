'use client';
import './styles.css';

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
      className="l8-styled-node"
    >
      <header
        className="l8-styled-node"
      >
        <div>
          <span className="l8-styled-node">
            O(1) LEXORANK FRACTIONAL INDEXING • URL DEEP-LINK READY
          </span>
          <h2 className="l8-styled-node">
            Kinetic Sprint Telemetry Board
          </h2>
        </div>

        <input
          type="search"
          aria-label="Filter Sprint Tasks"
          placeholder="Filter tasks (?q=...)"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="l8-styled-node"
        />
      </header>

      <div
        ref={boardRef}
        className="l8-styled-node"
      >
        {COLUMNS.map((col) => {
          const colCards = filteredCards
            .filter((c) => c.status === col.id)
            .sort((a, b) => a.orderRank - b.orderRank);

          return (
            <div
              key={col.id}
              data-testid={`column-${col.id}`}
              className="l8-styled-node"
            >
              <h3 className="l8-styled-node">
                {col.label} ({colCards.length})
              </h3>
              <div className="l8-styled-node">
                {colCards.map((card) => (
                  <article
                    key={card.id}
                    className="l8-styled-node"
                  >
                    <div className="l8-styled-node">{card.title}</div>
                    <div
                      className="l8-styled-node"
                    >
                      <span>Rank: {card.orderRank} • {card.points} pts</span>
                      <button
                        type="button"
                        onClick={() => advanceCard(card.id)}
                        className="l8-styled-node"
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

      <footer className="l8-styled-node">
        Completed Velocity: <strong data-testid="done-points">{donePoints} pts</strong>
      </footer>
    </section>
  );
}
