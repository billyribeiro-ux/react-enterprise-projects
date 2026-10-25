'use client';
import React, { useEffect, useRef, useState, useOptimistic, useActionState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { updateDesignToken } from './actions';

interface TokenItem {
  id: string;
  component: string;
  category: string;
  cssVariable: string;
  value: string;
  roughness?: number;
  metalness?: number;
}

export function SpatialTokenWorkbench({ initialTokens }: { initialTokens: TokenItem[] }) {
  const [tokens] = useState<TokenItem[]>(initialTokens);
  const [selectedToken, setSelectedToken] = useState<TokenItem | null>(tokens[0] || null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const headingRef = useRef<HTMLHeadingElement | null>(null);

  const [state, formAction, isPending] = useActionState(updateDesignToken, { success: true });
  const [optimisticColor, setOptimisticColor] = useOptimistic(
    selectedToken?.value || '#38bdf8',
    (_prev, next: string) => next
  );

  // Three.js 3D Spatial Material Inspector
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // High-end PBR Sphere with Physical Material
    const geometry = new THREE.IcosahedronGeometry(1.4, 32);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(optimisticColor),
      metalness: selectedToken?.metalness ?? 0.8,
      roughness: selectedToken?.roughness ?? 0.2,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      transmission: 0.3,
      ior: 1.5
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Studio Lighting setup
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    keyLight.position.set(5, 5, 5);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0x38bdf8, 3.0);
    rimLight.position.set(-5, -5, -3);
    scene.add(rimLight);

    scene.add(new THREE.AmbientLight(0x0f172a, 1.5));

    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      mesh.rotation.y += 0.008;
      mesh.rotation.x += 0.004;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
      geometry.dispose();
      material.dispose();
    };
  }, [optimisticColor, selectedToken]);

  // GSAP Kinetic Entrance
  useEffect(() => {
    if (headingRef.current) {
      gsap.fromTo(
        headingRef.current,
        { opacity: 0, y: -20, filter: 'blur(10px)' },
        { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.2, ease: 'power3.out' }
      );
    }
  }, []);

  return (
    <div className="spatial-workbench-root" data-testid="spatial-workbench">
      <header className="cinematic-header">
        <h2 ref={headingRef} className="gradient-title">
          Enterprise 3D Spatial Token Engine &bull; Apple/Netflix Grade
        </h2>
        <span className="pill pill-hollywood">WebGL 3D & GSAP Kinetic</span>
      </header>

      <div className="workbench-layout">
        {/* 3D Real-Time Spatial Material Viewport */}
        <div className="canvas-viewport-card">
          <div className="viewport-badge">Live Three.js Physical Material</div>
          <canvas ref={canvasRef} className="three-canvas" data-testid="three-canvas" />
          <p className="caption">Real-time PBR refraction, metallic reflections, and physical clearcoat</p>
        </div>

        {/* Live Token Form Controls */}
        <div className="controls-panel">
          <h3>Token Palette & Physical Parameters</h3>
          <form action={formAction} className="token-editor-form">
            <input type="hidden" name="id" value={selectedToken?.id || ''} />
            <label htmlFor="token-hex">Color / Variable Hex</label>
            <input
              id="token-hex"
              name="value"
              value={optimisticColor}
              onChange={(e) => setOptimisticColor(e.target.value)}
              className="cinematic-input"
              data-testid="color-input"
            />

            <button type="submit" disabled={isPending} className="btn-cinema-glow" data-testid="save-token-btn">
              {isPending ? 'Propagating Shaders...' : 'Apply & Animate Token'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}