"use client";

// The 3D hero: a Memoji-style bust of Vishal (textured quiff, rounded glasses,
// expressive eyes that blink, open smile, hoodie) in front of a glossy red orb
// that works like a halo. His head follows the pointer; the orb drifts the
// other way and catches the light.
//
// Plain Three.js, loaded after first paint (see HeroSceneLoader). Rendering
// pauses when the hero is off screen or the tab is hidden. With
// prefers-reduced-motion it draws one still frame. No WebGL: renders nothing
// and the flat CSS orb stays.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const ACCENT = 0xe3124b;
const LID_OPEN = -0.55; // eyelid tilted back: eye open
const LID_SHUT = 1.35; // tilted forward over the eye: blink

const M = {
  skin: () =>
    new THREE.MeshPhysicalMaterial({ color: 0x9a5c38, roughness: 0.5, clearcoat: 0.12, clearcoatRoughness: 0.6, sheen: 0.2, sheenColor: 0xffc0a0 }),
  hair: () => new THREE.MeshPhysicalMaterial({ color: 0x17110d, roughness: 0.62, sheen: 0.6, sheenColor: 0x5a4a40, sheenRoughness: 0.5 }),
  hoodie: () => new THREE.MeshPhysicalMaterial({ color: 0x2a2730, roughness: 0.88, sheen: 0.8, sheenColor: 0x6f6a7a, sheenRoughness: 0.6 }),
  frame: () => new THREE.MeshStandardMaterial({ color: 0x0e0e11, roughness: 0.28, metalness: 0.55 }),
  white: () => new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.15, clearcoat: 1 }),
};

// ripple a sphere-ish geometry along its normals so hair reads as clumps
function textured(geo: THREE.BufferGeometry, amp: number) {
  const p = geo.getAttribute("position");
  const v = new THREE.Vector3();
  for (let i = 0; i < p.count; i++) {
    v.fromBufferAttribute(p, i);
    const d = v.clone().normalize();
    const n = 0.5 + 0.5 * Math.sin(d.x * 15 + d.z * 7) * Math.cos(d.y * 12 - d.x * 6);
    v.addScaledVector(d, amp * n);
    p.setXYZ(i, v.x, v.y, v.z);
  }
  geo.computeVertexNormals();
  return geo;
}

// a capsule whose axis runs from a to b
function capsuleBetween(a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(dir.length() - 2 * r, 0.001), 10, 20), mat);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
}

// rounded-rectangle ring, used for the glasses frames
function roundedRing(w: number, h: number, r: number, t: number) {
  const rr = (s: THREE.Shape | THREE.Path, W: number, H: number, R: number) => {
    s.moveTo(-W / 2 + R, -H / 2);
    s.lineTo(W / 2 - R, -H / 2);
    s.quadraticCurveTo(W / 2, -H / 2, W / 2, -H / 2 + R);
    s.lineTo(W / 2, H / 2 - R);
    s.quadraticCurveTo(W / 2, H / 2, W / 2 - R, H / 2);
    s.lineTo(-W / 2 + R, H / 2);
    s.quadraticCurveTo(-W / 2, H / 2, -W / 2, H / 2 - R);
    s.lineTo(-W / 2, -H / 2 + R);
    s.quadraticCurveTo(-W / 2, -H / 2, -W / 2 + R, -H / 2);
  };
  const shape = new THREE.Shape();
  rr(shape, w, h, r);
  const hole = new THREE.Path();
  rr(hole, w - t * 2, h - t * 2, Math.max(r - t, 0.01));
  shape.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(shape, { depth: 0.03, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.006, bevelSegments: 3, curveSegments: 16 });
  g.translate(0, 0, -0.015);
  return g;
}

