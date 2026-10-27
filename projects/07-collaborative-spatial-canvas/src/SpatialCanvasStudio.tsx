'use client';
import './styles.css';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export interface SpatialNodeState {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  lamportTs: number;
  peerId: string;
}

export function mergeLwwNode(
  current: SpatialNodeState,
  incoming: SpatialNodeState
): SpatialNodeState {
  if (incoming.lamportTs > current.lamportTs) return incoming;
  if (incoming.lamportTs === current.lamportTs && incoming.peerId > current.peerId) {
    return incoming;
  }
  return current;
}

export function SpatialCanvasStudio(): React.JSX.Element {
  const [node, setNode] = useState<SpatialNodeState>({
    id: 'node-edge-1',
    label: 'Edge Gateway Cluster',
    x: 0.5,
    y: 0.4,
    z: 0.0,
    lamportTs: 10,
    peerId: 'peer-alpha',
  });

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const meshRef = useRef<THREE.Mesh | null>(null);

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
    const camera = new THREE.PerspectiveCamera(50, 340 / 220, 0.1, 100);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
    renderer.setSize(340, 220);

    const geometry = new THREE.OctahedronGeometry(0.9, 1);
    const material = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      wireframe: true,
    });
    const mesh = new THREE.Mesh(geometry, material);
    meshRef.current = mesh;
    scene.add(mesh, new THREE.AmbientLight(0xffffff, 1.2));

    let raf = 0;
    const renderLoop = (): void => {
      mesh.rotation.y += 0.01;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(renderLoop);
    };
    renderLoop();

    return () => {
      cancelAnimationFrame(raf);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      meshRef.current = null;
    };
  }, []);

  const applyTransform = (dx: number, dy: number, incomingTs: number, peerId: string): void => {
    setNode((prev) => {
      const candidate: SpatialNodeState = {
        ...prev,
        x: Number((prev.x + dx).toFixed(2)),
        y: Number((prev.y + dy).toFixed(2)),
        lamportTs: incomingTs,
        peerId,
      };
      const winner = mergeLwwNode(prev, candidate);
      if (meshRef.current && winner === candidate) {
        gsap.to(meshRef.current.position, { x: winner.x, y: winner.y, duration: 0.4 });
      }
      return winner;
    });
  };

  return (
    <section
      aria-label="Real-Time Collaborative 3D Spatial Canvas"
      className="l8-styled-node"
    >
      <div>
        <span className="l8-styled-node">
          LWW-ELEMENT-SET CRDT • LAMPORT LOGICAL CLOCK
        </span>
        <h2 className="l8-styled-node">
          {node.label}
        </h2>
        <p data-testid="spatial-coords" className="l8-styled-node">
          Vector3({node.x}, {node.y}, {node.z}) • Lamport Clock: v{node.lamportTs} ({node.peerId})
        </p>

        <div className="l8-styled-node">
          <button
            type="button"
            onClick={() => applyTransform(0.5, 0.25, node.lamportTs + 1, 'peer-beta')}
            className="l8-styled-node"
          >
            Broadcast Valid Peer Transform (ts+1)
          </button>
          <button
            type="button"
            onClick={() => applyTransform(99, 99, node.lamportTs - 1, 'peer-stale')}
            className="l8-styled-node"
          >
            Simulate Stale Packet (ts-1)
          </button>
        </div>
      </div>

      <div className="l8-styled-node">
        <canvas ref={canvasRef} width={340} height={220} aria-label="3D Spatial Mesh Canvas" />
      </div>
    </section>
  );
}
