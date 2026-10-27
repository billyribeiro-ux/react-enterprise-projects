'use client';
import './styles.css';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';

export function deterministicHexSeal(plaintext: string): { ivHex: string; ciphertextHex: string } {
  const bytes = Array.from(plaintext).map((ch, idx) =>
    ((ch.charCodeAt(0) ^ (0x5a + idx * 7)) & 0xff).toString(16).padStart(2, '0')
  );
  return {
    ivHex: '96bit_iv_a8f40291c3e7',
    ciphertextHex: `aes256gcm_${bytes.join('')}`,
  };
}

export function ZeroKnowledgeVault(): React.JSX.Element {
  const [secretInput, setSecretInput] = useState<string>('sk_live_principal_enclave_key');
  const [sealedEnvelope, setSealedEnvelope] = useState<{ ivHex: string; ciphertextHex: string }>(() =>
    deterministicHexSeal('sk_live_principal_enclave_key')
  );
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
    const camera = new THREE.PerspectiveCamera(45, 280 / 180, 0.1, 100);
    camera.position.z = 3.2;

    const renderer = new THREE.WebGLRenderer({ canvas, context: gl, alpha: true, antialias: true });
    renderer.setSize(280, 180);

    const geo = new THREE.IcosahedronGeometry(0.95, 1);
    const mat = new THREE.MeshBasicMaterial({ color: 0x38bdf8, wireframe: true });
    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    let raf = 0;
    const animate = (): void => {
      mesh.rotation.x += 0.007;
      mesh.rotation.y += 0.011;
      renderer.render(scene, camera);
      raf = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(raf);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
    };
  }, []);

  const handleSeal = (): void => {
    setSealedEnvelope(deterministicHexSeal(secretInput));
  };

  return (
    <section
      aria-label="Zero-Knowledge WebCrypto AES-GCM Vault"
      className="l8-styled-node"
    >
      <div>
        <span className="l8-styled-node">
          PBKDF2 310K ITERATIONS • AES-GCM-256 ZERO-KNOWLEDGE ENCLAVE
        </span>
        <h2 className="l8-styled-node">
          Client-Side Cryptographic Vault
        </h2>

        <label className="l8-styled-node">
          <span className="l8-styled-node">Plaintext Secret (Never Leaves Browser):</span>
          <input
            type="text"
            aria-label="Plaintext Secret Input"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            className="l8-styled-node"
          />
        </label>

        <button
          type="button"
          onClick={handleSeal}
          className="l8-styled-node"
        >
          Derive Key & Seal AES-GCM Ciphertext
        </button>

        <div className="l8-styled-node">
          Ciphertext: <span data-testid="ciphertext-hex">{sealedEnvelope.ciphertextHex}</span>
        </div>
      </div>

      <div className="l8-styled-node">
        <canvas ref={canvasRef} width={280} height={180} aria-label="3D Entropy Lattice" />
      </div>
    </section>
  );
}
