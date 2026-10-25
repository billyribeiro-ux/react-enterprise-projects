'use client';
import React, { useEffect, useRef, useState, useOptimistic, useTransition } from 'react';
import gsap from 'gsap';
import { switchSaaSTier } from './actions';

export function CinematicBillingDashboard({ tenant }: { tenant: { id: string; name: string; planTier: string; mrrCents: number; netRetention: number } }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticTier, setOptimisticTier] = useOptimistic(tenant.planTier, (_prev, next: string) => next);

  const mrrCounterRef = useRef<HTMLSpanElement | null>(null);
  const ndrCounterRef = useRef<HTMLSpanElement | null>(null);

  // Hollywood Animated KPI Counter
  useEffect(() => {
    const obj = { val: 0 };
    gsap.to(obj, {
      val: tenant.mrrCents / 100,
      duration: 1.8,
      ease: 'power3.out',
      onUpdate: () => {
        if (mrrCounterRef.current) {
          mrrCounterRef.current.textContent = `$${Math.floor(obj.val).toLocaleString()}`;
        }
      }
    });

    const ndrObj = { val: 0 };
    gsap.to(ndrObj, {
      val: tenant.netRetention,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        if (ndrCounterRef.current) {
          ndrCounterRef.current.textContent = `${ndrObj.val.toFixed(1)}%`;
        }
      }
    });
  }, [tenant.mrrCents, tenant.netRetention]);

  const handleSelectTier = (tier: string) => {
    startTransition(async () => {
      setOptimisticTier(tier);
      await switchSaaSTier(tenant.id, tier);
    });
  };

  return (
    <div className="hollywood-billing-root" data-testid="hollywood-billing">
      <header className="cinematic-kpi-banner">
        <div>
          <h2>{tenant.name} &bull; Revenue & Licensing Command HUD</h2>
          <span className="status-live-dot">Streaming Live Telemetry</span>
        </div>
        <div className="tier-hologram">Active Plan: <strong>{optimisticTier.toUpperCase()}</strong></div>
      </header>

      {/* KPI Hologram Gauges */}
      <div className="kpi-cards-grid">
        <div className="kpi-card glassmorphic">
          <span className="kpi-label">Annual Recurring Revenue (ARR)</span>
          <span ref={mrrCounterRef} className="kpi-value text-cyan" data-testid="mrr-counter">$0</span>
          <div className="kpi-trend up">+24.8% vs last fiscal quarter</div>
        </div>

        <div className="kpi-card glassmorphic">
          <span className="kpi-label">Net Dollar Retention (NDR)</span>
          <span ref={ndrCounterRef} className="kpi-value text-emerald" data-testid="ndr-counter">0%</span>
          <div className="kpi-trend up">Top Decile Enterprise Benchmark</div>
        </div>

        <div className="kpi-card glassmorphic circular-gauge-card">
          <span className="kpi-label">Quota Capacity</span>
          <svg className="radial-progress" width="90" height="90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" className="track" />
            <circle cx="50" cy="50" r="42" className="bar" strokeDasharray="264" strokeDashoffset="48" />
          </svg>
          <span className="gauge-text">82%</span>
        </div>
      </div>

      {/* Tier Switcher with Apple-grade micro-interactions */}
      <div className="tier-deck">
        {['starter', 'growth', 'enterprise'].map((tier) => (
          <div
            key={tier}
            onClick={() => handleSelectTier(tier)}
            className={`tier-tile ${optimisticTier === tier ? 'tier-tile-active' : ''}`}
            data-testid={`tile-${tier}`}
          >
            <h4>{tier.toUpperCase()}</h4>
            <p className="price-tag">{tier === 'enterprise' ? '$48,920/mo' : tier === 'growth' ? '$4,990/mo' : '$490/mo'}</p>
            <span className="btn-switch">{optimisticTier === tier ? 'Current Plan' : isPending ? 'Migrating...' : 'Select Plan'}</span>
          </div>
        ))}
      </div>
    </div>
  );
}