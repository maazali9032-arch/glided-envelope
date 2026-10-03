/**
 * ZAR public invitation integration.
 *
 * The browser talks to exactly one endpoint of the central project:
 *   POST {VITE_SUPABASE_URL}/rest/v1/rpc/get_public_invitation_content
 * using only VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
 * No tables are queried directly and all RPC fields are treated as untrusted.
 */

import type {
  ContactEntry,
  EventItem,
  GalleryPhoto,
  InvitationConfig,
  ShopFallback,
} from "@/data/invitation";

// ---------- slug ----------

/**
 * The invitation slug is the last non-empty pathname segment, percent-decoded.
 * Returns null for empty, malformed, or slash-containing slugs (-> not_found).
 */
export function readSlugFromPathname(pathname: string): string | null {
  const segments = pathname.split("/").filter((s) => s.length > 0);
  const last = segments[segments.length - 1];
  if (!last) return null;
  let decoded: string;
  try {
    decoded = decodeURIComponent(last);
  } catch {
    return null;
  }
  const trimmed = decoded.trim();
  if (!trimmed || trimmed.includes("/") || trimmed.includes("\\")) return null;
  return trimmed;
}

// ---------- untrusted payload types ----------

interface RpcResponse {
  state?: unknown;
  invitation?: unknown;
  content?: unknown;
  detail?: unknown;
  shop?: unknown;
  data?: unknown; // possible outer envelope
}

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

function str(v: unknown): string | undefined {
  return typeof v === "string" && v.trim().length > 0 ? v.trim() : undefined;
}

/** Only absolute HTTP(S) URLs from the public payload may become links/media. */
export function publicUrl(v: unknown): string | undefined {
  const value = str(v);
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:" ? value : undefined;
  } catch {
    return undefined;
  }
}

// ---------- fetch ----------

export type PublicInvitationResult =
  | { kind: "live"; config: InvitationConfig }
  | { kind: "fallback"; shop: ShopFallback }
  | { kind: "not_found" }
  | { kind: "error" };

export async function loadPublicInvitation(slug: string): Promise<PublicInvitationResult> {
  const base = import.meta.env["VITE_SUPABASE_URL"] as string | undefined;
  const anonKey = import.meta.env["VITE_SUPABASE_ANON_KEY"] as string | undefined;
  if (!base || !anonKey) return { kind: "error" };

  let res: Response;
  try {
    res = await fetch(`${base.replace(/\/+$/, "")}/rest/v1/rpc/get_public_invitation_content`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ p_slug: slug }),
      signal: AbortSignal.timeout(15000),
    });
  } catch {
    return { kind: "error" };
  }
  if (!res.ok) return { kind: "error" };

  let raw: unknown;
  try {
    raw = await res.json();
  } catch {
    return { kind: "error" };
  }

  return normalizePublicInvitation(raw);
}

export function normalizePublicInvitation(raw: unknown): PublicInvitationResult {
  // Normalize a possible outer { data: ... } envelope exactly once.
  let payload: RpcResponse = isObj(raw) ? (raw as RpcResponse) : {};
  if (payload["state"] === undefined && isObj(payload["data"])) {
    payload = payload["data"] as RpcResponse;
  }

  if (payload["state"] === "live" && isObj(payload["content"])) {
    const config = mapLiveContent(payload["content"]);
    // Read only the approved public shop name; never pass shop contacts into live UI.
    config.brandName = isObj(payload["shop"]) ? str(payload["shop"]["name"]) : undefined;
    return { kind: "live", config };
  }
  if (payload["state"] === "fallback") {
    return { kind: "fallback", shop: mapShop(payload["shop"]) };
  }
  return payload["state"] === "not_found" ? { kind: "not_found" } : { kind: "error" };
}

// ---------- mapping ----------

const ARABIC_RE = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]/;

