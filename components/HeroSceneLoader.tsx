"use client";

import dynamic from "next/dynamic";

// Three.js loads in its own chunk after the hero text has painted.
const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false, loading: () => null });

export default function HeroSceneLoader() {
  return <HeroScene />;
}
