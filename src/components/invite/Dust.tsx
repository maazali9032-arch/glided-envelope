import { useMemo } from "react";
import { motion } from "motion/react";

export function Dust({ count = 26 }: { count?: number }) {
  const motes = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        left: (i * 37) % 100,
        top: (i * 61) % 100,
        size: 1 + ((i * 13) % 5) * 0.6,
        duration: 14 + ((i * 7) % 12),
        delay: (i % 10) * 1.1,
        drift: ((i % 5) - 2) * 18,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {motes.map((m) => (
        <motion.span
          key={m.id}
          className="absolute rounded-full bg-champagne"
          style={{
            left: `${m.left}%`,
            top: `${m.top}%`,
            width: m.size,
            height: m.size,
            filter: "blur(0.3px)",
          }}
          initial={{ opacity: 0 }}
          animate={{
            opacity: [0, 0.75, 0],
            y: [0, -70, -140],
            x: [0, m.drift, 0],
          }}
          transition={{
            duration: m.duration,
            delay: m.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
