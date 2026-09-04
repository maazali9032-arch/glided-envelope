import { useCallback, useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { EnvelopeScene } from "@/components/invite/EnvelopeScene";
import { InvitationLetter } from "@/components/invite/InvitationLetter";
import { MusicToggle } from "@/components/invite/MusicToggle";
import {
  ErrorScreen,
  FallbackScreen,
  LoadingScreen,
  NotFoundScreen,
} from "@/components/invite/States";
import {
  loadPublicInvitation,
  readSlugFromPathname,
  type PublicInvitationResult,
} from "@/lib/public-invitation";

const title = "Wedding Invitation";
const description =
  "You are invited — open the envelope to view the wedding invitation, events and details.";

export const Route = createFileRoute("/$slug")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SlugPage,
});

function SlugPage() {
  const [result, setResult] = useState<PublicInvitationResult>({ kind: "not_found" });
  const [loading, setLoading] = useState(true);
  const [opened, setOpened] = useState(false);
  const [interacted, setInteracted] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const slug = readSlugFromPathname(window.location.pathname);
    if (!slug) {
      setResult({ kind: "not_found" });
      setLoading(false);
      return;
    }
    setResult(await loadPublicInvitation(slug));
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const live = result.kind === "live";

  useEffect(() => {
    document.body.style.overflow = live && !opened ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [live, opened]);

  const handleOpened = useCallback(() => setOpened(true), []);

  if (loading) return <LoadingScreen />;
  if (result.kind === "error") return <ErrorScreen onRetry={() => void load()} />;
  if (result.kind === "not_found") return <NotFoundScreen />;
  if (result.kind === "fallback") return <FallbackScreen shop={result.shop} />;

  const data = result.config;

  return (
    <div className="relative min-h-screen bg-background">
      <AnimatePresence>
        {!opened && (
          <div onPointerDown={() => setInteracted(true)}>
            <EnvelopeScene data={data} onOpened={handleOpened} />
          </div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: opened ? 1 : 0 }}
        transition={{ duration: 1 }}
      >
        <InvitationLetter data={data} />
      </motion.div>

      {data.music.enabled && <MusicToggle start={interacted} url={data.music.url} />}
    </div>
  );
}
