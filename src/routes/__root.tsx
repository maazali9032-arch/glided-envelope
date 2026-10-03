import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { ErrorScreen, NotFoundScreen } from "@/components/invite/States";

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <ErrorScreen
      onRetry={() => {
        void router.invalidate();
        reset();
      }}
    />
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Wedding Invitation" },
      { name: "description", content: "Open your personal wedding invitation." },
      { property: "og:title", content: "Wedding Invitation" },
      { property: "og:description", content: "Open your personal wedding invitation." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "msapplication-TileColor", content: "#ffffff" },
      { name: "msapplication-TileImage", content: "/ms-icon-144x144.png" },
      { name: "msapplication-config", content: "/browserconfig.xml" },
      { name: "theme-color", content: "#f8f4eb" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Jost:wght@300;400;500&family=Noto+Naskh+Arabic:wght@400;600&display=swap",
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      ...[16, 32, 96].map((size) => ({
        rel: "icon",
        href: `/favicon-${size}x${size}.png`,
        type: "image/png",
        sizes: `${size}x${size}`,
      })),
      ...[57, 60, 72, 76, 114, 120, 144, 152, 180].map((size) => ({
        rel: "apple-touch-icon",
        href: `/apple-icon-${size}x${size}.png`,
        sizes: `${size}x${size}`,
      })),
      { rel: "manifest", href: "/manifest.json" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundScreen,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
      <Outlet />
    </QueryClientProvider>
  );
}
