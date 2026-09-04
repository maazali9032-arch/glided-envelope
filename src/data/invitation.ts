/**
 * View-model types for the invitation design.
 *
 * Data never comes from local files at runtime — it is mapped from the central
 * public RPC `get_public_invitation_content` (see src/lib/public-invitation.ts).
 * Every field is optional-safe: empty values hide their UI.
 */

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption?: string | undefined;
}

export interface ContactEntry {
  name?: string | undefined;
  phone: string;
  whatsappUrl?: string | undefined;
}

export interface EventItem {
  id: string;
  name?: string | undefined;
  date?: string | undefined;
  time?: string | undefined;
  venue?: string | undefined;
  city?: string | undefined;
  description?: string | undefined;
  mapsUrl?: string | undefined;
}

export interface InvitationConfig {
  monogram: string;
  groomName: string;
  brideName: string;
  invocationText?: string | undefined;
  invocationRtl: boolean;
  dateDisplay?: string | undefined;
  timeDisplay?: string | undefined;
  /** epoch ms; countdown renders only when this is a valid future time */
  countdownTarget?: number | undefined;
  events: EventItem[];
  venue: {
    name?: string | undefined;
    address?: string | undefined;
    city?: string | undefined;
    mapsUrl?: string | undefined;
    imageUrl?: string | undefined;
  };
  gallery: GalleryPhoto[];
  music: { enabled: boolean; url?: string | undefined };
  contacts: ContactEntry[];
}

export interface ShopFallback {
  name?: string | undefined;
  phone?: string | undefined;
  whatsapp?: string | undefined;
  address?: string | undefined;
  city?: string | undefined;
  business_contact?: string | undefined;
}