function mapLiveContent(content: Record<string, unknown>): InvitationConfig {
  const groomName = str(content["groom_name"]) ?? "";
  const brideName = str(content["bride_name"]) ?? "";
  const monogram =
    [groomName, brideName]
      .map((n) => n.charAt(0).toUpperCase())
      .filter(Boolean)
      .join(" & ") || "✦";

  const dateDisplay = str(content["wedding_date"]);
  const startTime = str(content["start_time"]);
  const endTime = str(content["end_time"]);
  const timeDisplay = startTime && endTime ? `${startTime} – ${endTime}` : (startTime ?? endTime);

  const events = Array.isArray(content["events"])
    ? content["events"].map(mapEvent).filter((e): e is EventItem => e !== null)
    : [];

  const gallery = mapGallery(content);

  const contacts: ContactEntry[] = [];
  if (Array.isArray(content["contacts"])) {
    for (const raw of content["contacts"].slice(0, 2)) {
      if (!isObj(raw)) continue;
      const phone = str(raw["phone"]);
      if (!phone) continue;
      const whatsappUrl =
        publicUrl(raw["whatsapp_url"]) ??
        (phone.replace(/\D/g, "") ? `https://wa.me/${phone.replace(/\D/g, "")}` : undefined);
      contacts.push({ name: str(raw["name"]), phone, whatsappUrl });
    }
  }

  return {
    groomProfile: {
      name: str(content["groom_name"]),
      photo: publicUrl(content["groom_photo_url"]),
      qualification: str(content["groom_qualification"]),
      occupation: str(content["groom_occupation"]),
      parents: str(content["groom_parents"]),
    },
    brideProfile: {
      name: str(content["bride_name"]),
      photo: publicUrl(content["bride_photo_url"]),
      qualification: str(content["bride_qualification"]),
      occupation: str(content["bride_occupation"]),
      parents: str(content["bride_parents"]),
    },
    relatives: str(content["relatives"]),
    monogram,
    groomName,
    brideName,
    invocationText: str(content["invocation"]),
    invocationRtl: ARABIC_RE.test(str(content["invocation"]) ?? ""),
    dateDisplay,
    timeDisplay,
    countdownTarget: computeCountdownTarget(dateDisplay, startTime),
    events,
    venue: {
      name: str(content["venue_name"]),
      address: str(content["venue_address"]),
      city: str(content["city"]),
      mapsUrl: publicUrl(content["maps_url"]),
      imageUrl: publicUrl(content["venue_image_url"]),
    },
    gallery,
    music: {
      enabled: content["music_enabled"] === true,
      url: publicUrl(content["music_url"]),
    },
    contacts,
  };
}

function computeCountdownTarget(date?: string, time?: string): number | undefined {
  if (!date) return undefined;
  const candidates = time ? [`${date}T${time}`, `${date} ${time}`] : [date];
  for (const c of candidates) {
    const t = new Date(c).getTime();
    if (!Number.isNaN(t)) return t;
  }
  return undefined;
}

function mapEvent(raw: unknown, index: number): EventItem | null {
  if (!isObj(raw)) return null;
  const ev: EventItem = {
    id: str(raw["id"]) ?? `event-${index}`,
    name: str(raw["name"]) ?? str(raw["title"]) ?? str(raw["event_name"]),
    date: str(raw["date"]) ?? str(raw["event_date"]),
    time: str(raw["time"]) ?? str(raw["start_time"]),
    venue: str(raw["venue"]) ?? str(raw["venue_name"]),
    city: str(raw["city"]),
    mapsUrl: publicUrl(raw["maps_url"]) ?? publicUrl(raw["mapsUrl"]),
    description: str(raw["description"]) ?? str(raw["note"]),
  };
  if (!ev.name && !ev.date && !ev.time && !ev.venue && !ev.city && !ev.description && !ev.mapsUrl)
    return null;
  return ev;
}

function mapGallery(content: Record<string, unknown>): GalleryPhoto[] {
  const photos: GalleryPhoto[] = [];
  const push = (src: string | undefined, alt: string, caption?: string) => {
    const safeSrc = publicUrl(src);
    if (safeSrc && !photos.some((photo) => photo.src === safeSrc))
      photos.push({ src: safeSrc, alt, caption });
  };

  // Couple portraits lead the gallery when present.
  push(str(content["groom_photo_url"]), str(content["groom_name"]) ?? "Groom");
  push(str(content["bride_photo_url"]), str(content["bride_name"]) ?? "Bride");

  if (Array.isArray(content["gallery"])) {
    for (const item of content["gallery"]) {
      if (typeof item === "string") {
        push(str(item), "Wedding photo");
      } else if (isObj(item)) {
        push(
          str(item["url"]) ?? str(item["src"]) ?? str(item["image_url"]),
          str(item["alt"]) ?? "Wedding photo",
          str(item["caption"]),
        );
      }
    }
  }
  return photos;
}

function mapShop(raw: unknown): ShopFallback {
  if (!isObj(raw)) return {};
  return {
    name: str(raw["name"]),
    phone: str(raw["phone"]),
    whatsapp: publicUrl(raw["whatsapp"]),
    address: str(raw["address"]),
    city: str(raw["city"]),
    business_contact: str(raw["business_contact"]),
  };
}
