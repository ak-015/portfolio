export default function FloatingCubes() {
  const cubes = [
    { top: "4%", left: "42%", size: 46, delay: "0s", grad: "url(#g1)", anim: "animate-float" },
    { top: "56%", left: "8%", size: 40, delay: "1.2s", grad: "url(#g2)", anim: "animate-floatSlow" },
    { top: "10%", left: "92%", size: 26, delay: "0.6s", grad: "url(#g1)", anim: "animate-floatSlow" },
    { top: "78%", left: "86%", size: 44, delay: "1.8s", grad: "url(#g2)", anim: "animate-float" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 hidden sm:block" aria-hidden="true">
      <svg width="0" height="0">
        <defs>
          <linearGradient id="g1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
      </svg>
      {cubes.map((c, i) => (
        <svg
          key={i}
          className={c.anim}
          style={{
            position: "absolute",
            top: c.top,
            left: c.left,
            animationDelay: c.delay,
            filter: "drop-shadow(0 0 12px rgba(139,92,246,0.5))",
          }}
          width={c.size}
          height={c.size}
          viewBox="0 0 100 100"
        >
          <polygon points="50,3 95,25 95,75 50,97 5,75 5,25" fill={c.grad} opacity="0.85" />
          <polygon points="50,3 95,25 50,47 5,25" fill="white" opacity="0.12" />
        </svg>
      ))}
    </div>
  );
}
