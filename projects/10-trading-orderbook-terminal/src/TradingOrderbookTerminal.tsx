'use client';
import './styles.css';

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
      className="l8-styled-node"
    >
      <div>
        <span className="l8-styled-node">
          ZERO-ALLOCATION FLOAT64 RING BUFFER • 120FPS RAF COMMIT
        </span>
        <h2 className="l8-styled-node">
          BTC-USD-PERP:{' '}
          <span data-testid="mid-price" className="l8-styled-node">
            ${midPrice.toFixed(2)}
          </span>
        </h2>
        <p className="l8-styled-node">
          Ring Buffer Fills Processed: <strong data-testid="fills-count">{fillsCount}</strong>
        </p>

        <div className="l8-styled-node">
          <button
            type="button"
            onClick={() => ingestHighFreqTick(12.5)}
            className="l8-styled-node"
          >
            Sweep Ask (+12.50)
          </button>
          <button
            type="button"
            onClick={() => ingestHighFreqTick(-10.0)}
            className="l8-styled-node"
          >
            Hit Bid (-10.00)
          </button>
        </div>
      </div>

      <div className="l8-styled-node">
        <canvas ref={canvasRef} width={320} height={200} aria-label="3D Liquidity Depth Surface" />
      </div>
    </section>
  );
}
