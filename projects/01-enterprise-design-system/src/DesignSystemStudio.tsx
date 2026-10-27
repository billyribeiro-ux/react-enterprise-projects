'use client';
import './styles.css';

import React, {
  useActionState,
  useEffect,
  useOptimistic,
  useRef,
  useState,
  useTransition,
  type ComponentPropsWithoutRef,
  type ElementType,
  type ReactNode,
} from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import {
  updateDesignTokenAction,
  type ActionResult,
  type DesignTokenRecord,
} from './actions';

export type PolymorphicProps<E extends ElementType> = {
  as?: E;
  variant?: 'solid' | 'surface' | 'ghost';
  children?: ReactNode;
} & Omit<ComponentPropsWithoutRef<E>, 'as' | 'children'>;

export function PrimitiveBox<E extends ElementType = 'button'>({
  as,
  variant = 'solid',
  children,
  ...rest
}: PolymorphicProps<E>): React.JSX.Element {
  const Component = as ?? 'button';
  return (
    <Component
      data-variant={variant}
      className="l8-styled-node"
      {...rest}
    >
      {children}
    </Component>
  );
}

export interface TokenItem {
  name: string;
  value: string;
  roughness: number;
  metalness: number;
}

const DEFAULT_TOKENS: TokenItem[] = [
  { name: 'color.primary.accent', value: '#38bdf8', roughness: 0.15, metalness: 0.85 },
  { name: 'color.surface.elevated', value: '#6366f1', roughness: 0.32, metalness: 0.65 },
  { name: 'color.kinetic.neon', value: '#10b981', roughness: 0.12, metalness: 0.92 },
];

