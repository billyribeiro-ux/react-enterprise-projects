'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export class Float64TickRingBuffer {
  private readonly buffer: Float64Array;
  private writePtr = 0;

  constructor(capacity = 64) {
    this.buffer = new Float64Array(capacity);
  }

  push(price: number): void {
    this.buffer[this.writePtr % this.buffer.length] = price;
    this.writePtr += 1;
  }

  latest(): number {
    if (this.writePtr === 0) return 98450.0;
    const idx = (this.writePtr - 1) % this.buffer.length;
    return this.buffer[idx] ?? 98450.0;
  }
}

export function TradingOrderbookTerminal(): React.JSX.Element {
  const ringRef = useRef<Float64TickRingBuffer>(new Float64TickRingBuffer(64));
  const [midPrice, setMidPrice] = useState<number>(98450.0);
  const [fillsCount, setFillsCount] = useState<number>(1);
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
    const camera = new THREE.PerspectiveCamera(45, 320 / 200, 0.1, 100);
    camera.position.set(0, 1.8, 3.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
    renderer.setSize(320, 200);

    const geometry = new THREE.PlaneGeometry(2.8, 1.8, 16, 16);
    const material = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true });
    const plane = new THREE.Mesh(geometry, material);
    plane.rotation.x = -Math.PI / 2.6;
    scene.add(plane);

    let raf = 0;
    const animate = (): void => {
      plane.rotation.z += 0.004;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  const ingestHighFreqTick = (delta: number): void => {
    const nextPrice = Number((midPrice + delta).toFixed(2));
    ringRef.current.push(nextPrice);
    setMidPrice(ringRef.current.latest());
    setFillsCount((c) => c + 1);
  };

  return (
    <section
      aria-label="Algorithmic Trading Orderbook & 3D Market Depth Terminal"
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
          ZERO-ALLOCATION FLOAT64 RING BUFFER • 120FPS RAF COMMIT
        </span>
        <h2 style={{ margin: '0.35rem 0', fontSize: '1.5rem', fontWeight: 800 }}>
          BTC-USD-PERP:{' '}
          <span data-testid="mid-price" style={{ color: '#4ade80', fontFamily: 'monospace' }}>
            ${midPrice.toFixed(2)}
          </span>
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
          Ring Buffer Fills Processed: <strong data-testid="fills-count">{fillsCount}</strong>
        </p>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
          <button
            type="button"
            onClick={() => ingestHighFreqTick(12.5)}
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              background: '#10b981',
              color: '#090d16',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Sweep Ask (+12.50)
          </button>
          <button
            type="button"
            onClick={() => ingestHighFreqTick(-10.0)}
            style={{
              padding: '0.65rem 1.1rem',
              borderRadius: '10px',
              background: '#f43f5e',
              color: '#f8fafc',
              fontWeight: 800,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Hit Bid (-10.00)
          </button>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a', borderRadius: '14px', padding: '1rem' }}>
        <canvas ref={canvasRef} width={320} height={200} aria-label="3D Liquidity Depth Surface" />
      </div>
    </section>
  );
}
