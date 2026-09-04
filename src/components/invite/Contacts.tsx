import { motion } from "motion/react";
import { MessageCircle, Phone } from "lucide-react";
import type { ContactEntry } from "@/data/invitation";

/**
 * Renders up to two invitation contacts. A contact appears only with a phone;
 * WhatsApp uses whatsapp_url or a digits-only wa.me link from the same phone.
 */
export function Contacts({ contacts }: { contacts: ContactEntry[] }) {
  if (contacts.length === 0) return null;

  return (
    <div className="flex w-full flex-col items-center gap-10">
      {contacts.map((c, i) => (
        <motion.div
          key={`${c.phone}-${i}`}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center gap-4 text-center"
        >
          {c.name && <p className="font-display text-2xl text-ink">{c.name}</p>}
          <p className="font-sans text-[11px] tracking-[0.2em] text-muted-foreground">{c.phone}</p>
          <div className="mt-1 flex items-center gap-4">
            <a
              href={`tel:${c.phone}`}
              className="inline-flex items-center gap-2 border border-gold px-6 py-3 font-sans text-[10px] uppercase tracking-luxe text-gold-deep transition-colors hover:bg-champagne/40"
            >
              <Phone size={12} /> Call
            </a>
            {c.whatsappUrl && (
              <a
                href={c.whatsappUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 border border-gold px-6 py-3 font-sans text-[10px] uppercase tracking-luxe text-gold-deep transition-colors hover:bg-champagne/40"
              >
                <MessageCircle size={12} /> WhatsApp
              </a>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
