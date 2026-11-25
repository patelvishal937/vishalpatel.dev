"use client";

// The 3D hero: a cartoon version of Vishal (glasses, hoodie, phone in hand)
// whose head follows the pointer, a floating phone showing the real Greta
// home screen, an MCP-style node network and a few glossy shapes.
//
// Plain Three.js, loaded after first paint (see HeroSceneLoader). Rendering
// pauses when the hero is off screen or the tab is hidden. With
// prefers-reduced-motion it draws one still frame. No WebGL: renders nothing
// and the CSS glow stays.

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";

const ACCENT = 0xe3124b;
const SKIN = 0xc98d66;
const HAIR = 0x16100c;
const HOODIE = 0x24212d;

function mat(color: number, roughness = 0.55, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function buildAvatar() {
  const avatar = new THREE.Group();

  // body: hoodie
  const body = new THREE.Mesh(new THREE.CapsuleGeometry(0.62, 0.55, 10, 32), mat(HOODIE, 0.85));
  body.scale.set(1.18, 1, 0.82);
  body.position.y = -1.2;
  avatar.add(body);
  const hood = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.11, 16, 40), mat(HOODIE, 0.85));
  hood.rotation.x = Math.PI / 2;
  hood.position.set(0, -0.58, -0.02);
  avatar.add(hood);
  for (const x of [-0.12, 0.12]) {
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.32, 8), mat(0xe9e9ee, 0.6));
    cord.position.set(x, -0.82, 0.47);
    cord.rotation.x = -0.25;
    avatar.add(cord);
  }

  // neck
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.18, 0.3, 24), mat(SKIN, 0.6));
  neck.position.y = -0.55;
  avatar.add(neck);

  // head (its own group so it can look at the pointer)
  const head = new THREE.Group();
  avatar.add(head);
  const skull = new THREE.Mesh(new THREE.SphereGeometry(0.5, 48, 48), mat(SKIN, 0.6));
  skull.scale.set(0.96, 1.08, 0.98);
  head.add(skull);
  for (const x of [-0.48, 0.48]) {
    const ear = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), mat(SKIN, 0.6));
    ear.scale.set(0.55, 1, 0.7);
    ear.position.set(x, -0.03, 0);
    head.add(ear);
  }
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.53, 48, 48, 0, Math.PI * 2, 0, Math.PI * 0.52), mat(HAIR, 0.9));
  hair.scale.set(0.98, 1.08, 1.02);
  hair.position.set(0, 0.03, -0.02);
  hair.rotation.x = -0.18;
  head.add(hair);
  const fringe = new THREE.Mesh(new THREE.SphereGeometry(0.3, 32, 32), mat(HAIR, 0.9));
  fringe.scale.set(1.45, 0.48, 0.9);
  fringe.position.set(0.06, 0.4, 0.27);
  fringe.rotation.z = -0.28;
  head.add(fringe);

  // face
  const dark = mat(0x111114, 0.4, 0.6);
  for (const x of [-0.18, 0.18]) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.045, 16, 16), mat(0x0b0b0d, 0.3));
    eye.position.set(x, 0.03, 0.455);
    head.add(eye);
    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.135, 0.022, 12, 48), dark);
    rim.position.set(x, 0.03, 0.5);
    head.add(rim);
    const lens = new THREE.Mesh(
      new THREE.CircleGeometry(0.13, 32),
      new THREE.MeshPhysicalMaterial({ color: 0xbfd4ff, transparent: true, opacity: 0.16, roughness: 0.05, metalness: 0.1 }),
    );
    lens.position.set(x, 0.03, 0.5);
    head.add(lens);
    const brow = new THREE.Mesh(new THREE.CapsuleGeometry(0.022, 0.12, 4, 8), mat(HAIR, 0.9));
    brow.rotation.z = Math.PI / 2 + (x < 0 ? 0.12 : -0.12);
    brow.position.set(x, 0.22, 0.46);
    head.add(brow);
  }
  const bridge = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.1, 8), dark);
  bridge.rotation.z = Math.PI / 2;
  bridge.position.set(0, 0.05, 0.51);
  head.add(bridge);
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 20, 20), mat(SKIN, 0.55));
  nose.scale.set(0.9, 1, 0.9);
  nose.position.set(0, -0.08, 0.49);
  head.add(nose);
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.02, 10, 32, Math.PI), mat(0x5a1f22, 0.5));
  smile.rotation.z = Math.PI;
  smile.position.set(0, -0.17, 0.44);
  head.add(smile);

  // phone in hand
  const phone = new THREE.Group();
  const phoneBody = new THREE.Mesh(new RoundedBoxGeometry(0.42, 0.78, 0.05, 4, 0.06), mat(0x1a1a1f, 0.3, 0.7));
  phone.add(phoneBody);
  const glow = new THREE.Mesh(
    new THREE.PlaneGeometry(0.36, 0.7),
    new THREE.MeshStandardMaterial({ color: 0x2a1a55, emissive: 0x6d4bff, emissiveIntensity: 0.6, roughness: 0.3 }),
  );
  glow.position.z = 0.027;
  phone.add(glow);
  phone.position.set(0.05, -1.0, 0.72);
  phone.rotation.set(-0.5, -0.15, 0.05);
  avatar.add(phone);
  for (const x of [-0.2, 0.26]) {
    const hand = new THREE.Mesh(new THREE.SphereGeometry(0.1, 20, 20), mat(SKIN, 0.6));
    hand.scale.set(1, 0.85, 0.9);
    hand.position.set(x, -1.18, 0.7);
    avatar.add(hand);
  }

  return { avatar, head };
}