export function DesignSystemStudio({
  initialTokens = DEFAULT_TOKENS,
}: {
  initialTokens?: TokenItem[];
}): React.JSX.Element {
  const [selectedIdx, setSelectedIdx] = useState<number>(0);
  const activeToken = initialTokens[selectedIdx] ?? DEFAULT_TOKENS[0]!;

  const [draftColor, setDraftColor] = useState<string>(activeToken.value);
  const [optimisticColor, setOptimisticColor] = useOptimistic<string, string>(
    activeToken.value,
    (_state, nextColor) => nextColor
  );
  const [isPending, startTransition] = useTransition();

  const initialState: ActionResult<DesignTokenRecord> = { status: 'idle' };
  const [state, formAction] = useActionState(updateDesignTokenAction, initialState);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);

  useEffect(() => {
    setDraftColor(activeToken.value);
  }, [activeToken.value]);

  // Initialize Three.js WebGL PBR Studio once on mount with headless-safe guard & full cleanup
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let glContext: WebGLRenderingContext | WebGL2RenderingContext | null = null;
    try {
      glContext = canvas.getContext('webgl2') ?? canvas.getContext('webgl');
    } catch {
      glContext = null;
    }
    if (!glContext) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 340 / 240, 0.1, 100);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      context: glContext,
      alpha: true,
      antialias: true,
    });
    renderer.setSize(340, 240);

    const geometry = new THREE.TorusKnotGeometry(0.82, 0.26, 128, 32);
    const material = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(activeToken.value),
      roughness: activeToken.roughness,
      metalness: activeToken.metalness,
      clearcoat: 1.0,
      clearcoatRoughness: 0.08,
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const keyLight = new THREE.PointLight(0xffffff, 45);
    keyLight.position.set(3, 3, 4);
    const rimLight = new THREE.PointLight(0x38bdf8, 28);
    rimLight.position.set(-3, -2, -2);
    scene.add(keyLight, rimLight, new THREE.AmbientLight(0xffffff, 0.6));

    let frameId = 0;
    const animate = (): void => {
      mesh.rotation.x += 0.008;
      mesh.rotation.y += 0.012;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      materialRef.current = null;
    };
  }, []);

  // Tween PBR material uniforms via GSAP without recreating WebGL context
  useEffect(() => {
    const mat = materialRef.current;
    if (!mat) return;
    const targetColor = new THREE.Color(draftColor);
    gsap.to(mat.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.45,
      ease: 'power2.out',
    });
    mat.roughness = activeToken.roughness;
    mat.metalness = activeToken.metalness;
  }, [draftColor, activeToken.roughness, activeToken.metalness]);

  const handleKineticPulse = (): void => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { scale: 0.96, rotationY: -8 },
        { scale: 1, rotationY: 0, duration: 0.65, ease: 'elastic.out(1, 0.4)' }
      );
    }
  };

  const handleSubmit = (formData: FormData): void => {
    const nextColor = String(formData.get('value') ?? draftColor);
    startTransition(() => {
      setOptimisticColor(nextColor);
      formAction(formData);
    });
    handleKineticPulse();
  };

  return (
    <section
      aria-label="Enterprise Design System & 3D Shader Studio"
      className="l8-styled-node"
    >
      <div ref={cardRef} className="l8-styled-node">
        <header>
          <span
            className="l8-styled-node"
          >
            OKLCH Cascade Layer + Three.js PBR Engine
          </span>
          <h2 className="l8-styled-node">
            {activeToken.name}
          </h2>
        </header>

        <div
          role="group"
          aria-label="Design Token Selector"
          className="l8-styled-node"
        >
          {initialTokens.map((tok, idx) => (
            <button
              key={tok.name}
              type="button"
              aria-pressed={idx === selectedIdx}
              onClick={() => setSelectedIdx(idx)}
              className="l8-styled-node"
            >
              {tok.name}
            </button>
          ))}
        </div>

        <form action={handleSubmit} className="l8-styled-node">
          <input type="hidden" name="name" value={activeToken.name} />
          <input type="hidden" name="roughness" value={activeToken.roughness} />
          <input type="hidden" name="metalness" value={activeToken.metalness} />
          <label className="l8-styled-node">
            <span>Token Hex Value:</span>
            <input
              type="color"
              name="value"
              aria-label="Token Hex Color"
              value={draftColor}
              onChange={(e) => setDraftColor(e.target.value)}
            />
            <code
              data-testid="optimistic-hex"
              className="l8-styled-node"
            >
              {isPending ? optimisticColor : draftColor}
            </code>
          </label>

          <div className="l8-styled-node">
            <PrimitiveBox
              as="button"
              type="submit"
              disabled={isPending}
              className="l8-styled-node"
            >
              {isPending ? 'Syncing Shader & Prisma...' : 'Commit Token & Pulse 3D Shader'}
            </PrimitiveBox>
            <PrimitiveBox
              as="a"
              href="#wcag-audit"
              variant="ghost"
              className="l8-styled-node"
            >
              Verify APCA Contrast
            </PrimitiveBox>
          </div>
        </form>

        {state.status === 'success' && (
          <p role="status" className="l8-styled-node">
            Persisted {state.data.name} ({state.data.value}) to Prisma v6.
          </p>
        )}
        {state.status === 'error' && (
          <p role="alert" className="l8-styled-node">
            {state.message}
          </p>
        )}

        {/* 2D Vector KPI Telemetry Strip */}
        <svg
          viewBox="0 0 320 64"
          role="img"
          aria-label="Shader Frame Pacing Telemetry"
          className="l8-styled-node"
        >
          <polyline
            fill="none"
            stroke={draftColor}
            strokeWidth="2.5"
            points="8,48 52,36 96,40 140,22 184,26 228,16 272,20 312,12"
          />
          <text x="12" y="20" fill="#94a3b8" fontSize="10" fontFamily="monospace">
            PBR SHADER 120FPS • ROUGHNESS {activeToken.roughness.toFixed(2)} • METAL {activeToken.metalness.toFixed(2)}
          </text>
        </svg>
      </div>

      <div
        className="l8-styled-node"
      >
        <canvas
          ref={canvasRef}
          width={340}
          height={240}
          aria-label="Interactive 3D PBR Material Preview"
        />
        <span className="l8-styled-node">
          Real-Time Three.js MeshPhysicalMaterial TorusKnot
        </span>
      </div>
    </section>
  );
}
