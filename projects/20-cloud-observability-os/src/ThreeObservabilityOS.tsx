'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function ThreeObservabilityOS() {
  const globeCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const [spans] = useState([
    { id: 's1', service: 'global-ingress', name: 'POST /v1/telemetry', durationMs: 42.4 },
    { id: 's2', service: 'threejs-render-farm', name: 'CompileWebGLShaders', durationMs: 24.8 },
    { id: 's3', service: 'prisma-edge-db', name: 'Prisma.BatchQuery', durationMs: 14.2 }
  ]);

  // Hollywood Three.js 3D Global Telemetry Mesh Globe
  useEffect(() => {
    if (!globeCanvasRef.current) return;
    const canvas = globeCanvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 3.5;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Glowing Wireframe Globe
    const globeGeom = new THREE.SphereGeometry(1.2, 32, 32);
    const globeMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true, transparent: true, opacity: 0.75 });
    const globeMesh = new THREE.Mesh(globeGeom, globeMat);
    scene.add(globeMesh);

    // Inter-region orbital satellites
    const satGeom = new THREE.SphereGeometry(0.06, 8, 8);
    const satMat = new THREE.MeshBasicMaterial({ color: 0xec4899 });
    const satMesh = new THREE.Mesh(satGeom, satMat);
    satMesh.position.set(1.5, 0.5, 0);
    scene.add(satMesh);

    let frameId: number;
    let angle = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      globeMesh.rotation.y += 0.005;
      angle += 0.02;
      satMesh.position.x = Math.cos(angle) * 1.6;
      satMesh.position.z = Math.sin(angle) * 1.6;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="apm-os-root" data-testid="apm-root">
      <header className="apm-header">
        <h2>Enterprise Cloud Observability &bull; 3D Global Mesh & APM Flamegraph OS</h2>
        <span className="p99-pill">P99: 42.4ms (Nominal 100% SLA)</span>
      </header>

      <div className="apm-layout">
        {/* Three.js 3D Globe */}
        <div className="globe-card">
          <div className="globe-title">Live 3D Telemetry Mesh &bull; Edge Ingress Nodes</div>
          <canvas ref={globeCanvasRef} className="globe-canvas" data-testid="globe-canvas" />
        </div>

        {/* APM Waterfall Flamegraph */}
        <div className="waterfall-card">
          <h3>Distributed Trace Waterfall &bull; <code>trace-hollywood-999</code></h3>
          <div className="spans-stream">
            {spans.map((s) => (
              <div key={s.id} className="span-item" data-testid={`span-${s.id}`}>
                <div className="span-meta">
                  <span className="svc-tag">{s.service}</span>
                  <span className="span-title">{s.name}</span>
                  <span className="dur">{s.durationMs}ms</span>
                </div>
                <div className="flame-track">
                  <div className="flame-bar" style={{ width: `${(s.durationMs / 42.4) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}