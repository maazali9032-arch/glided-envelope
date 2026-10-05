import { useCallback, useEffect, useState } from "react";
import { createFileRoute, useLocation } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { EnvelopeScene } from "@/components/invite/EnvelopeScene";
import { InvitationLetter } from "@/components/invite/InvitationLetter";
import { MusicToggle } from "@/components/invite/MusicToggle";
import { BrandRibbon } from "@/components/invite/BrandRibbon";
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
  const pathname = useLocation({ select: (location) => location.pathname });
  return <InvitationPage key={pathname} pathname={pathname} />;
}

function InvitationPage({ pathname }: { pathname: string }) {
  const slug = readSlugFromPathname(pathname);
  const {
    data: response,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["public-invitation", slug],
    queryFn: () => loadPublicInvitation(slug!),
    enabled: Boolean(slug),
    retry: false,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
  const result: PublicInvitationResult = slug
    ? (response ?? { kind: "error" })
    : { kind: "not_found" };
  const loading = Boolean(slug) && isPending;
  const [opened, setOpened] = useState(false);
  const [interacted, setInteracted] = useState(false);

  const live = result.kind === "live";

  useEffect(() => {
    document.body.style.overflow = live && !opened ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [live, opened]);

  const handleOpened = useCallback(() => setOpened(true), []);

  if (loading) return <LoadingScreen />;
  if (result.kind === "error") return <ErrorScreen onRetry={() => void refetch()} />;
  if (result.kind === "not_found") return <NotFoundScreen />;
  if (result.kind === "fallback") return <FallbackScreen shop={result.shop} />;

  const data = result.config;

  return (
    <div className="relative min-h-screen bg-background">
      {opened && (
        <img
          src="/decorative-frame.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-50 hidden h-screen w-screen object-fill opacity-50 max-[684px]:block"

          // className="pointer-events-none fixed inset-0 z-40 hidden h-screen w-screen object-fill opacity-50 max-[684px]:block"
        />
      )}
      <div className="relative z-30">
        <AnimatePresence>
          {!opened && (
            <EnvelopeScene
              data={data}
              onOpened={handleOpened}
              onInteract={() => setInteracted(true)}
            />
          )}
        </AnimatePresence>

        <motion.div
          inert={!opened}
          aria-hidden={!opened}
          initial={{ opacity: 0 }}
          animate={{ opacity: opened ? 1 : 0 }}
          transition={{ duration: 1 }}
        >
          <InvitationLetter data={data} />
        </motion.div>
      </div>

      <div className="relative z-[60]">
        {data.music.enabled && <MusicToggle start={interacted} url={data.music.url} />}
        <BrandRibbon name={data.brandName} />
      </div>
    </div>
  );
}
