import { defineErrorHandler } from "nitro";
import server from "../server";

/** H3 rejects malformed URL escapes before the invitation router runs. */
export default defineErrorHandler(async (error, event, { defaultHandler }) => {
  if (error.status === 400) {
    let malformed = false;
    try {
      decodeURIComponent(new URL(event.req.url).pathname);
    } catch {
      malformed = true;
    }
    if (malformed) {
      // Render the existing not-found route without redirecting the guest or
      // loading any invitation. The client router also handles the raw URL.
      const url = new URL(event.req.url);
      url.pathname = "/";
      const response = await server.fetch(new Request(url, event.req), undefined, undefined);
      return new Response(response.body, { status: 404, headers: response.headers });
    }
  }
  const fallback = await defaultHandler(error, event);
  if (fallback instanceof Response) return fallback;
  return new Response(
    typeof fallback.body === "string" ? fallback.body : JSON.stringify(fallback.body),
    { status: fallback.status ?? 500, headers: new Headers(fallback.headers) },
  );
});
