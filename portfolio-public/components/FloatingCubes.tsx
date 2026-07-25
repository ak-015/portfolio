"use client";

import { useEffect } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

type CubeSpec = {
  top: string;
  left?: string;
  right?: string;
  size: number;
  depth: number; // parallax strength — bigger = drifts further
  hue: "purple" | "blue" | "mixed";
  shape: "cube" | "triangle";
};

// Matches the reference hero: multiple cube/triangle shapes scattered at
// varying sizes around the profile photo, each drifting/rotating in
// response to cursor position.
const CUBES: CubeSpec[] = [
  { top: "4%", left: "42%", size: 46, depth: 18, hue: "blue", shape: "cube" },
  { top: "10%", right: "6%", size: 34, depth: 26, hue: "purple", shape: "triangle" },
  { top: "34%", left: "30%", size: 30, depth: 30, hue: "blue", shape: "cube" },
  { top: "62%", right: "10%", size: 40, depth: 22, hue: "purple", shape: "cube" },
  { top: "80%", left: "44%", size: 26, depth: 34, hue: "mixed", shape: "cube" },
];

function Cube({ spec }: { spec: CubeSpec }) {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 14 });
  const sy = useSpring(my, { stiffness: 60, damping: 14 });

  const x = useTransform(sx, (v) => v * spec.depth);
  const y = useTransform(sy, (v) => v * spec.depth);
  const rotate = useTransform(sx, (v) => v * 20);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mx.set(nx);
      my.set(ny);
    }
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mx, my]);

  const gradient =
    spec.hue === "purple"
      ? "linear-gradient(135deg, #a855f7, #6d28d9)"
      : spec.hue === "blue"
      ? "linear-gradient(135deg, #60a5fa, #2563eb)"
      : "linear-gradient(135deg, #a855f7, #3b82f6)";

  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top: spec.top, left: spec.left, right: spec.right, x, y, rotate }}
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 5 + spec.depth / 6, repeat: Infinity, ease: "easeInOut" }}
    >
      {spec.shape === "cube" ? (
        <div
          style={{
            width: spec.size,
            height: spec.size,
            background: gradient,
            borderRadius: 8,
            boxShadow: "0 0 24px rgba(99,102,241,0.45)",
          }}
          className="opacity-90"
        />
      ) : (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${spec.size / 2}px solid transparent`,
            borderRight: `${spec.size / 2}px solid transparent`,
            borderBottom: `${spec.size}px solid #3b82f6`,
            filter: "drop-shadow(0 0 18px rgba(59,130,246,0.5))",
          }}
          className="opacity-90"
        />
      )}
    </motion.div>
  );
}

export default function FloatingCubes() {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {CUBES.map((spec, i) => (
        <Cube key={i} spec={spec} />
      ))}
    </div>
  );
}
