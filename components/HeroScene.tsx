"use client";

// The 3D hero: a cartoon Vishal (glasses, quiff, hoodie, the Greta app in his
// hands) in front of a glossy red orb that works like a halo. His head
// follows the pointer; the orb drifts the other way and catches the light.
//
// Plain Three.js, loaded after first paint (see HeroSceneLoader). Rendering
// pauses when the hero is off screen or the tab is hidden. With
// prefers-reduced-motion it draws one still frame. No WebGL: renders nothing
// and the flat CSS orb stays.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const ACCENT = 0xe3124b;
const SKIN = 0xc98d66;
const HAIR = 0x15100c;

const skin = () => new THREE.MeshPhysicalMaterial({ color: SKIN, roughness: 0.55, sheen: 0.4, sheenColor: 0xffc7a8 });
const hairMat = () => new THREE.MeshStandardMaterial({ color: HAIR, roughness: 0.75 });
const hoodieMat = () =>
  new THREE.MeshPhysicalMaterial({ color: 0x24222b, roughness: 0.9, sheen: 0.7, sheenColor: 0x77727f, sheenRoughness: 0.6 });

// a capsule stretched between two points (arms)
function limb(a: THREE.Vector3, b: THREE.Vector3, r: number, material: THREE.Material) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = new THREE.Mesh(new THREE.CapsuleGeometry(r, Math.max(dir.length() - r * 2, 0.01), 8, 20), material);
  m.position.copy(a).add(b).multiplyScalar(0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return m;
}

