'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function ThreeVaultUploader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [progress, setProgress] = useState(65);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Three.js 3D Rotating Titanium Vault Rings
    const ringGeom = new THREE.TorusGeometry(1.2, 0.08, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0x06b6d4, wireframe: true });
    const ringMesh = new THREE.Mesh(ringGeom, ringMat);
    scene.add(ringMesh);

    let frameId: number;
    const render = () => {
      frameId = requestAnimationFrame(render);
      ringMesh.rotation.z += 0.015;
      ringMesh.rotation.x += 0.008;
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="three-vault-root" data-testid="vault-root">
      <header className="vault-header">
        <h2>Cinematic 3D Cryptographic Resumable Vault</h2>
        <span className="hash-pill">SHA-256 Validated</span>
      </header>

      <div className="vault-3d-box">
        <canvas ref={canvasRef} className="three-vault-canvas" data-testid="vault-canvas" />
      </div>

      <div className="progress-bar-card">
        <div className="meta">
          <strong>quantum-ledger.bin</strong>
          <span>{progress}% Streamed</span>
        </div>
        <div className="track"><div className="fill" style={{ width: `${progress}%` }} /></div>
      </div>
    </div>
  );
}