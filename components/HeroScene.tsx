"use client";

// The 3D hero: a clay-style 3D avatar of Vishal in front of a soft red glow. Styled like a matte 3D avatar illustration (bead
// eyes, thick brows, open smile, rounded bust), with his own features: thick
// black wavy hair with a fringe, light-grey rectangular glasses, a round face,
// clean-shaven, in a charcoal blazer with a white shirt and red pocket square. His head follows the pointer
// and he blinks; the glow drifts gently the other way.
//
// Plain Three.js, loaded after first paint (see HeroSceneLoader). Rendering
// pauses when the hero is off screen or the tab is hidden. With
// prefers-reduced-motion it draws one still frame. No WebGL: renders nothing
// and the flat CSS orb stays.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

const ACCENT = 0xe3124b;

// matte "clay" materials
const clay = (color: number, roughness = 0.72) => new THREE.MeshStandardMaterial({ color, roughness, metalness: 0 });

// a capsule whose axis runs from a to b
function capsuleBetween(a: THREE.Vector3, b: THREE.Vector3, r: number, mat: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(dir.length() - 2 * r, 0.001), 10, 20), mat);
  mesh.position.copy(a).add(b).multiplyScalar(0.5);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return mesh;
}

// rounded rectangle outline as a Shape or Path
function roundRect(s: THREE.Shape | THREE.Path, w: number, h: number, r: number) {
  s.moveTo(-w / 2 + r, -h / 2);
  s.lineTo(w / 2 - r, -h / 2);
  s.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
  s.lineTo(w / 2, h / 2 - r);
  s.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
  s.lineTo(-w / 2 + r, h / 2);
  s.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
  s.lineTo(-w / 2, -h / 2 + r);
  s.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
}

function frameGeometry(w: number, h: number, r: number, t: number) {
  const shape = new THREE.Shape();
  roundRect(shape, w, h, r);
  const hole = new THREE.Path();
  roundRect(hole, w - t * 2, h - t * 2, Math.max(r - t, 0.01));
  shape.holes.push(hole);
  const g = new THREE.ExtrudeGeometry(shape, { depth: 0.035, bevelEnabled: true, bevelThickness: 0.01, bevelSize: 0.008, bevelSegments: 3, curveSegments: 18 });
  g.translate(0, 0, -0.018);
  return g;
}

