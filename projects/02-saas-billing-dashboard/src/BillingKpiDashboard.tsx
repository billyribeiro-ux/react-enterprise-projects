'use client';
import './styles.css';

import React, { useActionState, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { upgradeTenantPlanAction, type BillingActionResult } from './actions';

const TIERS = [
  { id: 'STARTER' as const, name: 'Starter Cloud', pricePerSeat: 49, nrr: 108 },
  { id: 'GROWTH' as const, name: 'Growth Scale', pricePerSeat: 89, nrr: 124 },
  { id: 'ENTERPRISE' as const, name: 'Enterprise AI', pricePerSeat: 120, nrr: 138 },
];

export function BillingKpiDashboard({
  tenantSlug = 'acme-global-ai',
  initialSeats = 120,
  initialVersion = 1,
}: {
  tenantSlug?: string;
  initialSeats?: number;
  initialVersion?: number;
}): React.JSX.Element {
  const [selectedTier, setSelectedTier] = useState<'STARTER' | 'GROWTH' | 'ENTERPRISE'>('ENTERPRISE');
  const [seats, setSeats] = useState<number>(initialSeats);
  const [state, formAction, isPending] = useActionState<BillingActionResult, FormData>(
    upgradeTenantPlanAction,
    { status: 'idle' }
  );

  const ringRef = useRef<SVGCircleElement | null>(null);
  const activeTierMeta = TIERS.find((t) => t.id === selectedTier) ?? TIERS[2]!;
  const projectedMrr = seats * activeTierMeta.pricePerSeat;
  const projectedArr = projectedMrr * 12;
  const activeVersion = state.status === 'success' ? state.data.version : initialVersion;

  useEffect(() => {
    if (ringRef.current) {
      const circumference = 2 * Math.PI * 52;
      const ratio = Math.min(projectedArr / 250000, 1);
      gsap.to(ringRef.current, {
        strokeDashoffset: circumference * (1 - ratio),
        duration: 0.75,
        ease: 'power3.out',
      });
    }
  }, [projectedArr]);

  return (
    <section
      aria-label="Multi-Tenant SaaS Billing & Executive KPI Cockpit"
      className="l8-styled-node"
    >
      <div>
        <span className="l8-styled-node">
          Tenant: {tenantSlug} • OCC Lock v{activeVersion}
        </span>
        <h2 className="l8-styled-node">
          Executive ARR & Seat Allocation
        </h2>

        <div
          role="group"
          aria-label="Subscription Plan Tiers"
          className="l8-styled-node"
        >
          {TIERS.map((tier) => {
            const isSelected = selectedTier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedTier(tier.id)}
                className="l8-styled-node"
              >
                <div className="l8-styled-node">{tier.name}</div>
                <div className="l8-styled-node">
                  ${tier.pricePerSeat}/seat
                </div>
              </button>
            );
          })}
        </div>

        <form action={formAction} className="l8-styled-node">
          <input type="hidden" name="tenantSlug" value={tenantSlug} />
          <input type="hidden" name="planTier" value={selectedTier} />
          <input type="hidden" name="expectedVersion" value={activeVersion} />

          <label className="l8-styled-node">
            <span>Provisioned Seats: {seats}</span>
            <input
              type="range"
              name="seats"
              min={10}
              max={500}
              value={seats}
              onChange={(e) => setSeats(Number(e.target.value))}
            />
          </label>

          <button
            type="submit"
            disabled={isPending}
            className="l8-styled-node"
          >
            {isPending ? 'Verifying OCC Lock...' : 'Commit Multi-Tenant Seat Allocation'}
          </button>
        </form>

        {state.status === 'conflict' && (
          <p role="alert" className="l8-styled-node">
            {state.message}
          </p>
        )}
      </div>

      {/* Hollywood Radial KPI Telemetry Gauge */}
      <div
        className="l8-styled-node"
      >
        <svg width="150" height="150" viewBox="0 0 130 130" aria-label="Projected ARR Radial Gauge">
          <circle cx="65" cy="65" r="52" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="10" />
          <circle
            ref={ringRef}
            cx="65"
            cy="65"
            r="52"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 52}
            strokeDashoffset={2 * Math.PI * 52 * 0.25}
            transform="rotate(-90 65 65)"
          />
          <text x="65" y="62" textAnchor="middle" fill="#f8fafc" fontSize="14" fontWeight="800">
            ${(projectedArr / 1000).toFixed(1)}k
          </text>
          <text x="65" y="80" textAnchor="middle" fill="#94a3b8" fontSize="9">
            ANNUAL RUN RATE
          </text>
        </svg>
        <div data-testid="projected-mrr" className="l8-styled-node">
          MRR: ${projectedMrr.toLocaleString()}/mo • NRR: {activeTierMeta.nrr}%
        </div>
      </div>
    </section>
  );
}
