import { motion } from "motion/react";
import { MapPin } from "lucide-react";
import { FoldPanel } from "./FoldPanel";
import { Ornament, Crest } from "./Ornament";
import { Countdown } from "./Countdown";
import { Gallery } from "./Gallery";
import { Contacts } from "./Contacts";
import type { InvitationConfig } from "@/data/invitation";

function Kicker({ children }: { children: React.ReactNode }) {
  return (
    <span className="block text-center font-sans text-[9px] uppercase tracking-luxe text-gold-deep">
      {children}
    </span>
  );
}

export function InvitationLetter({ data }: { data: InvitationConfig }) {
  const names = [data.groomName, data.brideName].filter(Boolean);
  const showCountdown =
    typeof data.countdownTarget === "number" && data.countdownTarget > Date.now();
  const venue = data.venue;
  const hasVenue = Boolean(venue.name || venue.address || venue.city || venue.imageUrl);

  return (
    <main className="mx-auto w-full max-w-[560px] overflow-hidden shadow-[var(--shadow-lift)]">
      {/* Invocation */}
      {data.invocationText && (
        <FoldPanel id="invocation" className="min-h-[70vh] pt-24">
          <div className="flex flex-col items-center gap-10">
            <Ornament />
            <motion.p
              dir={data.invocationRtl ? "rtl" : "ltr"}
              lang={data.invocationRtl ? "ar" : undefined}
              initial={{ opacity: 0, filter: "blur(10px)", y: 14 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0 }}
              viewport={{ once: true, amount: 0.6 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              className={`text-center text-2xl leading-[2] text-ink sm:text-3xl ${
                data.invocationRtl ? "font-arabic" : "font-display"
              }`}
            >
              {data.invocationText}
            </motion.p>
            <Ornament />
          </div>
        </FoldPanel>
      )}

      {/* Couple */}
      <FoldPanel id="couple" className={data.invocationText ? "" : "min-h-[70vh] pt-24"}>
        <div className="flex flex-col items-center gap-6 text-center">
          <Kicker>The Wedding Of</Kicker>
          {(names.length === 2
            ? [data.groomName, "&", data.brideName]
            : names
          ).map((word, i) => (
            <motion.h1
              key={word + i}
              initial={{ opacity: 0, filter: "blur(14px)", y: 18, scale: 0.97 }}
              whileInView={{ opacity: 1, filter: "blur(0px)", y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1.6, delay: 0.35 * i, ease: [0.16, 1, 0.3, 1] }}
              className={
                word === "&"
                  ? "font-display text-2xl italic text-gold"
                  : "font-display text-5xl uppercase leading-none tracking-[0.08em] text-ink sm:text-6xl"
              }
            >
              {word}
            </motion.h1>
          ))}
          {(data.dateDisplay || data.timeDisplay) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 1.15 }}
              className="mt-4 flex flex-col items-center gap-4"
            >
              <Ornament />
              {data.dateDisplay && (
                <span className="font-sans text-[11px] uppercase tracking-[0.3em] text-gold-deep">
                  {data.dateDisplay}
                </span>
              )}
              {data.timeDisplay && (
                <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                  {data.timeDisplay}
                </span>
              )}
            </motion.div>
          )}
        </div>
      </FoldPanel>

      {/* Countdown */}
      {showCountdown && (
        <FoldPanel id="countdown">
          <div className="flex flex-col items-center gap-8">
            <Kicker>Counting the Days</Kicker>
            <Countdown target={data.countdownTarget!} />
            <Ornament />
          </div>
        </FoldPanel>
      )}

      {/* Events */}
      {data.events.length > 0 && (
        <FoldPanel id="events">
          <div className="flex flex-col items-center gap-14">
            <Kicker>The Celebrations</Kicker>
            {data.events.map((ev) => (
              <motion.article
                key={ev.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-xs text-center"
              >
                {ev.name && (
                  <h2 className="font-display text-3xl uppercase tracking-[0.2em] text-ink">
                    {ev.name}
                  </h2>
                )}
                <div className="gold-rule mx-auto mt-4 h-px w-20" />
                {ev.date && (
                  <p className="mt-5 font-sans text-[11px] uppercase tracking-[0.24em] text-gold-deep">
                    {ev.date}
                  </p>
                )}
                {ev.time && (
                  <p className="mt-1 font-sans text-[11px] uppercase tracking-[0.24em] text-gold-deep">
                    {ev.time}
                  </p>
                )}
                {ev.venue && <p className="mt-5 font-display text-xl text-ink">{ev.venue}</p>}
                {ev.city && (
                  <p className="font-display text-base text-muted-foreground">{ev.city}</p>
                )}
                {ev.description && (
                  <p className="mt-3 font-display text-sm italic text-muted-foreground">
                    {ev.description}
                  </p>
                )}
                {ev.mapsUrl && (
                  <a
                    href={ev.mapsUrl}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="mt-6 inline-flex items-center gap-2 border-b border-gold pb-1 font-sans text-[10px] uppercase tracking-[0.24em] text-gold-deep transition-opacity hover:opacity-70"
                  >
                    <MapPin size={12} /> View location
                  </a>
                )}
              </motion.article>
            ))}
          </div>
        </FoldPanel>
      )}

      {/* Gallery */}
      {data.gallery.length > 0 && (
        <FoldPanel id="gallery">
          <div className="flex flex-col items-center gap-12">
            <Kicker>Moments</Kicker>
            <Gallery photos={data.gallery} />
          </div>
        </FoldPanel>
      )}

      {/* Venue */}
      {hasVenue && (
        <FoldPanel id="venue">
          <div className="flex flex-col items-center gap-6 text-center">
            <Kicker>The Venue</Kicker>
            {venue.imageUrl && (
              <img
                src={venue.imageUrl}
                alt={venue.name ?? "Wedding venue"}
                loading="lazy"
                className="w-full max-w-xs border border-champagne/70 object-cover shadow-[var(--shadow-paper)]"
              />
            )}
            {venue.name && <h2 className="font-display text-3xl text-ink">{venue.name}</h2>}
            {venue.address && (
              <p className="max-w-xs font-display text-lg leading-relaxed text-muted-foreground">
                {venue.address}
              </p>
            )}
            {venue.city && (
              <p className="font-sans text-[10px] uppercase tracking-[0.3em] text-gold-deep">
                {venue.city}
              </p>
            )}
            {venue.mapsUrl && (
              <a
                href={venue.mapsUrl}
                target="_blank"
                rel="noreferrer noopener"
                className="mt-4 border border-gold px-7 py-3 font-sans text-[10px] uppercase tracking-luxe text-gold-deep transition-colors hover:bg-champagne/40"
              >
                Get directions
              </a>
            )}
          </div>
        </FoldPanel>
      )}

      {/* Contacts */}
      {data.contacts.length > 0 && (
        <FoldPanel id="contact">
          <div className="flex flex-col items-center gap-10">
            <Kicker>Kindly Respond</Kicker>
            <p className="max-w-xs text-center font-display text-lg italic text-muted-foreground">
              Your presence is the greatest gift — please let us know if you can join us.
            </p>
            <Contacts contacts={data.contacts} />
          </div>
        </FoldPanel>
      )}

      {/* Closing */}
      <FoldPanel id="closing" className="min-h-[80vh]">
        <div className="flex flex-col items-center gap-8 pt-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.7, rotate: -14 }}
            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 1, ease: [0.34, 1.4, 0.64, 1] }}
          >
            <Crest label={data.monogram} />
          </motion.div>
          <Kicker>With Love</Kicker>
          {names.length > 0 && (
            <h2 className="font-display text-4xl uppercase leading-tight tracking-[0.12em] text-ink">
              {data.groomName}
              {names.length === 2 && <span className="text-gold"> & </span>}
              {data.brideName}
            </h2>
          )}
          <Ornament />
          <p className="max-w-xs font-display text-lg text-muted-foreground">
            Thank you for celebrating with us
          </p>
        </div>
      </FoldPanel>
    </main>
  );
}
