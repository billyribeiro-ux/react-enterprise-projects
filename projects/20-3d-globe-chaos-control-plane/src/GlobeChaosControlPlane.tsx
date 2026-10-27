'use client';
import './styles.css';

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
      className="l8-styled-node"
    >
      <div>
        <span className="l8-styled-node">
          THREE.JS 3D GLOBAL MESH • AUTOMATED ANYCAST BGP FAILOVER
        </span>
        <h2 className="l8-styled-node">
          Global SLA: <span className="l8-styled-node">99.999% (5-Nines)</span>
        </h2>

        <div className="l8-styled-node">
          {regions.map((r) => (
            <div
              key={r.code}
              className="l8-styled-node"
            >
              <div>
                <strong>{r.code}</strong> •{' '}
                <span data-testid={`load-${r.code}`} className="l8-styled-node">
                  {r.trafficPct}% Load
                </span>
              </div>
              <button
                type="button"
                onClick={() => partitionRegion(r.code)}
                className="l8-styled-node"
              >
                Inject BGP Partition ({r.code})
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="l8-styled-node">
        <canvas ref={canvasRef} width={320} height={220} aria-label="3D Global Edge Mesh Canvas" />
      </div>
    </section>
  );
}
