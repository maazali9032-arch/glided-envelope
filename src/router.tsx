import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    // Router parameter decoding happens before the page's slug validation.
    // Resolve malformed escapes to the existing not-found root internally,
    // keeping the original browser URL and avoiding URIError/SSR failures.
    rewrite: {
      input: ({ url }) => {
        try {
          decodeURIComponent(url.pathname);
          return url;
        } catch {
          const safe = new URL(url);
          safe.pathname = "/";
          return safe;
        }
      },
    },
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
  });

  return router;
};