function buildAvatar() {
  const avatar = new THREE.Group();
  const skin = M.skin();
  const hair = M.hair();
  const hoodie = M.hoodie();

  // ---------- bust: hoodie with shoulders, hood and drawstrings ----------
  const profile = [
    [0.001, -1.32],
    [0.62, -1.3],
    [0.9, -1.18],
    [0.98, -0.9],
    [0.94, -0.55],
    [0.78, -0.27],
    [0.5, -0.1],
    [0.3, -0.04],
    [0.001, -0.02],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const torso = new THREE.Mesh(new THREE.LatheGeometry(profile, 72), hoodie);
  torso.scale.set(0.9, 0.95, 0.6);
  avatar.add(torso);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.29, 0.12, 20, 56), hoodie);
  collar.rotation.x = Math.PI / 2;
  collar.scale.set(1.15, 1, 1);
  collar.position.set(0, -0.06, -0.02);
  avatar.add(collar);
  const hood = new THREE.Mesh(new THREE.SphereGeometry(0.46, 40, 40), hoodie);
  hood.scale.set(1.35, 0.78, 0.7);
  hood.position.set(0, -0.06, -0.38);
  avatar.add(hood);
  const cord = new THREE.MeshStandardMaterial({ color: 0xeeeef3, roughness: 0.55 });
  for (const x of [-0.13, 0.13]) {
    avatar.add(capsuleBetween(new THREE.Vector3(x, -0.13, 0.33), new THREE.Vector3(x * 1.15, -0.55, 0.45), 0.018, cord));
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.026, 0.026, 0.07, 12), cord);
    tip.position.set(x * 1.16, -0.6, 0.46);
    avatar.add(tip);
  }

  // neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.23, 0.36, 28), skin);
  neck.position.y = 0.06;
  avatar.add(neck);

  // ---------- head (pivots at the neck) ----------
  const head = new THREE.Group();
  head.position.y = 0.12;
  head.scale.setScalar(1.14);
  avatar.add(head);

  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.62, 72, 72), skin);
  skull.scale.set(0.93, 1.0, 0.95);
  skull.position.y = 0.66;
  head.add(skull);
  const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), skin);
  jaw.scale.set(0.9, 0.78, 0.9);
  jaw.position.set(0, 0.44, 0.06);
  head.add(jaw);
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.14, 28, 28), skin);
    ear.scale.set(0.5, 1, 0.75);
    ear.position.set(s * 0.58, 0.62, -0.02);
    head.add(ear);
  }

  // eyes: white, iris, pupil, shine, and an eyelid that blinks
  const lids: THREE.Mesh[] = [];
  const iris = new THREE.MeshStandardMaterial({ color: 0x4a2a17, roughness: 0.3 });
  const pupil = new THREE.MeshStandardMaterial({ color: 0x050505, roughness: 0.2 });
  for (const s of [-1, 1]) {
    const x = s * 0.205;
    const eye = new THREE.Group();
    eye.position.set(x, 0.69, 0.49);
    head.add(eye);
    const white = new THREE.Mesh(new THREE.SphereGeometry(0.112, 32, 32), M.white());
    white.scale.set(1, 1.1, 0.55);
    eye.add(white);
    const ir = new THREE.Mesh(new THREE.SphereGeometry(0.07, 28, 28), iris);
    ir.scale.set(1, 1.05, 0.45);
    ir.position.set(0, -0.004, 0.045);
    eye.add(ir);
    const pu = new THREE.Mesh(new THREE.SphereGeometry(0.038, 20, 20), pupil);
    pu.scale.set(1, 1, 0.4);
    pu.position.set(0, -0.004, 0.064);
    eye.add(pu);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.016, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    shine.position.set(0.024, 0.026, 0.072);
    eye.add(shine);
    const lid = new THREE.Mesh(new THREE.SphereGeometry(0.12, 32, 16, 0, Math.PI * 2, 0, Math.PI * 0.5), skin);
    lid.scale.set(1.02, 1.1, 0.62);
    lid.rotation.x = LID_OPEN;
    eye.add(lid);
    lids.push(lid);

    // brows: thick, slightly arched
    const brow = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.036, 12, 28, Math.PI * 0.62), hair);
    brow.rotation.z = Math.PI * 0.19 + s * -0.08;
    brow.scale.set(1.05, 0.7, 0.6);
    brow.position.set(x, 0.85, 0.565);
    head.add(brow);
  }

  // nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.075, 28, 28), skin);
  nose.scale.set(0.9, 0.78, 0.85);
  nose.position.set(0, 0.54, 0.58);
  head.add(nose);

  // open smile with teeth
  const mouth = new THREE.Group();
  mouth.position.set(0, 0.37, 0.525);
  mouth.rotation.x = -0.22;
  head.add(mouth);
  const inner = new THREE.Mesh(new THREE.CircleGeometry(0.18, 40, Math.PI, Math.PI), new THREE.MeshStandardMaterial({ color: 0x3b1013, roughness: 0.6 }));
  inner.scale.set(1, 0.68, 1);
  mouth.add(inner);
  const teeth = new THREE.Mesh(new THREE.PlaneGeometry(0.29, 0.045), new THREE.MeshStandardMaterial({ color: 0xf7f5f0, roughness: 0.3 }));
  teeth.position.set(0, -0.024, 0.002);
  mouth.add(teeth);
  const tongue = new THREE.Mesh(new THREE.CircleGeometry(0.06, 24, 0, Math.PI), new THREE.MeshStandardMaterial({ color: 0xc4505a, roughness: 0.5 }));
  tongue.scale.set(1.2, 0.5, 1);
  tongue.position.set(0, -0.11, 0.001);
  mouth.add(tongue);

  // soft cheeks
  for (const s of [-1, 1]) {
    const blush = new THREE.Mesh(
      new THREE.SphereGeometry(0.08, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xe0705e, transparent: true, opacity: 0.22, roughness: 0.9, depthWrite: false }),
    );
    blush.scale.set(1.3, 0.7, 0.4);
    blush.position.set(s * 0.34, 0.5, 0.47);
    head.add(blush);
  }

  // glasses: rounded-rectangle frames, bridge and arms back to the ears
  const frame = M.frame();
  const ring = roundedRing(0.29, 0.23, 0.08, 0.03);
  for (const s of [-1, 1]) {
    const f = new THREE.Mesh(ring, frame);
    f.position.set(s * 0.205, 0.69, 0.6);
    f.rotation.y = s * 0.12;
    head.add(f);
    const lens = new THREE.Mesh(
      new THREE.PlaneGeometry(0.24, 0.18),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.06, roughness: 0.02, depthWrite: false }),
    );
    lens.position.set(s * 0.205, 0.69, 0.6);
    lens.rotation.y = s * 0.12;
    head.add(lens);
    head.add(capsuleBetween(new THREE.Vector3(s * 0.345, 0.72, 0.57), new THREE.Vector3(s * 0.55, 0.7, 0.02), 0.014, frame));
  }
  head.add(capsuleBetween(new THREE.Vector3(-0.07, 0.71, 0.61), new THREE.Vector3(0.07, 0.71, 0.61), 0.016, frame));

  // hair: a textured cap with a high hairline, a quiff swept forward and to
  // his right, and short sideburns
  const cap = new THREE.Mesh(textured(new THREE.SphereGeometry(0.67, 96, 64, 0, Math.PI * 2, 0, Math.PI * 0.58), 0.032), hair);
  cap.scale.set(0.98, 1.04, 1.03);
  cap.position.set(0, 0.68, -0.04);
  cap.rotation.x = -0.55;
  head.add(cap);
  const quiff: [number, number, number, number, number, number, number][] = [
    // x, y, z, radius, scaleX, rotZ, rotY
    [0.0, 1.27, 0.02, 0.32, 1.55, 0.0, 0.0], // top volume
    [-0.3, 1.13, 0.27, 0.21, 1.25, 0.12, 0.3],
    [-0.1, 1.2, 0.3, 0.26, 1.45, -0.2, 0.2],
    [0.16, 1.21, 0.28, 0.25, 1.4, -0.34, 0.0],
    [0.36, 1.1, 0.34, 0.19, 1.3, -0.55, -0.25],
  ];
  for (const [x, y, z, r, sx, rz, ry] of quiff) {
    const q = new THREE.Mesh(textured(new THREE.SphereGeometry(r, 48, 32), 0.03), hair);
    q.scale.set(sx, 0.6, 1.05);
    q.position.set(x, y, z);
    q.rotation.set(0.25, ry, rz);
    head.add(q);
  }
  for (const s of [-1, 1]) {
    head.add(capsuleBetween(new THREE.Vector3(s * 0.575, 0.8, 0.08), new THREE.Vector3(s * 0.565, 0.6, 0.13), 0.055, hair));
  }

  // measure once so the layout can size and place it in pixels
  const box = new THREE.Box3().setFromObject(avatar);
  return { avatar, head, lids, top: box.max.y, height: box.max.y - box.min.y };
}

