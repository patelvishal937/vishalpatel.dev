"use client";

// The 3D hero: an "AI particle sphere". Thousands of glowing white and red
// dots on a slowly turning sphere, like a neural network, with a faint orbit
// ring for depth and a soft red glow behind. Dots scatter away from the
// cursor and flow back.
//
// Plain Three.js with one small shader, loaded after first paint (see
// HeroSceneLoader). Rendering pauses when the hero is off screen or the tab is
// hidden. With prefers-reduced-motion it draws one still frame. No WebGL:
// renders nothing and the flat CSS orb stays.

import { useEffect, useRef } from "react";
import * as THREE from "three";

// keep in sync with the split-hero media query in globals.css
const SPLIT_AT = 1024;

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uPixel;     // device pixel ratio
  uniform float uSize;      // base point size in CSS px
  uniform vec2  uMouse;     // pointer in world units (z = 0 plane)
  uniform float uRadius;    // how far the scatter reaches
  uniform float uPush;      // how far dots get pushed
  attribute float aSeed;
  attribute float aRed;
  varying float vRed;
  varying float vDepth;
  void main() {
    vec4 wp = modelMatrix * vec4(position, 1.0);
    // breathing: each dot drifts a little along its own direction
    vec3 dir = normalize(position);
    wp.xyz += (mat3(modelMatrix) * dir) * sin(uTime * 1.3 + aSeed * 6.2831) * 0.035;
    // scatter away from the pointer
    vec2 d = wp.xy - uMouse;
    float f = smoothstep(uRadius, 0.0, length(d));
    wp.xy += normalize(d + 1e-4) * f * uPush;
    wp.z += f * uPush * 0.6;
    vec4 mv = viewMatrix * wp;
    gl_Position = projectionMatrix * mv;
    // front dots bigger and brighter than back dots
    vec3 rp = normalize(mat3(modelMatrix) * position);
    vDepth = smoothstep(-1.0, 1.0, rp.z);
    vRed = aRed;
    gl_PointSize = uSize * uPixel * (0.55 + 0.75 * vDepth) * (1.0 + aRed * 0.35) * (10.0 / -mv.z);
  }
`;

const fragment = /* glsl */ `
  varying float vRed;
  varying float vDepth;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    float r = length(c);
    if (r > 0.5) discard;
    float core = smoothstep(0.5, 0.0, r);
    vec3 white = vec3(1.0);
    vec3 red = vec3(0.89, 0.07, 0.29);
    vec3 col = mix(white, red, vRed);
    float alpha = core * (0.25 + 0.75 * vDepth) * (0.75 + vRed * 0.25);
    gl_FragColor = vec4(col, alpha);
  }