function buildPhone(texture: THREE.Texture) {
  const g = new THREE.Group();
  const shell = new THREE.Mesh(new RoundedBoxGeometry(1.1, 2.3, 0.11, 6, 0.16), mat(0x202026, 0.25, 0.85));
  g.add(shell);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(1.0, 2.18),
    new THREE.MeshBasicMaterial({ map: texture, toneMapped: false }),
  );
  screen.position.z = 0.058;
  g.add(screen);
  return g;
}

function buildNetwork() {
  const g = new THREE.Group();
  const geo = new THREE.IcosahedronGeometry(0.6, 0);
  const wire = new THREE.LineSegments(
    new THREE.EdgesGeometry(geo),
    new THREE.LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.45 }),
  );
  g.add(wire);
  const pos = geo.getAttribute("position");
  const seen = new Set<string>();
  const nodeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: ACCENT, emissiveIntensity: 0.9, roughness: 0.3 });
  for (let i = 0; i < pos.count; i++) {
    const key = `${pos.getX(i).toFixed(2)},${pos.getY(i).toFixed(2)},${pos.getZ(i).toFixed(2)}`;
    if (seen.has(key)) continue;
    seen.add(key);
    const node = new THREE.Mesh(new THREE.SphereGeometry(0.055, 16, 16), nodeMat);
    node.position.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    g.add(node);
  }
  return g;
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
      return; // no WebGL: keep the CSS hero
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, window.innerWidth < 700 ? 1.5 : 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const pmrem = new THREE.PMREMGenerator(renderer);
    scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 10);

    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(3, 4, 6);
    scene.add(key);
    const rim = new THREE.PointLight(ACCENT, 30, 14);
    rim.position.set(0, 3.5, -2);
    scene.add(rim);
    const fill = new THREE.PointLight(0x7c5cff, 12, 12);
    fill.position.set(-4, -2, 4);
    scene.add(fill);

    // objects
    const { avatar, head } = buildAvatar();
    scene.add(avatar);

    const tex = new THREE.TextureLoader().load("/shots/greta-home.webp", () => draw());
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = 4;
    const phone = buildPhone(tex);
    scene.add(phone);

    const network = buildNetwork();
    scene.add(network);

    const cube = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.62, 0.62, 6, 0.12), mat(ACCENT, 0.25, 0.1));
    scene.add(cube);
    const torus = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.13, 32, 64), mat(0xd9d9e0, 0.12, 1));
    scene.add(torus);
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.26, 32, 32),
      new THREE.MeshPhysicalMaterial({ color: 0xffffff, roughness: 0.05, transmission: 0.9, thickness: 0.5, ior: 1.4 }),
    );
    scene.add(orb);

    // layout: place things around the centred text, based on how much of
    // the world is visible at z = 0
    const base = {
      avatar: new THREE.Vector3(),
      phone: new THREE.Vector3(),
      network: new THREE.Vector3(),
      cube: new THREE.Vector3(),
      torus: new THREE.Vector3(),
      orb: new THREE.Vector3(),
    };
    let mobile = false;
    function layout() {
      const w = host!.clientWidth;
      const h = host!.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      const vh = 2 * camera.position.z * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2));
      const vw = vh * camera.aspect;
      mobile = w <= 640;
      const tablet = !mobile && vw < 9.5;
      phone.visible = !mobile;
      torus.visible = orb.visible = !tablet && !mobile;
      if (tablet) {
        // tablets: text in the middle, avatar and phone below the buttons, shapes in the top corners
        const edge = vw / 2;
        avatar.scale.setScalar(0.7);
        base.avatar.set(edge - 1.35, -vh / 2 + 1.4, 0);
        phone.scale.setScalar(0.7);
        base.phone.set(-edge + 1.0, -vh / 2 + 1.2, 0);
        base.network.set(-edge + 1.0, vh / 2 - 1.05, -1);
        base.cube.set(edge - 1.0, vh / 2 - 1.35, -1);
      } else if (!mobile) {
        const edge = vw / 2;
        avatar.scale.setScalar(1);
        base.avatar.set(edge - 1.7, -0.35, 0);
        phone.scale.setScalar(1);
        base.phone.set(-edge + 1.6, 0.15, 0);
        base.network.set(-edge + 3.0, vh / 2 - 1.2, -1);
        base.cube.set(edge - 3.1, vh / 2 - 1.0, -1.5);
        base.torus.set(-edge + 2.9, -vh / 2 + 1.1, 0.5);
        base.orb.set(edge - 3.2, -vh / 2 + 1.0, 1);
      } else {
        // phones: the avatar sits in the strip above the heading (the hero has
        // 300px of top padding there), placed in pixels so it fits any phone height
        const u = vh / h; // world units per CSS pixel
        const ys = (px: number) => vh / 2 - px * u;
        const xs = (px: number) => (px - w / 2) * u;
        const s = (230 * u) / 2.75; // avatar is ~2.75 units tall at scale 1
        avatar.scale.setScalar(s);
        // sit just above the heading, wherever the layout put it
        const h1 = host!.parentElement?.querySelector("h1");
        const top = Math.max(40, (h1 ? h1.offsetTop : 300) - 255);
        base.avatar.set(0, ys(top) - 0.62 * s, 0);
        base.network.set(xs(58), ys(top + 60), -1);
        base.cube.set(xs(w - 56), ys(top + 155), -1);
        base.torus.set(-vw / 2 + 0.7, -vh / 2 + 0.8, -1.5);
        base.orb.set(vw / 2 - 0.7, -vh / 2 + 1.1, -1);
      }
      for (const [k, v] of Object.entries(base)) {
        const obj = { avatar, phone, network, cube, torus, orb }[k as keyof typeof base];
        obj.position.copy(v);
      }
      const small = mobile ? 0.6 : 1;
      network.scale.setScalar(small);
      cube.scale.setScalar(small);
      torus.scale.setScalar(small);
      orb.scale.setScalar(small);
    }

    // pointer: head looks at it, the scene leans toward it a little
    const pointer = new THREE.Vector2(0, 0);
    const look = new THREE.Vector2(0, 0);
    function onPointer(e: PointerEvent) {
      pointer.set((e.clientX / window.innerWidth) * 2 - 1, (e.clientY / window.innerHeight) * 2 - 1);
    }

    const clock = new THREE.Clock();
    function draw() {
      const t = reduce ? 1.2 : clock.getElapsedTime();
      look.lerp(pointer, reduce ? 1 : 0.06);

      // the head turns toward the pointer (relative to where the avatar is on screen)
      const ax = mobile ? 0 : 0.55;
      head.rotation.y = THREE.MathUtils.clamp((look.x - ax) * 0.9, -0.75, 0.6);
      head.rotation.x = THREE.MathUtils.clamp(look.y * 0.45, -0.3, 0.35);
      head.rotation.z = Math.sin(t * 0.8) * 0.03;
      avatar.position.y = base.avatar.y + Math.sin(t * 1.1) * 0.06;
      avatar.rotation.y = -0.25 + look.x * 0.12 - (mobile ? -0.25 : 0);

      phone.position.y = base.phone.y + Math.sin(t * 0.9 + 1) * 0.12;
      phone.rotation.set(-0.08 + look.y * 0.1, 0.42 + look.x * 0.2 + Math.sin(t * 0.5) * 0.06, 0.06);

      network.rotation.set(t * 0.25, t * 0.35, 0);
      network.position.y = base.network.y + Math.sin(t * 0.7) * 0.1;
      cube.rotation.set(t * 0.4, t * 0.3, 0.3);
      cube.position.y = base.cube.y + Math.sin(t * 1.2 + 2) * 0.12;
      torus.rotation.set(t * 0.5, 0.6, t * 0.2);
      torus.position.y = base.torus.y + Math.sin(t + 0.5) * 0.1;
      orb.position.y = base.orb.y + Math.sin(t * 1.4) * 0.14;

      scene.rotation.y = look.x * 0.05;
      scene.rotation.x = look.y * 0.03;
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
      tex.dispose();
      pmrem.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  return <div ref={ref} className="hero-scene" aria-hidden="true" />;
}
