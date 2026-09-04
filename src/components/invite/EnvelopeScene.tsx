import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Dust } from "./Dust";
import { Crest } from "./Ornament";
import type { InvitationConfig } from "@/data/invitation";

type Stage = "sealed" | "cracking" | "flap" | "card" | "done";

export function EnvelopeScene({
  data,
  onOpened,
}: {
  data: InvitationConfig;
  onOpened: () => void;
}) {
  const [stage, setStage] = useState<Stage>("sealed");

  useEffect(() => {
    if (stage === "sealed") return;
    const timers: number[] = [];
    if (stage === "cracking") timers.push(window.setTimeout(() => setStage("flap"), 900));
    if (stage === "flap") timers.push(window.setTimeout(() => setStage("card"), 1150));
    if (stage === "card") timers.push(window.setTimeout(() => setStage("done"), 2400));
    if (stage === "done") timers.push(window.setTimeout(onOpened, 650));
    return () => timers.forEach(clearTimeout);
  }, [stage, onOpened]);

  const opening = stage !== "sealed";
  const flapOpen = stage === "flap" || stage === "card" || stage === "done";
  const cardOut = stage === "card" || stage === "done";

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden px-6"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 18%, oklch(0.975 0.014 92) 0%, oklch(0.925 0.024 84) 46%, oklch(0.845 0.032 76) 100%)",
      }}
      animate={{ opacity: stage === "done" ? 0 : 1 }}
      transition={{ duration: 0.7, delay: stage === "done" ? 0.9 : 0 }}
    >
      <Dust />

      <div className="relative w-full max-w-[430px]" style={{ perspective: 1600 }}>
        <motion.div
          role="button"
          tabIndex={0}
          aria-label="Open the wedding invitation"
          onClick={() => stage === "sealed" && setStage("cracking")}
          onKeyDown={(e) => {
            if (stage === "sealed" && (e.key === "Enter" || e.key === " ")) setStage("cracking");
          }}
          className="relative mx-auto aspect-[7/5] w-full cursor-pointer select-none outline-none"
          style={{ transformStyle: "preserve-3d" }}
          animate={{
            scale: opening ? 1.06 : 1,
            y: stage === "done" ? -40 : 0,
            rotateX: opening ? 4 : 8,
          }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* soft cast shadow */}
          <div
            aria-hidden="true"
            className="absolute -bottom-8 left-1/2 h-10 w-[86%] -translate-x-1/2 rounded-[50%]"
            style={{ background: "oklch(0.4 0.03 60 / 0.28)", filter: "blur(18px)" }}
          />

          {/* card sliding out from inside */}
          <motion.div
            aria-hidden="true"
            className="paper grain absolute left-1/2 top-0 h-[128%] w-[86%] -translate-x-1/2 rounded-[2px] border border-champagne/70"
            style={{ boxShadow: "var(--shadow-paper)", zIndex: 1 }}
            initial={{ y: "18%", scale: 0.96, opacity: 0 }}
            animate={
              cardOut
                ? { y: "-46%", scale: 1, opacity: 1 }
                : { y: "16%", scale: 0.96, opacity: flapOpen ? 1 : 0 }
            }
            transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
              <span className="font-sans text-[10px] uppercase tracking-luxe text-muted-foreground">
                The Wedding of
              </span>
              <h2 className="font-display text-3xl leading-tight text-ink">
                {data.groomName}
                {data.groomName && data.brideName && (
                  <span className="mx-2 text-gold">&</span>
                )}
                {data.brideName}
              </h2>
              {data.dateDisplay && (
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold-deep">
                  {data.dateDisplay}
                </span>
              )}
            </div>
          </motion.div>

          {/* envelope back */}
          <div
            className="absolute inset-0 rounded-[3px]"
            style={{
              background: "linear-gradient(160deg, var(--cream), var(--champagne))",
              boxShadow: "var(--shadow-lift)",
            }}
          />

          {/* envelope front pocket */}
          <div
            className="grain absolute inset-0 overflow-hidden rounded-[3px]"
            style={{ zIndex: 3 }}
          >
            <div
              className="absolute inset-x-0 bottom-0 top-[26%]"
              style={{
                background:
                  "linear-gradient(168deg, oklch(0.965 0.014 92), oklch(0.915 0.028 84))",
                boxShadow: "inset 0 1px 0 oklch(1 0 0 / 0.7), 0 -6px 18px oklch(0.4 0.03 60 / 0.18)",
              }}
            />
            {/* side folds */}
            <div
              className="absolute inset-x-0 bottom-0 top-[26%]"
              style={{
                background:
                  "linear-gradient(115deg, oklch(0.4 0.03 60 / 0.09) 0 42%, transparent 42%), linear-gradient(245deg, oklch(0.4 0.03 60 / 0.09) 0 42%, transparent 42%)",
              }}
            />
            <div className="absolute inset-x-6 bottom-6 top-[34%] border border-gold/30" />
          </div>

          {/* flap */}
          <motion.div
            className="grain absolute inset-x-0 top-0 h-[58%] origin-top"
            style={{
              zIndex: flapOpen ? 2 : 6,
              transformStyle: "preserve-3d",
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
              background: "linear-gradient(180deg, oklch(0.955 0.016 90), oklch(0.9 0.03 84))",
              boxShadow: "0 6px 14px oklch(0.4 0.03 60 / 0.2)",
            }}
            animate={{ rotateX: flapOpen ? -172 : 0 }}
            transition={{ duration: 1.15, ease: [0.65, 0, 0.35, 1] }}
          >
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, transparent 60%, oklch(0.4 0.03 60 / 0.12) 100%)",
              }}
            />
          </motion.div>

          {/* wax seal */}
          <div
            className="pointer-events-none absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2"
            style={{ zIndex: 8 }}
          >
            <AnimatePresence>
              {!flapOpen && (
                <motion.div
                  className="relative"
                  initial={{ scale: 1 }}
                  animate={
                    stage === "cracking"
                      ? { scale: [1, 0.9, 1.05, 1] }
                      : { scale: [1, 1.02, 1] }
                  }
                  exit={{ opacity: 0 }}
                  transition={
                    stage === "cracking"
                      ? { duration: 0.5, times: [0, 0.25, 0.6, 1] }
                      : { duration: 4.5, repeat: Infinity, ease: "easeInOut" }
                  }
                >
                  {[-1, 1].map((dir) => (
                    <motion.div
                      key={dir}
                      className="absolute inset-0"
                      style={{
                        clipPath:
                          dir === -1
                            ? "polygon(0 0, 52% 0, 44% 100%, 0 100%)"
                            : "polygon(52% 0, 100% 0, 100% 100%, 44% 100%)",
                      }}
                      animate={
                        stage === "cracking"
                          ? { x: dir * 26, rotate: dir * 16, y: 12, opacity: 0 }
                          : { x: 0, rotate: 0, y: 0, opacity: 1 }
                      }
                      transition={{ duration: 0.75, delay: 0.32, ease: [0.3, 0, 0.2, 1] }}
                    >
                      <SealFace label={data.monogram} />
                    </motion.div>
                  ))}
                  <div className="opacity-0">
                    <SealFace label={data.monogram} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* glints */}
            <AnimatePresence>
              {stage === "cracking" &&
                [0, 1, 2, 3, 4].map((i) => (
                  <motion.span
                    key={i}
                    className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full bg-champagne"
                    initial={{ opacity: 0.9, scale: 1 }}
                    animate={{
                      opacity: 0,
                      scale: 0.2,
                      x: Math.cos((i / 5) * Math.PI * 2) * 54,
                      y: Math.sin((i / 5) * Math.PI * 2) * 40 + 10,
                    }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.9, delay: 0.34 }}
                  />
                ))}
            </AnimatePresence>
          </div>
        </motion.div>

        <AnimatePresence>
          {stage === "sealed" && (
            <motion.div
              className="mt-14 flex flex-col items-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Crest label={data.monogram} className="opacity-80" />
              <motion.span
                className="font-sans text-[11px] uppercase tracking-luxe text-gold-deep"
                animate={{ opacity: [0.45, 1, 0.45] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                Tap to open
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function SealFace({ label }: { label: string }) {
  return (
    <div
      className="relative flex h-[74px] w-[74px] items-center justify-center rounded-full"
      style={{
        background:
          "radial-gradient(60% 60% at 34% 28%, oklch(0.55 0.13 26), var(--wax) 55%, var(--wax-deep) 100%)",
        boxShadow:
          "inset 0 2px 4px oklch(1 0 0 / 0.18), inset 0 -4px 8px oklch(0.2 0.06 24 / 0.6), 0 6px 14px oklch(0.3 0.04 30 / 0.4)",
        clipPath:
          "polygon(50% 0%, 66% 6%, 82% 4%, 92% 18%, 100% 33%, 96% 50%, 100% 67%, 88% 80%, 78% 94%, 60% 97%, 44% 100%, 28% 92%, 12% 86%, 4% 70%, 2% 50%, 0% 32%, 12% 18%, 24% 6%, 38% 3%)",
      }}
    >
      <span
        className="font-display text-base tracking-[0.12em]"
        style={{ color: "oklch(0.86 0.05 60 / 0.85)", textShadow: "0 1px 0 oklch(0.25 0.06 24)" }}
      >
        {label}
      </span>
    </div>
  );
}
