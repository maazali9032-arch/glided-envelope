import { createFileRoute } from "@tanstack/react-router";
import { NotFoundScreen } from "@/components/invite/States";

const title = "Wedding Invitation";
const description =
  "Open your personal wedding invitation link to view the celebration details.";

export const Route = createFileRoute("/")({
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
  component: Index,
});

function Index() {
  // Invitations live at /:slug only; the bare root has no slug, which the
  // integration contract treats as not found.
  return <NotFoundScreen />;
}