function buildAvatar(screen: THREE.Texture) {
  const avatar = new THREE.Group();
  const hoodie = hoodieMat();

  // body
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 0.5, 12, 40), hoodie);
  body.scale.set(1.22, 1, 0.84);
  body.position.y = -1.22;
  avatar.add(body);
  const hood = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.12, 20, 48), hoodie);
  hood.rotation.x = Math.PI / 2;
  hood.position.set(0, -0.6, -0.05);
  avatar.add(hood);
  for (const x of [-0.11, 0.11]) {
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.3, 8), new THREE.MeshStandardMaterial({ color: 0xeeeef2, roughness: 0.6 }));
    cord.position.set(x, -0.83, 0.5);
    cord.rotation.x = -0.3;
    avatar.add(cord);
  }

  // arms reaching to the phone
  for (const side of [-1, 1]) {
    const shoulder = new THREE.Vector3(side * 0.66, -0.9, 0.05);
    const elbow = new THREE.Vector3(side * 0.62, -1.42, 0.38);
    const hand = new THREE.Vector3(side * 0.26, -1.12, 0.74);
    avatar.add(limb(shoulder, elbow, 0.15, hoodie));
    avatar.add(limb(elbow, hand, 0.14, hoodie));
    const palm = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 24), skin());
    palm.scale.set(0.9, 1, 0.85);
    palm.position.copy(hand).add(new THREE.Vector3(side * -0.02, 0, 0.04));
    avatar.add(palm);
  }

  // the phone, showing the real Greta home screen
  const phone = new THREE.Group();
  phone.add(new THREE.Mesh(new RoundedBoxGeometry(0.46, 0.94, 0.05, 5, 0.07), new THREE.MeshStandardMaterial({ color: 0x1b1b20, roughness: 0.25, metalness: 0.8 })));
  const display = new THREE.Mesh(new THREE.PlaneGeometry(0.41, 0.89), new THREE.MeshBasicMaterial({ map: screen, toneMapped: false }));
  display.position.z = 0.027;
  phone.add(display);
  phone.position.set(0, -1.02, 0.8);
  phone.rotation.set(-0.38, 0, 0);
  avatar.add(phone);

  // neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.3, 24), skin());
  neck.position.y = -0.55;
  avatar.add(neck);

  // head
  const head = new THREE.Group();
  head.scale.setScalar(1.14);
  head.position.y = 0.05;
  avatar.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), skin());
  skull.scale.set(0.96, 1.07, 0.98);
  head.add(skull);
  for (const x of [-0.48, 0.48]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.1, 24, 24), skin());
    ear.scale.set(0.55, 1, 0.7);
    ear.position.set(x, -0.03, 0);
    head.add(ear);
  }

  // hair: a cap plus a quiff of tufts at the front
  const hair = hairMat();
  const cap = new THREE.Mesh(new THREE.SphereGeometry(0.535, 64, 64, 0, Math.PI * 2, 0, Math.PI * 0.56), hair);
  cap.scale.set(1, 1.04, 1.04);
  cap.position.set(0, 0.04, -0.03);
  cap.rotation.x = -0.32;
  head.add(cap);
  const back = new THREE.Mesh(new THREE.SphereGeometry(0.5, 48, 48), hair);
  back.scale.set(1.02, 0.95, 0.9);
  back.position.set(0, 0.06, -0.12);
  head.add(back);
  const tufts: [number, number, number, number][] = [
    [-0.22, 0.44, 0.2, 0.19],
    [0.0, 0.5, 0.24, 0.22],
    [0.21, 0.45, 0.19, 0.19],
    [0.08, 0.4, 0.34, 0.16],
    [-0.1, 0.38, 0.33, 0.15],
  ];
  for (const [x, y, z, r] of tufts) {
    const t = new THREE.Mesh(new THREE.SphereGeometry(r, 32, 32), hair);
    t.scale.set(1.25, 0.72, 1);
    t.position.set(x, y, z);
    t.rotation.z = x * -0.8;
    head.add(t);
  }

  // face
  const frame = new THREE.MeshStandardMaterial({ color: 0x101013, roughness: 0.3, metalness: 0.7 });
  for (const x of [-0.18, 0.18]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.048, 20, 20), new THREE.MeshStandardMaterial({ color: 0x0a0a0c, roughness: 0.2 }));
    eye.position.set(x, 0.03, 0.455);
    head.add(eye);
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.014, 10, 10), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    spark.position.set(x + 0.018, 0.052, 0.5);
    head.add(spark);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.022, 14, 56), frame);
    rim.position.set(x, 0.03, 0.51);
    head.add(rim);
    const lens = new THREE.Mesh(
      new THREE.CircleGeometry(0.13, 40),
      new THREE.MeshPhysicalMaterial({ color: 0xd6e4ff, transparent: true, opacity: 0.14, roughness: 0.02 }),
    );
    lens.position.set(x, 0.03, 0.51);
    head.add(lens);
    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.12, 4, 10), hair);
    brow.rotation.z = Math.PI / 2 + (x < 0 ? 0.14 : -0.14);
    brow.position.set(x, 0.22, 0.47);
    head.add(brow);
    const cheek = new THREE.Mesh(
      new THREE.SphereGeometry(0.07, 20, 20),
      new THREE.MeshStandardMaterial({ color: 0xe0705e, transparent: true, opacity: 0.28, roughness: 0.8 }),
    );
    cheek.scale.set(1.2, 0.6, 0.4);
    cheek.position.set(x * 1.55, -0.12, 0.42);
    head.add(cheek);
  }
  const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.1, 8), frame);
  bridge.rotation.z = Math.PI / 2;
  bridge.position.set(0, 0.05, 0.52);
  head.add(bridge);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 24, 24), skin());
  nose.position.set(0, -0.08, 0.49);
  head.add(nose);
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 12, 40, Math.PI), new THREE.MeshStandardMaterial({ color: 0x5a1f22, roughness: 0.5 }));
  smile.rotation.z = Math.PI;
  smile.position.set(0, -0.18, 0.44);
  head.add(smile);

  return { avatar, head };
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

    scene.add(new THREE.AmbientLight(0xffffff, 0.3));
    const key = new THREE.DirectionalLight(0xffffff, 2.4);
    key.position.set(2.5, 3, 6);
    scene.add(key);
    const rim = new THREE.PointLight(ACCENT, 40, 10, 1.5); // the orb lights his edges red
    scene.add(rim);
    const fill = new THREE.PointLight(0xffffff, 3, 12);
    fill.position.set(-4, -2, 4);
    scene.add(fill);

    let drawRef = () => {};
    const tex = new THREE.TextureLoader().load("/shots/greta-home.webp", () => drawRef());
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const { avatar, head } = buildAvatar(tex);
    scene.add(avatar);

    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(1, 96, 96),
      new THREE.MeshPhysicalMaterial({
        color: 0xc20d3e,
        roughness: 0.24,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
        envMapIntensity: 0.4,
        emissive: 0x6e0019,
        emissiveIntensity: 0.6,
      }),
    );
    scene.add(orb);

    // layout in CSS pixels: the avatar sits just above the heading, the orb
    // behind his head, on every screen size
    const base = { avatarY: 0, orbX: 0, orbY: 0, orbR: 1, s: 1 };
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
      const heightPx = phoneW ? 235 : 310;
      const h1 = host!.parentElement?.querySelector("h1");
      const topPx = Math.max(phoneW ? 30 : 40, (h1 ? h1.offsetTop : 360) - heightPx - (phoneW ? 22 : 34));
      base.s = (heightPx * u) / 2.8; // the avatar is ~2.8 units tall at scale 1
      avatar.scale.setScalar(base.s);
      base.avatarY = vh / 2 - topPx * u - 0.64 * base.s;
      avatar.position.set(0, base.avatarY, 0);
      // orb: behind the head, a bit higher, sized in pixels
      const depth = (camera.position.z - ORB_Z) / camera.position.z;
      base.orbR = (phoneW ? 132 : 175) * u * depth;
      base.orbX = 0;
      base.orbY = (base.avatarY + 0.12 * base.s) * depth;
      orb.scale.setScalar(base.orbR);
      orb.position.set(base.orbX, base.orbY, ORB_Z);
      rim.position.set(0, base.orbY, ORB_Z + base.orbR * 0.6);
    }

    const pointer = new THREE.Vector2(0, 0);
    const look = new THREE.Vector2(0, 0);
    function onPointer(e: PointerEvent) {
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    }

    const clock = new THREE.Clock();
    function draw() {
      const t = reduce ? 1.2 : clock.getElapsedTime();
      look.lerp(pointer, reduce ? 1 : 0.07);

      head.rotation.y = THREE.MathUtils.clamp(look.x * 0.75, -0.65, 0.65) + Math.sin(t * 0.6) * 0.04;
      head.rotation.x = THREE.MathUtils.clamp(look.y * 0.4, -0.25, 0.35);
      head.rotation.z = -look.x * 0.06 + Math.sin(t * 0.8) * 0.025;
      avatar.rotation.y = look.x * 0.18;
      avatar.position.y = base.avatarY + Math.sin(t * 1.1) * 0.04 * base.s;

      orb.position.x = base.orbX - look.x * 0.18;
      orb.position.y = base.orbY + look.y * 0.1 + Math.sin(t * 0.7) * 0.04;
      orb.rotation.y = t * 0.1;
      const breathe = 1 + Math.sin(t * 0.9) * 0.012;
      orb.scale.setScalar(base.orbR * breathe);

      renderer.render(scene, camera);
    }
    drawRef = draw;

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
      drawRef = () => {};
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
      tex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className="hero-scene" aria-hidden="true" />;
}
