'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * WebGL hero backdrop for the work-detail page - a domain-warped noise
 * field, not a stock particle swirl. Meant to read as "signal in the
 * noise": the case study is an AI tool that researches a business live
 * on the web, so the field is built from layered flow rather than a
 * decorative blob. Accent-orange-on-near-black, matching the site's own
 * dark palette exactly (no separate colour system for this one effect).
 *
 * Reacts to two real inputs, not just a time uniform: cursor position
 * (a soft glow follows the pointer) and scroll progress through the
 * hero (the field's intensity fades as the hero scrolls out, so it
 * never fights the chapters that follow). Skipped entirely under
 * prefers-reduced-motion, same as every other animated piece on this
 * site - a static two-stop gradient stands in instead.
 */

const VERTEX = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const FRAGMENT = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2 uResolution;
  uniform vec2 uMouse;
  uniform float uIntensity;

  // Hash-based value noise - standard technique, no external table.
  float hash(vec2 p) {
    p = fract(p * vec2(123.34, 456.21));
    p += dot(p, p + 45.32);
    return fract(p.x * p.y);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  // Domain-warped fbm: noise fed back into itself so the field flows
  // instead of just shimmering in place.
  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    for (int i = 0; i < 5; i++) {
      sum += amp * noise(p);
      p *= 2.02;
      amp *= 0.5;
    }
    return sum;
  }

  void main() {
    vec2 aspect = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 uv = (vUv - 0.5) * aspect;

    float t = uTime * 0.06;
    vec2 warpA = vec2(fbm(uv * 1.6 + t), fbm(uv * 1.6 - t + 4.2));
    vec2 warpB = uv + warpA * 0.6;
    float field = fbm(warpB * 2.0 + t * 0.5);

    float mouseDist = length(uv - uMouse * aspect);
    float glow = smoothstep(0.9, 0.0, mouseDist) * 0.5;

    float signal = smoothstep(0.35, 0.85, field) + glow;
    signal *= uIntensity;

    vec3 base = vec3(0.035, 0.035, 0.043);
    vec3 accent = vec3(0.984, 0.576, 0.235); // #FB923C
    vec3 color = mix(base, accent, clamp(signal, 0.0, 1.0) * 0.85);

    float vignette = smoothstep(1.1, 0.2, length(uv));
    color = mix(base, color, vignette);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export default function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mount = mountRef.current;
    if (!mount || reduced) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector2(1, 1) },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uIntensity: { value: 1 },
    };

    const material = new THREE.ShaderMaterial({ vertexShader: VERTEX, fragmentShader: FRAGMENT, uniforms });
    const geometry = new THREE.PlaneGeometry(2, 2);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const targetMouse = new THREE.Vector2(0, 0);

    const resize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      uniforms.uResolution.value.set(w, h);
    };
    resize();

    const onPointerMove = (e: PointerEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetMouse.set(x, y);
    };

    const onScroll = () => {
      const rect = mount.getBoundingClientRect();
      // Fades out as the hero's own bottom edge crosses the top of the
      // viewport - never fights the statement chapter that follows.
      const progress = Math.min(1, Math.max(0, 1 - rect.bottom / rect.height));
      uniforms.uIntensity.value = 1 - progress;
    };

    window.addEventListener('resize', resize);
    window.addEventListener('pointermove', onPointerMove, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    const ro = new ResizeObserver(resize);
    ro.observe(mount);

    let raf = 0;
    const start = performance.now();
    const tick = () => {
      uniforms.uTime.value = (performance.now() - start) / 1000;
      uniforms.uMouse.value.lerp(targetMouse, 0.04);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    tick();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('scroll', onScroll);
      ro.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        background: 'linear-gradient(160deg, #18120a 0%, #09090B 60%)',
      }}
    />
  );
}
