export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      <span className="gold-rule h-px w-16 sm:w-24" />
      <svg width="26" height="26" viewBox="0 0 26 26" aria-hidden="true" className="text-gold">
        <g fill="none" stroke="currentColor" strokeWidth="0.9">
          <path d="M13 2c2.6 3.4 4 6.9 4 11s-1.4 7.6-4 11c-2.6-3.4-4-6.9-4-11S10.4 5.4 13 2Z" />
          <circle cx="13" cy="13" r="2.1" />
        </g>
      </svg>
      <span className="gold-rule h-px w-16 sm:w-24" />
    </div>
  );
}

export function Crest({ label, className = "" }: { label: string; className?: string }) {
  return (
    <div className={`relative flex flex-col items-center ${className}`}>
      <svg width="72" height="72" viewBox="0 0 72 72" aria-hidden="true" className="text-gold">
        <g fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.9">
          <circle cx="36" cy="36" r="27" />
          <circle cx="36" cy="36" r="23" strokeDasharray="1 4" />
          <path d="M36 6c5 6 7.5 12 7.5 18M36 66c-5-6-7.5-12-7.5-18" />
        </g>
      </svg>
      <span className="text-gold-foil absolute inset-0 flex items-center justify-center font-display text-lg tracking-[0.15em]">
        {label}
      </span>
    </div>
  );
}