function buildAvatar() {
  const avatar = new THREE.Group();
  const skin = clay(0xe3b18f, 0.62);
  const hair = clay(0x151110, 0.78);

  // ---------- bust: charcoal blazer, white shirt, red pocket square ----------
  // One smooth lathe for the body; the blazer, lapels and the white shirt "V"
  // are painted on with vertex colours so the edges follow the curve.
  const outline = new THREE.SplineCurve(
    [
      [0.001, -1.36],
      [0.72, -1.34],
      [0.98, -1.16],
      [1.05, -0.86],
      [0.99, -0.56],
      [0.82, -0.29],
      [0.52, -0.13],
      [0.28, -0.07],
      [0.001, -0.06],
    ].map(([x, y]) => new THREE.Vector2(x, y)),
  ).getPoints(140);
  const bodyGeo = new THREE.LatheGeometry(outline, 260);
  const BLAZER = new THREE.Color(0x2e323d);
  const LAPEL = new THREE.Color(0x22252d);
  const SHIRT = new THREE.Color(0xc9c7c1);
  const pos = bodyGeo.getAttribute("position");
  const colors = new Float32Array(pos.count * 3);
  const c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    c.copy(BLAZER);
    if (z > 0) {
      // soft edges (smoothstep over a small band) so the V doesn't look stepped
      const e = 0.018;
      const ax = Math.abs(x);
      const t = THREE.MathUtils.clamp((y + 0.8) / 0.74, 0, 1); // 0 at the V point, 1 at the neck
      const v = 0.3 * t; // half-width of the shirt V
      const lapel = v + 0.15 * Math.min(1, t * 4 + 0.35); // lapels run along the V
      const lapelAmt = THREE.MathUtils.smoothstep(lapel + e, lapel - e, ax) * THREE.MathUtils.smoothstep(y, -0.93, -0.87);
      const shirtAmt = THREE.MathUtils.smoothstep(v + e, v - e, ax) * THREE.MathUtils.smoothstep(y, -0.82, -0.78);
      c.lerp(LAPEL, lapelAmt).lerp(SHIRT, shirtAmt);
    }
    colors.set([c.r, c.g, c.b], i * 3);
  }
  bodyGeo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const torso = new THREE.Mesh(bodyGeo, new THREE.MeshStandardMaterial({ vertexColors: true, roughness: 0.82 }));
  torso.scale.set(0.86, 0.9, 0.58);
  avatar.add(torso);

  // white shirt collar, open at the front, with two collar points
  const shirtMat = clay(0xd2d0ca, 0.7);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.235, 0.26, 0.12, 48, 1, true, 0.5, Math.PI * 2 - 1.0), shirtMat);
  collar.position.y = 0.0;
  collar.scale.set(1, 1, 0.95);
  avatar.add(collar);
  for (const side of [-1, 1]) {
    const point = capsuleBetween(new THREE.Vector3(side * 0.1, 0.02, 0.2), new THREE.Vector3(side * 0.17, -0.1, 0.25), 0.032, shirtMat);
    point.scale.z = 0.55;
    avatar.add(point);
  }

  // red pocket square on his left breast pocket (viewer's right)
  const sq = new THREE.Shape();
  sq.moveTo(-0.08, 0);
  sq.lineTo(-0.05, 0.07);
  sq.lineTo(-0.01, 0.025);
  sq.lineTo(0.03, 0.08);
  sq.lineTo(0.08, 0);
  sq.lineTo(-0.08, 0);
  const pocket = new THREE.Mesh(new THREE.ExtrudeGeometry(sq, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2 }), clay(ACCENT, 0.55));
  pocket.position.set(0.45, -0.5, 0.47);
  pocket.rotation.set(-0.2, 0.5, 0);
  avatar.add(pocket);

  // one jacket button just under the V
  const btn = new THREE.Mesh(new THREE.SphereGeometry(0.035, 20, 20), clay(0x111216, 0.35));
  btn.scale.set(1, 1, 0.45);
  btn.position.set(0, -0.88, 0.6);
  avatar.add(btn);

  // neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.34, 28), skin);
  neck.position.y = 0.08;
  avatar.add(neck);

  // ---------- head (pivots at the neck) ----------
  const head = new THREE.Group();
  head.position.y = 0.14;
  head.scale.setScalar(1.26);
  avatar.add(head);

  // round face: skull plus full cheeks and jaw
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.62, 72, 72), skin);
  skull.scale.set(0.95, 1.02, 0.95);
  skull.position.y = 0.68;
  head.add(skull);
  const cheeks = new THREE.Mesh(new THREE.SphereGeometry(0.52, 64, 64), skin);
  cheeks.scale.set(1.0, 0.82, 0.92);
  cheeks.position.set(0, 0.46, 0.05);
  head.add(cheeks);
  for (const s of [-1, 1]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.16, 28, 28), skin);
    ear.scale.set(0.42, 1, 0.68);
    ear.position.set(s * 0.6, 0.62, -0.02);
    ear.rotation.y = s * -0.3;
    head.add(ear);
  }

  // bead eyes with a small shine (they squash to blink)
  const eyes: THREE.Group[] = [];
  const bead = new THREE.MeshPhysicalMaterial({ color: 0x0b0b0c, roughness: 0.12, clearcoat: 1 });
  const shineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  for (const s of [-1, 1]) {
    const eye = new THREE.Group();
    eye.position.set(s * 0.2, 0.68, 0.555);
    head.add(eye);
    const ball = new THREE.Mesh(new THREE.SphereGeometry(0.074, 28, 28), bead);
    ball.scale.set(0.82, 1.18, 0.5);
    eye.add(ball);
    const shine = new THREE.Mesh(new THREE.SphereGeometry(0.013, 12, 12), shineMat);
    shine.position.set(0.018, 0.034, 0.03);
    eye.add(shine);
    eyes.push(eye);

    // thick, short brows
    const brow = capsuleBetween(new THREE.Vector3(s * 0.11, 0.905, 0.6), new THREE.Vector3(s * 0.3, 0.895, 0.55), 0.042, hair);
    brow.scale.z = 0.75;
    head.add(brow);
  }

  // rounded nose
  head.add(capsuleBetween(new THREE.Vector3(0, 0.68, 0.58), new THREE.Vector3(0, 0.56, 0.635), 0.058, skin));
  const tip = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32), skin);
  tip.scale.set(1.05, 0.9, 0.85);
  tip.position.set(0, 0.53, 0.635);
  head.add(tip);

  // wide open smile: red inside, white top teeth
  const mouth = new THREE.Group();
  mouth.position.set(0, 0.37, 0.57);
  mouth.rotation.x = -0.2;
  head.add(mouth);
  const smileShape = new THREE.Shape();
  smileShape.moveTo(-0.16, 0);
  smileShape.lineTo(0.16, 0);
  smileShape.quadraticCurveTo(0.165, -0.11, 0, -0.125);
  smileShape.quadraticCurveTo(-0.165, -0.11, -0.16, 0);
  const inside = new THREE.Mesh(new THREE.ExtrudeGeometry(smileShape, { depth: 0.02, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 20 }), clay(0x9c1c22, 0.5));
  inside.position.z = -0.03;
  mouth.add(inside);
  const teethShape = new THREE.Shape();
  roundRect(teethShape, 0.29, 0.05, 0.02);
  const teeth = new THREE.Mesh(new THREE.ExtrudeGeometry(teethShape, { depth: 0.012, bevelEnabled: false, curveSegments: 8 }), clay(0xfbfaf6, 0.35));
  teeth.position.set(0, -0.027, -0.005);
  mouth.add(teeth);

  // light-grey rectangular glasses, like his
  const frameMat = new THREE.MeshPhysicalMaterial({ color: 0xc9ccd3, roughness: 0.3, transparent: true, opacity: 0.88, clearcoat: 0.6 });
  const ring = frameGeometry(0.3, 0.23, 0.075, 0.038);
  for (const s of [-1, 1]) {
    const f = new THREE.Mesh(ring, frameMat);
    f.position.set(s * 0.205, 0.69, 0.63);
    f.rotation.y = s * 0.12;
    head.add(f);
    const lens = new THREE.Mesh(
      new THREE.PlaneGeometry(0.235, 0.165),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.08, roughness: 0.02, depthWrite: false }),
    );
    lens.position.set(s * 0.205, 0.69, 0.63);
    lens.rotation.y = s * 0.12;
    head.add(lens);
    head.add(capsuleBetween(new THREE.Vector3(s * 0.355, 0.74, 0.6), new THREE.Vector3(s * 0.58, 0.72, 0.04), 0.017, frameMat));
  }
  head.add(capsuleBetween(new THREE.Vector3(-0.07, 0.72, 0.645), new THREE.Vector3(0.07, 0.72, 0.645), 0.02, frameMat));

  // thick black wavy hair: a cap plus a cloud of soft clumps, with a fringe
  // falling onto the forehead
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.665, 64, 48, 0, Math.PI * 2, 0, Math.PI * 0.6), hair);
  cap.position.set(0, 0.69, -0.04);
  cap.rotation.x = -0.5;
  head.add(cap);
  const waves: [number, number, number, number, number, number, number][] = [
    // x, y, z, radius, scaleX, scaleY, rotZ
    // crown: big soft waves
    [0, 1.31, -0.02, 0.36, 1.25, 0.68, 0],
    [-0.27, 1.24, -0.16, 0.32, 1.1, 0.75, 0.3],
    [0.27, 1.25, -0.14, 0.32, 1.1, 0.75, -0.3],
    // fringe swept across the forehead
    [-0.26, 1.12, 0.35, 0.25, 1.35, 0.62, 0.28],
    [0.07, 1.15, 0.39, 0.27, 1.4, 0.6, -0.08],
    [0.36, 1.06, 0.31, 0.22, 1.25, 0.65, -0.42],
    // short sides, ears stay visible
    [-0.5, 1.07, -0.06, 0.23, 0.8, 0.85, 0.2],
    [0.5, 1.08, -0.06, 0.23, 0.8, 0.85, -0.2],
    // back
    [0, 1.03, -0.42, 0.34, 1.25, 0.85, 0],
    [0, 0.8, -0.46, 0.28, 1.3, 0.8, 0],
  ];
  for (const [x, y, z, r, sx, sy, rz] of waves) {
    const c = new THREE.Mesh(new THREE.SphereGeometry(r, 48, 36), hair);
    c.scale.set(sx, sy, 1);
    c.position.set(x, y, z);
    c.rotation.z = rz;
    head.add(c);
  }

  // measure once so the layout can size and place it in pixels
  const box = new THREE.Box3().setFromObject(avatar);
  const headCenter = head.position.y + 0.72 * head.scale.y;
  return { avatar, head, eyes, top: box.max.y, height: box.max.y - box.min.y, headCenter };
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
    renderer.toneMappingExposure = 1.0;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
    scene.environmentIntensity = 0.55;

    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    // soft studio light, like a clay render
    scene.add(new THREE.HemisphereLight(0xffffff, 0x6a5a55, 0.9));
    const key = new THREE.DirectionalLight(0xfff4ec, 1.9);
    key.position.set(1.8, 3, 6);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xe8eeff, 0.6);
    fill.position.set(-4, 0.5, 5);
    scene.add(fill);
    const rim = new THREE.PointLight(ACCENT, 14, 12, 1.5); // the glow lights his edges red
    scene.add(rim);

    const { avatar, head, eyes, top, height, headCenter } = buildAvatar();
    scene.add(avatar);

    // a soft red glow behind his head (a radial-gradient sprite)
    const glowCanvas = document.createElement("canvas");
    glowCanvas.width = glowCanvas.height = 256;
    const g2d = glowCanvas.getContext("2d")!;
    const grad = g2d.createRadialGradient(128, 128, 0, 128, 128, 128);
    grad.addColorStop(0, "rgba(227, 18, 75, 0.85)");
    grad.addColorStop(0.35, "rgba(227, 18, 75, 0.42)");
    grad.addColorStop(0.7, "rgba(227, 18, 75, 0.1)");
    grad.addColorStop(1, "rgba(227, 18, 75, 0)");
    g2d.fillStyle = grad;
    g2d.fillRect(0, 0, 256, 256);
    const glowTex = new THREE.CanvasTexture(glowCanvas);
    glowTex.colorSpace = THREE.SRGBColorSpace;
    const orb = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, transparent: true, depthWrite: false, toneMapped: false }));
    scene.add(orb);

    // layout in CSS pixels: the bust sits just above the heading, the glow
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
      // glow: centred behind the head
      const depth = (camera.position.z - ORB_Z) / camera.position.z;
      base.orbR = (phoneW ? 190 : 250) * u * depth;
      base.orbY = (base.avatarY + headCenter * base.s) * depth;
      orb.scale.set(base.orbR * 2, base.orbR * 2, 1);
      orb.position.set(0, base.orbY, ORB_Z);
      rim.position.set(0, base.orbY + base.orbR * 0.25, ORB_Z - 0.6); // behind and above: lights hair and shoulder edges only
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
        for (const e of eyes) e.scale.y = 1 - k * 0.9;
      }

      orb.position.x = -look.x * 0.12;
      orb.position.y = base.orbY + look.y * 0.06;
      const pulse = base.orbR * 2 * (1 + Math.sin(t * 0.9) * 0.03);
      orb.scale.set(pulse, pulse, 1);

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
      glowTex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className="hero-scene" aria-hidden="true" />;
}
