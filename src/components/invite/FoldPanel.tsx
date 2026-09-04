import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "motion/react";

/**
 * A section of the letter that unfolds along its top edge as it scrolls in,
 * with a soft fold shadow travelling across the paper.
 */
export function FoldPanel({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 92%", "start 35%"],
  });

  const rotateX = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [-46, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.45, 1], [0, 0.85, 1]);
  const y = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [26, 0]);
  const shadow = useTransform(scrollYProgress, [0, 1], [0.42, 0]);

  return (
    <section
      ref={ref}
      id={id}
      className="relative"
      style={{ perspective: 1400, perspectiveOrigin: "50% 0%" }}
    >
      {/* fold crease */}
      <div className="gold-rule mx-auto h-px w-3/4 opacity-50" />
      <motion.div
        style={{ rotateX, opacity, y, transformOrigin: "top center" }}
        className={`paper grain relative px-6 py-16 sm:px-12 sm:py-20 ${className}`}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-40"
          style={{
            opacity: shadow,
            background:
              "linear-gradient(to bottom, oklch(0.35 0.02 60 / 0.5), transparent)",
          }}
        />
        {children}
      </motion.div>
    </section>
  );
}