export default function HeroScene() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
    } catch {
      return; // no WebGL: keep the CSS orb
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.6 : 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xfff1e6, 2.0);
    key.position.set(2.2, 3, 6);
    scene.add(key);
    const soft = new THREE.DirectionalLight(0xdfe6ff, 0.7);
    soft.position.set(-4, 1, 5);
    scene.add(soft);
    const rim = new THREE.PointLight(ACCENT, 38, 10, 1.5); // the orb lights his edges red
    scene.add(rim);

    const { avatar, head, lids, top, height } = buildAvatar();
    scene.add(avatar);

    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(1, 96, 96),
      new THREE.MeshPhysicalMaterial({
        color: 0xc20d3e,
        roughness: 0.24,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        envMapIntensity: 0.4,
        emissive: 0x6e0019,
        emissiveIntensity: 0.6,
      }),
    );
    scene.add(orb);

    // layout in CSS pixels: the bust sits just above the heading, the orb
    // behind his head, on every screen size
    const base = { avatarY: 0, orbY: 0, orbR: 1, s: 1 };
    const ORB_Z = -1.6;
    function layout() {
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const vh = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const u = vh / h; // world units per CSS pixel at z = 0
      const phoneW = w <= 640;
      const heightPx = phoneW ? 240 : 318;
      const h1 = host!.parentElement?.querySelector("h1");
      const topPx = Math.max(phoneW ? 28 : 36, (h1 ? h1.offsetTop : 360) - heightPx - (phoneW ? 20 : 30));
      base.s = (heightPx * u) / height;
      avatar.scale.setScalar(base.s);
      base.avatarY = vh / 2 - topPx * u - top * base.s;
      avatar.position.set(0, base.avatarY, 0);
      // orb: centred behind the head
      const depth = (camera.position.z - ORB_Z) / camera.position.z;
      const headY = base.avatarY + 0.78 * base.s;
      base.orbR = (phoneW ? 135 : 178) * u * depth;
      base.orbY = headY * depth;
      orb.scale.setScalar(base.orbR);
      orb.position.set(0, base.orbY, ORB_Z);
      rim.position.set(0, base.orbY, ORB_Z + base.orbR * 0.6);
    }

    const pointer = new THREE.Vector2(0, 0);
    const look = new THREE.Vector2(0, 0);
    function onPointer(e: PointerEvent) {
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    }

    // blinking: every 2.5–5 s, a 160 ms blink
    let nextBlink = 2;
    let blinkStart = -1;

    const clock = new THREE.Clock();
    function draw() {
      const t = reduce ? 1.2 : clock.getElapsedTime();
      look.lerp(pointer, reduce ? 1 : 0.07);

      head.rotation.y = THREE.MathUtils.clamp(look.x * 0.7, -0.6, 0.6) + Math.sin(t * 0.6) * 0.035;
      head.rotation.x = THREE.MathUtils.clamp(look.y * 0.35, -0.22, 0.3);
      head.rotation.z = -look.x * 0.05 + Math.sin(t * 0.8) * 0.02;
      avatar.rotation.y = look.x * 0.15;
      avatar.position.y = base.avatarY + Math.sin(t * 1.1) * 0.025 * base.s;

      if (!reduce) {
        if (t > nextBlink && blinkStart < 0) blinkStart = t;
        let k = 0;
        if (blinkStart >= 0) {
          const p = (t - blinkStart) / 0.16;
          k = p < 0.5 ? p * 2 : Math.max(0, 2 - p * 2);
          if (p >= 1) {
            blinkStart = -1;
            nextBlink = t + 2.5 + Math.random() * 2.5;
          }
        }
        for (const lid of lids) lid.rotation.x = LID_OPEN + k * (LID_SHUT - LID_OPEN);
      }

      orb.position.x = -look.x * 0.18;
      orb.position.y = base.orbY + look.y * 0.1 + Math.sin(t * 0.7) * 0.04;
      orb.scale.setScalar(base.orbR * (1 + Math.sin(t * 0.9) * 0.012));

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
    if (!reduce) window.addEventListener("pointermove", onPointer, { passive: true });
    start();

    return () => {
      stop();
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      window.removeEventListener("pointermove", onPointer);
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        m.geometry?.dispose();
        const mm = m.material as THREE.Material | THREE.Material[] | undefined;
        if (Array.isArray(mm)) mm.forEach((x) => x.dispose());
        else mm?.dispose();
      });
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className="hero-scene" aria-hidden="true" />;
}