`;

// evenly spread points on a unit sphere (Fibonacci lattice)
function spherePoints(n: number) {
  const pos = new Float32Array(n * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < n; i++) {
    const y = 1 - (i / (n - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pos.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3);
  }
  return pos;
}

function ringPoints(n: number, radius: number, spread: number) {
  const pos = new Float32Array(n * 3);
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2 + Math.random() * 0.05;
    const rr = radius + (Math.random() - 0.5) * spread;
    pos.set([Math.cos(a) * rr, (Math.random() - 0.5) * spread * 0.4, Math.sin(a) * rr], i * 3);
  }
  return pos;
}

function makePoints(positions: Float32Array, redShare: number, material: THREE.ShaderMaterial) {
  const n = positions.length / 3;
  const seed = new Float32Array(n);
  const red = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    seed[i] = Math.random();
    red[i] = Math.random() < redShare ? 1 : 0;
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  g.setAttribute("aSeed", new THREE.BufferAttribute(seed, 1));
  g.setAttribute("aRed", new THREE.BufferAttribute(red, 1));
  return new THREE.Points(g, material);
}

export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const small = window.innerWidth <= 640;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: keep the CSS orb
    }
    const dpr = Math.min(window.devicePixelRatio, small ? 1.6 : 2);
    renderer.setPixelRatio(dpr);
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    const uniforms = {
      uTime: { value: 0 },
      uPixel: { value: dpr },
      uSize: { value: small ? 2.6 : 3.0 },
      uMouse: { value: new THREE.Vector2(999, 999) },
      uRadius: { value: 0.9 },
      uPush: { value: 0.45 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: vertex,
      fragmentShader: fragment,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const group = new THREE.Group();
    group.rotation.z = 0.18;
    scene.add(group);
    const sphere = makePoints(spherePoints(small ? 1400 : 2400), 0.16, material);
    group.add(sphere);
    const ring = makePoints(ringPoints(small ? 260 : 420, 1.55, 0.18), 0.45, material);
    ring.rotation.x = 1.15;
    ring.rotation.y = 0.3;
    group.add(ring);

    // soft red glow behind the sphere
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 256;
    const g2d = glowCanvas.getContext("2d")!;
    const grad = g2d.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(227, 18, 75, 0.28)");
    grad.addColorStop(0.4, "rgba(227, 18, 75, 0.08)");
    grad.addColorStop(1, "rgba(227, 18, 75, 0)");
    g2d.fillStyle = grad;
    g2d.fillRect(0, 0, 256, 256);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false }));
    glow.position.z = -1.5;
    scene.add(glow);

    // layout in CSS pixels: on desktop the sphere sits in the right column next to
    // the text; on tablets and phones it is centred just above the heading
    const base = { x: 0, y: 0, u: 0.01, w: 1, h: 1 };
    function layout() {
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      base.w = w;
      base.h = h;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const vh = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const u = vh / h; // world units per CSS pixel at z = 0
      base.u = u;
      // The orbit ring reaches ~1.8 radii sideways and ~1.5 radii up and down
      // (it's tilted), so every size below is limited by the space it has.
      const REACH_X = 1.8; // ring 1.55 + spread + breathing + perspective
      const REACH_Y = 1.5;
      const EDGE = 12; // keep this many px clear of the screen edge
      const phoneW = w <= 640;
      const split = w >= SPLIT_AT; // desktop: text on the left, sphere on the right
      const copy = host!.parentElement?.querySelector<HTMLElement>(".hero-copy");
      const copyTop = copy ? copy.offsetTop : 380;
      let rPx: number;
      let cx: number; // sphere centre in CSS px, relative to the hero
      let cy: number;
      if (split && copy) {
        // the free area right of the text column
        const textRight = copy.offsetLeft + Math.min(copy.offsetWidth * 0.52, 600);
        const free = w - EDGE - textRight;
        cx = textRight + free / 2;
        cy = THREE.MathUtils.clamp(copyTop + copy.offsetHeight / 2, 0, h);
        rPx = Math.min(230, free / 2 / REACH_X, (Math.min(cy, h - cy) - EDGE) / REACH_Y);
      } else {
        // stacked: centred just above the heading, as big as the width and the
        // space above the heading allow
        const gap = phoneW ? 28 : 40;
        const room = copyTop - gap - EDGE; // vertical space above the heading
        rPx = Math.min(phoneW ? 120 : 160, (w / 2 - EDGE) / REACH_X, room / (2 * REACH_Y));
        cx = w / 2;
        cy = copyTop - gap - rPx * REACH_Y;
      }
      rPx = Math.max(rPx, 60);
      base.x = (cx - w / 2) * u;
      base.y = vh / 2 - cy * u;
      group.position.set(base.x, base.y, 0);
      group.scale.setScalar(rPx * u);
      uniforms.uRadius.value = 85 * u;
      uniforms.uPush.value = 38 * u;
      const depth = (camera.position.z - glow.position.z) / camera.position.z;
      glow.position.set(base.x * depth, base.y * depth, glow.position.z);
      const gs = rPx * 3.6 * u * depth;
      glow.scale.set(gs, gs, 1);
    }

    // pointer in world units on the z = 0 plane (only while it's over the hero)
    const OFF = 999;
    const target = new THREE.Vector2(OFF, OFF);
    function onPointer(e: PointerEvent) {
      const rect = host!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (y < 0 || y > rect.height) {
        target.set(OFF, OFF);
        return;
      }
      target.set((x - base.w / 2) * base.u, (base.h / 2 - y) * base.u);
    }
    function onLeave() {
      target.set(OFF, OFF);
    }

    const tilt = new THREE.Vector2();
    const tiltTarget = new THREE.Vector2();
    const clock = new THREE.Clock();
    function draw() {
      const t = reduce ? 2 : clock.getElapsedTime();
      uniforms.uTime.value = t;
      const m = uniforms.uMouse.value;
      // ease the scatter point toward the cursor; jump when it enters or leaves
      if (target.x === OFF || m.x === OFF) m.copy(target);
      else m.lerp(target, 0.12);
      // slow spin, a slight lean toward the cursor
      if (target.x === OFF) tiltTarget.set(0, 0);
      else tiltTarget.set(THREE.MathUtils.clamp((target.x - base.x) / 6, -0.3, 0.3), THREE.MathUtils.clamp((target.y - base.y) / 6, -0.2, 0.2));
      tilt.lerp(tiltTarget, 0.05);
      sphere.rotation.y = t * 0.12;
      ring.rotation.z = -t * 0.08;
      group.rotation.y = tilt.x;
      group.rotation.x = -tilt.y;
      glow.material.opacity = 0.9 * (1 + Math.sin(t * 0.9) * 0.04);
      renderer.render(scene, camera);
    }

    let raf = 0;
    let visible = true;
    function loop() {
      draw();
      raf = requestAnimationFrame(loop);
    }
    function start() {
      if (reduce || raf || !visible || document.hidden) return;
      clock.start();
      raf = requestAnimationFrame(loop);
    }
    function stop() {
      cancelAnimationFrame(raf);
      raf = 0;
    }

    layout();
    draw();
    host.classList.add("ready");

    const ro = new ResizeObserver(() => {
      layout();
      draw();
    });
    ro.observe(host);
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) start();
      else stop();
    });
    io.observe(host);
    const onVis = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVis);
    if (!reduce) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      sphere.geometry.dispose();
      ring.geometry.dispose();
      material.dispose();
      glow.material.dispose();
      glowTex.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className="hero-scene" aria-hidden="true" />;
}
