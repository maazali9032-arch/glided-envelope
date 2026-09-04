import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import type { GalleryPhoto } from "@/data/invitation";

export function Gallery({ photos }: { photos: GalleryPhoto[] }) {
  const [active, setActive] = useState<GalleryPhoto | null>(null);
  const tilt = [-3.2, 2.4, -1.6];
  const tiltAt = (i: number) => tilt[i % tilt.length] ?? 0;

  return (
    <>
      <div className="mx-auto flex max-w-md flex-col items-center gap-10">
        {photos.map((photo, i) => (
          <motion.button
            key={photo.src}
            type="button"
            onClick={() => setActive(photo)}
            initial={{ opacity: 0, y: 40, rotate: tiltAt(i) * 2 }}
            whileInView={{ opacity: 1, y: 0, rotate: tiltAt(i) }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
            className="group relative block w-[82%] bg-ivory p-3 pb-10 shadow-[var(--shadow-paper)]"
            style={{ marginLeft: i % 2 ? "12%" : "-6%" }}
          >
            {/* photo corners */}
            {[
              "left-0 top-0",
              "right-0 top-0 rotate-90",
              "right-0 bottom-0 rotate-180",
              "left-0 bottom-0 -rotate-90",
            ].map((pos) => (
              <span
                key={pos}
                aria-hidden="true"
                className={`absolute ${pos} h-5 w-5 border-l-[10px] border-t-[10px] border-l-champagne border-t-champagne opacity-80`}
              />
            ))}
            <div className="overflow-hidden">
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                className="w-full object-cover transition-transform duration-[2400ms] ease-out group-hover:scale-[1.06]"
              />
            </div>
            {photo.caption && (
              <span className="absolute inset-x-0 bottom-3 font-display text-sm italic text-muted-foreground">
                {photo.caption}
              </span>
            )}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/85 p-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActive(null)}
          >
            <button
              type="button"
              aria-label="Close photo"
              className="absolute right-4 top-[max(1rem,env(safe-area-inset-top))] text-cream"
              onClick={() => setActive(null)}
            >
              <X size={22} />
            </button>
            <motion.img
              src={active.src}
              alt={active.alt}
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="max-h-[82vh] w-auto max-w-full bg-ivory p-2 shadow-[var(--shadow-lift)]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
