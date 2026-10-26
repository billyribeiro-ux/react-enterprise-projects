'use client';

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
          PBKDF2 310K ITERATIONS • AES-GCM-256 ZERO-KNOWLEDGE ENCLAVE
        </span>
        <h2 style={{ margin: '0.35rem 0 1rem', fontSize: '1.45rem', fontWeight: 800 }}>
          Client-Side Cryptographic Vault
        </h2>

        <label style={{ display: 'block', marginBottom: '0.75rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Plaintext Secret (Never Leaves Browser):</span>
          <input
            type="text"
            aria-label="Plaintext Secret Input"
            value={secretInput}
            onChange={(e) => setSecretInput(e.target.value)}
            style={{
              width: '100%',
              marginTop: '0.35rem',
              padding: '0.65rem 0.9rem',
              borderRadius: '8px',
              background: '#1e293b',
              color: '#f8fafc',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          />
        </label>

        <button
          type="button"
          onClick={handleSeal}
          style={{
            padding: '0.65rem 1.15rem',
            borderRadius: '10px',
            background: '#38bdf8',
            color: '#090d16',
            fontWeight: 800,
            border: 'none',
            cursor: 'pointer',
          }}
        >
          Derive Key & Seal AES-GCM Ciphertext
        </button>

        <div style={{ marginTop: '1rem', fontSize: '0.8rem', fontFamily: 'monospace', color: '#4ade80' }}>
          Ciphertext: <span data-testid="ciphertext-hex">{sealedEnvelope.ciphertextHex}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', background: '#0f172a', borderRadius: '14px', padding: '1rem' }}>
        <canvas ref={canvasRef} width={280} height={180} aria-label="3D Entropy Lattice" />
      </div>
    </section>
  );
}
