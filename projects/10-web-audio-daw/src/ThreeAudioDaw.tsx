'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function ThreeAudioDaw({ tracks }: { tracks: any[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 2, 4);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // Three.js 3D Frequency Ribbon Wave
    const geom = new THREE.PlaneGeometry(6, 2, 32, 16);
    const mat = new THREE.MeshBasicMaterial({ color: 0x8b5cf6, wireframe: true });
    const waveMesh = new THREE.Mesh(geom, mat);
    waveMesh.rotation.x = -Math.PI / 3;
    scene.add(waveMesh);

    let frameId: number;
    let t = 0;
    const animate = () => {
      frameId = requestAnimationFrame(animate);
      t += 0.05;
      const pos = geom.attributes.position;
      if (pos) {
        for (let i = 0; i < pos.count; i++) {
          const u = pos.getX(i);
          pos.setZ(i, Math.sin(u * 2 + t) * (isPlaying ? 0.35 : 0.08));
        }
        pos.needsUpdate = true;
      }
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, [isPlaying]);

  return (
    <div className="three-daw-root" data-testid="daw-root">
      <header className="daw-header">
        <h2>Hollywood Sci-Fi WebGL Audio DAW &bull; 3D Visualizer</h2>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`btn-play-daw ${isPlaying ? 'playing' : ''}`}
          data-testid="play-btn"
        >
          {isPlaying ? 'Pause Synthesizer' : 'Play Cinematic Sequence'}
        </button>
      </header>

      <div className="spectrum-3d-box">
        <canvas ref={canvasRef} className="three-audio-canvas" data-testid="audio-canvas" />
      </div>

      <div className="sequencer-lanes">
        {tracks.map((t) => (
          <div key={t.id} className="lane-row">
            <span className="lane-title">{t.name}</span>
            <div className="steps-cells">
              {t.steps.split('').map((val: string, idx: number) => (
                <div key={idx} className={`step-cell ${val === '1' ? 'active' : ''}`} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}