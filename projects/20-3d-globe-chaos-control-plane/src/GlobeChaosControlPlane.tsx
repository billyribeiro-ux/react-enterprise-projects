'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export interface EdgeRegionState {
  code: string;
  healthy: boolean;
  trafficPct: number;
}

export function GlobeChaosControlPlane(): React.JSX.Element {
  const [regions, setRegions] = useState<EdgeRegionState[]>([
    { code: 'us-east-va', healthy: true, trafficPct: 40 },
    { code: 'eu-central-fra', healthy: true, trafficPct: 35 },
    { code: 'ap-northeast-tyo', healthy: true, trafficPct: 25 },
  ]);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let gl: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      gl = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    } catch {
      gl = null;
    }
    if (!gl) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 320 / 220, 0.1, 100);
    camera.position.z = 3.4;

    const renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
    renderer.setSize(320, 220);

    const globeGeo = new THREE.SphereGeometry(1.05, 24, 24);
    const globeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    scene.add(globe);

    let raf = 0;
    const animate = (): void => {
      globe.rotation.y += 0.008;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      globeGeo.dispose();
      globeMat.dispose();
      renderer.dispose();
    };
  }, []);

  const partitionRegion = (targetCode: string): void => {
    setRegions([
      { code: 'us-east-va', healthy: targetCode !== 'us-east-va', trafficPct: targetCode === 'us-east-va' ? 0 : 50 },
      { code: 'eu-central-fra', healthy: targetCode !== 'eu-central-fra', trafficPct: targetCode === 'eu-central-fra' ? 0 : 50 },
      { code: 'ap-northeast-tyo', healthy: true, trafficPct: targetCode === 'ap-northeast-tyo' ? 0 : 50 },
    ]);
  };

  return (
    <section
      aria-label="3D Global Edge Mesh & Chaos Engineering Control Plane"
      style={{
        padding: '2rem',
        background: '#090d16',
        color: '#f8fafc',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.1)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
      }}
    >
      <div>
        <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 700 }}>
          THREE.JS 3D GLOBAL MESH • AUTOMATED ANYCAST BGP FAILOVER
        </span>
        <h2 style={{ margin: '0.35rem 0 1rem', fontSize: '1.45rem', fontWeight: 800 }}>
          Global SLA: <span style={{ color: '#4ade80' }}>99.999% (5-Nines)</span>
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {regions.map((r) => (
            <div
              key={r.code}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 1rem',
                borderRadius: '10px',
                background: 'rgba(15, 23, 42, 0.75)',
                border: r.healthy ? '1px solid rgba(74, 222, 128, 0.3)' : '1px solid #f43f5e',
              }}
            >
              <div>
                <strong>{r.code}</strong> •{' '}
                <span data-testid={`load-${r.code}`} style={{ color: r.healthy ? '#4ade80' : '#f87171' }}>
                  {r.trafficPct}% Load
                </span>
              </div>
              <button
                type="button"
                onClick={() => partitionRegion(r.code)}
                style={{
                  padding: '0.4rem 0.75rem',
                  borderRadius: '6px',
                  background: '#f43f5e',
                  color: '#f8fafc',
                  fontWeight: 700,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.75rem',
                }}
              >
                Inject BGP Partition ({r.code})
              </button>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a', borderRadius: '14px', padding: '1rem' }}>
        <canvas ref={canvasRef} width={320} height={220} aria-label="3D Global Edge Mesh Canvas" />
      </div>
    </section>
  );
}
