'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function ThreeOrderBook() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lastPrice, setLastPrice] = useState(98450.5);

  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
    camera.position.set(0, 3, 5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);

    // 3D Depth Mountain Terrain (Bids green, Asks red)
    const geomBids = new THREE.BoxGeometry(1.8, 1, 0.2);
    const matBids = new THREE.MeshBasicMaterial({ color: 0x10b981, wireframe: true });
    const bidsMesh = new THREE.Mesh(geomBids, matBids);
    bidsMesh.position.x = -1.2;
    scene.add(bidsMesh);

    const geomAsks = new THREE.BoxGeometry(1.8, 1, 0.2);
    const matAsks = new THREE.MeshBasicMaterial({ color: 0xef4444, wireframe: true });
    const asksMesh = new THREE.Mesh(geomAsks, matAsks);
    asksMesh.position.x = 1.2;
    scene.add(asksMesh);

    let frameId: number;
    const render = () => {
      frameId = requestAnimationFrame(render);
      bidsMesh.rotation.y += 0.01;
      asksMesh.rotation.y -= 0.01;
      renderer.render(scene, camera);
    };
    render();

    return () => {
      cancelAnimationFrame(frameId);
      renderer.dispose();
    };
  }, []);

  return (
    <div className="three-orderbook-root" data-testid="orderbook-root">
      <header className="ob-header">
        <h2>Cinematic 3D WebGL L2 Order Book &bull; BTC/USD</h2>
        <span className="price-tag green">${lastPrice.toLocaleString()}</span>
      </header>

      <div className="orderbook-3d-viewport">
        <canvas ref={canvasRef} className="orderbook-canvas" data-testid="orderbook-canvas" />
      </div>
    </div>
  );
}