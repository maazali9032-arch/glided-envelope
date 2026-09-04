import { useEffect, useState } from "react";

interface Diff {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function diff(target: number): Diff {
  const ms = Math.max(0, target - Date.now());
  return {
    days: Math.floor(ms / 86400000),
    hours: Math.floor(ms / 3600000) % 24,
    minutes: Math.floor(ms / 60000) % 60,
    seconds: Math.floor(ms / 1000) % 60,
  };
}

export function Countdown({ target }: { target: number }) {
  // Start with null so SSR and the first client render match; tick after mount.
  const [t, setT] = useState<Diff | null>(null);

  useEffect(() => {
    setT(diff(target));
    const id = window.setInterval(() => setT(diff(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const items = [
    { label: "Days", value: t?.days },
    { label: "Hours", value: t?.hours },
    { label: "Minutes", value: t?.minutes },
    { label: "Seconds", value: t?.seconds },
  ];

  return (
    <div className="mx-auto flex max-w-sm items-stretch justify-center">
      {items.map((it, i) => (
        <div key={it.label} className="flex flex-1 items-stretch">
          {i > 0 && <span className="my-2 w-px bg-gold/30" />}
          <div className="flex-1 px-1 py-2 text-center">
            <div className="font-display text-3xl leading-none text-ink tabular-nums sm:text-4xl">
              {it.value === undefined ? "--" : String(it.value).padStart(2, "0")}
            </div>
            <div className="mt-2 font-sans text-[9px] uppercase tracking-[0.24em] text-muted-foreground">
              {it.label}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
