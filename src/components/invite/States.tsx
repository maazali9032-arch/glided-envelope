import { MessageCircle, Phone } from "lucide-react";
import { motion } from "motion/react";
import { Crest, Ornament } from "./Ornament";
import { Dust } from "./Dust";
import type { ShopFallback } from "@/data/invitation";

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center overflow-hidden px-6"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 18%, oklch(0.975 0.014 92) 0%, oklch(0.925 0.024 84) 46%, oklch(0.845 0.032 76) 100%)",
      }}
    >
      <Dust />
      <div className="paper grain relative w-full max-w-[430px] border border-champagne/70 px-8 py-16 text-center shadow-[var(--shadow-paper)]">
        {children}
      </div>
    </div>
  );
}

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="block font-sans text-[9px] uppercase tracking-luxe text-gold-deep">
      {children}
    </span>
  );
}

export function LoadingScreen() {
  return (
    <Shell>
      <div className="flex flex-col items-center gap-8">
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5], scale: [0.98, 1, 0.98] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <Crest label="✦" className="opacity-80" />
        </motion.div>
        <Ornament />
        <Kicker>Preparing your invitation</Kicker>
      </div>
    </Shell>
  );
}

export function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <Shell>
      <div className="flex flex-col items-center gap-6">
        <Crest label="✦" className="opacity-80" />
        <Kicker>A Moment Please</Kicker>
        <h1 className="font-display text-3xl text-ink">We could not load the invitation</h1>
        <p className="max-w-xs font-display text-base italic text-muted-foreground">
          Please check your connection and try again.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-2 border border-gold px-7 py-3 font-sans text-[10px] uppercase tracking-luxe text-gold-deep transition-colors hover:bg-champagne/40"
        >
          Try again
        </button>
      </div>
    </Shell>
  );
}

export function NotFoundScreen() {
  return (
    <Shell>
      <div className="flex flex-col items-center gap-6">
        <Crest label="✦" className="opacity-80" />
        <Kicker>Invitation Not Found</Kicker>
        <h1 className="font-display text-3xl text-ink">This invitation is unavailable</h1>
        <Ornament />
        <p className="max-w-xs font-display text-base italic text-muted-foreground">
          The link you followed does not match an invitation. Please verify the link with the
          sender.
        </p>
      </div>
    </Shell>
  );
}

export function FallbackScreen({ shop }: { shop: ShopFallback }) {
  const whatsapp =
    shop.whatsapp ?? (shop.phone ? `https://wa.me/${shop.phone.replace(/\D/g, "")}` : undefined);
  return (
    <Shell>
      <div className="flex flex-col items-center gap-6">
        <Crest label="✦" className="opacity-80" />
        <Kicker>No Longer Available</Kicker>
        <h1 className="font-display text-3xl text-ink">This invitation has expired</h1>
        <p className="max-w-xs font-display text-base italic text-muted-foreground">
          This invitation is no longer available. For assistance, please contact the studio.
        </p>
        {(shop.name || shop.address || shop.city) && (
          <div className="mt-2 flex flex-col items-center gap-1">
            {shop.name && <p className="font-display text-xl text-ink">{shop.name}</p>}
            {shop.address && (
              <p className="font-display text-base text-muted-foreground">{shop.address}</p>
            )}
            {shop.city && (
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold-deep">
                {shop.city}
              </p>
            )}
          </div>
        )}
        {(shop.phone || whatsapp) && (
          <div className="mt-2 flex items-center gap-4">
            {shop.phone && (
              <a
                href={`tel:${shop.phone}`}
                className="inline-flex items-center gap-2 border border-gold px-5 py-2.5 font-sans text-[10px] uppercase tracking-luxe text-gold-deep transition-colors hover:bg-champagne/40"
              >
                <Phone size={12} /> Call
              </a>
            )}
            {whatsapp && (
              <a
                href={whatsapp}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 border border-gold px-5 py-2.5 font-sans text-[10px] uppercase tracking-luxe text-gold-deep transition-colors hover:bg-champagne/40"
              >
                <MessageCircle size={12} /> WhatsApp
              </a>
            )}
          </div>
        )}
        {shop.business_contact && !shop.phone && (
          <p className="font-display text-base text-muted-foreground">{shop.business_contact}</p>
        )}
      </div>
    </Shell>
  );
}
