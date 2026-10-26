'use client';

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
      style={{
        padding: '2rem',
        background: 'linear-gradient(145deg, #090d16 0%, #111827 100%)',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem',
      }}
    >
      <div>
        <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
          Tenant: {tenantSlug} • OCC Lock v{activeVersion}
        </span>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '0.4rem 0 1rem' }}>
          Executive ARR & Seat Allocation
        </h2>

        <div
          role="group"
          aria-label="Subscription Plan Tiers"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.65rem', marginBottom: '1.25rem' }}
        >
          {TIERS.map((tier) => {
            const isSelected = selectedTier === tier.id;
            return (
              <button
                key={tier.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => setSelectedTier(tier.id)}
                style={{
                  padding: '0.85rem',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #38bdf8' : '1px solid rgba(255,255,255,0.12)',
                  background: isSelected ? 'rgba(56, 189, 248, 0.14)' : 'rgba(15, 23, 42, 0.6)',
                  color: '#f8fafc',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>{tier.name}</div>
                <div style={{ color: '#38bdf8', fontSize: '1.1rem', fontWeight: 800 }}>
                  ${tier.pricePerSeat}/seat
                </div>
              </button>
            );
          })}
        </div>

        <form action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <input type="hidden" name="tenantSlug" value={tenantSlug} />
          <input type="hidden" name="planTier" value={selectedTier} />
          <input type="hidden" name="expectedVersion" value={activeVersion} />

          <label style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontWeight: 600 }}>
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
            style={{
              padding: '0.75rem 1.25rem',
              borderRadius: '10px',
              background: '#38bdf8',
              color: '#090d16',
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            {isPending ? 'Verifying OCC Lock...' : 'Commit Multi-Tenant Seat Allocation'}
          </button>
        </form>

        {state.status === 'conflict' && (
          <p role="alert" style={{ color: '#f87171', marginTop: '0.75rem' }}>
            {state.message}
          </p>
        )}
      </div>

      {/* Hollywood Radial KPI Telemetry Gauge */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(15, 23, 42, 0.7)',
          borderRadius: '16px',
          padding: '1.5rem',
        }}
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
        <div data-testid="projected-mrr" style={{ marginTop: '0.75rem', fontWeight: 700, color: '#4ade80' }}>
          MRR: ${projectedMrr.toLocaleString()}/mo • NRR: {activeTierMeta.nrr}%
        </div>
      </div>
    </section>
  );
}
